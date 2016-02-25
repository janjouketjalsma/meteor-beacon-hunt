Template.beaconTest.helpers({
  'beacons': function(){


    if(Meteor.isCordova){
      let beaconRegion = Template.instance().beaconRegion.get();

      //Call getBeaconRegion
      return beaconRegion.getBeaconRegion();

    }else{
      return {
        identifier: "Not on cordova!"
      }
    }

  },
  'beaconCalculation': function(){
    if(Meteor.isCordova){
      return {
        'beaconInRange': Template.instance().beaconInRange.get(),
        'beaconDistance': Template.instance().beaconDistance.get()
      }
    }else{
      return {
        identifier: "Not on cordova!"
      }
    }
  }
});

Template.beaconTest.onCreated(function(){
   const beacons = [
    {
      identifier: "Big",
      uuid: "C3EFA9AF-5CC0-4906-B952-F5B15D428D43"
    },
    {
      identifier: "Bed",
      uuid: "D0D3FA86-CA76-45EC-9BD9-6AF428C8C61F"
    },
    {
      identifier: "Fridge",
      uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4EB014D04"
   },
    {
      identifier: "Dog",
      uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4BBEBADDD"
   }
  ];

  //Calculate our target combination (for gameplay)
  let targetCombination = [3,2,1,4].map((beaconIndex)=>{
    return beacons[beaconIndex-1].uuid;
  });

  //Store the unlocked status of the beacon (default is locked)
  this.boxLocked = new ReactiveVar(true);

  //Function that should be called on every update of a beacon
  let currentCombination = [];
  unLockTheBox = (uuid,distance)=>{
    const found = 1;
    if(distance < 1){
      //You found a beacon!

      //Add this beacon to the combination lock
      currentCombination.push(uuid);
      //This lock only has four positions so remove the first one if there is a longer combination
      if(currentCombination.length > 4){
        currentCombination.shift();
      }
      //Check if the combination is correct!
      if(currentCombination === targetCombination){
        //Correct combination so box is no longer locked!
        this.boxLocked.set(false);
      }else{
        //Do nothing, combination is not ok
      }
    }
  }

  if(Meteor.isCordova){
    /**
    ** Collect beacon updates
    **/
    //Init our beacon regions
    const beaconRegions = beacons.map((beacon) => {
      let region = new ReactiveBeaconRegion({
        identifier: beacon.identifier,
        uuid: beacon.uuid
      });

      let regionByUuid = {
        uuid: beacon.uuid,
        region
      };

      return regionByUuid;
    });

    //This will hold updates from the beacons
    const beaconUpdates = {};
    _.each(beacons,(beacon)=>{
      //Create an empty array in beaconUpdates for every beacon
      beaconUpdates[beacon.uuid]=[];
    });

    //Respond to beacon changes (for every region)
    _.each(beaconRegions,(thisRegion)=>{

      //We need autorun to monitor for the changes in the reactive variable
      this.autorun(() => {
          try{
            //Watch for a beaconResponse
            let beaconResponse = thisRegion.region.getBeaconRegion();
            //If we have a response push it to the beaconUpdates array, we will use this later in an interval
            beaconUpdates[thisRegion.uuid].push(beaconResponse);
            //Only keep the last 5 updates
            if(beaconUpdates[thisRegion.uuid].length > 5){
              beaconUpdates[thisRegion.uuid].shift();
            }

            console.log('beaconUpdates: '+JSON.stringify(beaconUpdates));
          }
          catch(error) {
             console.log('error: '+error);
          }
        });

    });
    /**
    ** Automated UI position calculator
    **/
    //Init our reactivedict (stores values we will show to the UI)
    this.beaconDistance = new ReactiveVar();
    this.beaconInRange = new ReactiveVar();

    //Calculate the position to be reported to the client
    setInterval(()=>{

      //CHANGE THIS SO IT DOES NOT ONLY WORK FOR THE FIRST BEACON

      let updates = beaconUpdates['C3EFA9AF-5CC0-4906-B952-F5B15D428D43'];

      //Get last update from updates array
      let lastUpdate = _.last(updates);
      if (!lastUpdate) lastUpdate = {lastUpdate: {inRegion:false}}
      //Set the reactivevar inrange to the last updated inrange value (happens in client in realtime)
      this.beaconInRange.set(lastUpdate.inRegion);
      //Check if the beacon is currently in range
      if(!lastUpdate.inRegion){
        this.beaconInRange.set(false);
        this.beaconDistance.set(undefined);
      }else{
        var distances = _.map(updates, function(item){return item.beacons[0].accuracy});
        var validList = _.filter(distances, function(item){ if(item>0) return item; });
        var average = _.reduce(validList, function(sum,item){ return sum + item })/validList.length;
        this.beaconDistance.set(average);
      }
    }, 2000);
  }
});
