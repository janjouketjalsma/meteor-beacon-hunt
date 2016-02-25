function _isFound(distance) {
   if (distance < 1) return true;
   else return false;
}

Template.beaconTest.helpers({
  'gameStatus':function(){
    return Template.instance().game.get();
  }
});

Template.beaconTest.onCreated(function(){
  if(Meteor.isCordova){
    //Define the beacons we have
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

    //GAMEPLAY functions
    /*
    1. Generate a beacon order

    2. Activate current beacon region (from the order)

    3. Wait for beacon to be found and report distance while still looking
      DATA STRUCTURE: {challangeCompleted: boolean, beacons: [{distance, isFound},{distance, isFound},{distance, isFound},{distance, isFound}]}

    4. When beacon is found, go to next beacon (step two)
    */

    //STEP 1 Calculate our target order
    let targetOrder = [0,1,2,3];//SCRAMBLING FUNCTION HERE

    //STEP 2 Activate the first beacon
    let currentTargetIndex = -1;

    let currentBeacon;
    let nextBeacon = function(){
      let nextTargetIndex = currentTargetIndex +1;
      let nextBeacon = beacons[targetOrder[nextTargetIndex]];
      return nextBeacon || beacons[0];
    };

    let nextRegion = function(){
      currentBeacon = nextBeacon();
      /*
      let region = new ReactiveBeaconRegion({
        identifier: currentBeacon.identifier,
        uuid: currentBeacon.uuid
     });
     // return region
     */
      return this.region;
    }

    //Set the initial region
    //currentRegion = nextRegion();
    this.region = new ReactiveBeaconRegion({
        identifier: "Big",
        uuid: "C3EFA9AF-5CC0-4906-B952-F5B15D428D43"
      });
    //console.log('currentRegion: '+JSON.stringify(currentRegion));
    console.log('currentRegion: '+JSON.stringify(this.region));

    //Create a var for the updates
    this.beaconUpdates = [];

    let beaconResponse = this.region.getBeaconRegion();
    console.log('first beacon message '+JSON.stringify(beaconResponse));
    this.beaconUpdates.push(beaconResponse);

    //Monitor the next beacon
    this.autorun(() => {

      try {
         //Watch for a beaconResponse
         //let beaconResponse = currentRegion.getBeaconRegion();
         let beaconResponse = this.region.getBeaconRegion();
         console.log('[autorun] new beacon message '+JSON.stringify(beaconResponse));

         //If we have a response push it to the beaconUpdates array, we will use this later in an interval
         this.beaconUpdates.push(beaconResponse);

         //Only keep the last 5 updates
         if(this.beaconUpdates.length > 5){
           this.beaconUpdates.shift();
         }
         console.log('[autorun] beaconUpdates: '+JSON.stringify(this.beaconUpdates));
      }
      catch(e) {
         console.log('[autorun] Error: '+String(e));
      }

    });
    /**
    ** STEP 3: UI position and achievement calculator
    ** returns : {challangeCompleted: boolean, beacons: {uuid:{distance, isFound},anotheruuid: {distance, isFound}}};
    **/
    //Init our reactivedict (stores values we will show to the UI)
    this.game = new ReactiveVar({
      challangeCompleted : false,
      beacons: {}
    });

    this.beaconInRange = new ReactiveVar();

    //Calculate the position to be reported to the client
    Meteor.setInterval(()=>{
      try{
         console.log('[interval]  calculating reactiveVars');
         let updates = this.beaconUpdates;
         //We have currentBeacon here

         //Get last update from updates array
         let lastUpdate = _.last(updates);
         if (!lastUpdate) lastUpdate = {lastUpdate: {inRegion:false}};

         let currentGame = this.game.get();

         //Check if the beacon is currently in range
         if(!lastUpdate.inRegion){
           //Beacon not in range, set the distance to really far
           //currentGame.beacons[currentBeacon.uuid] = {distance: 100};
           currentGame.beacons["C3EFA9AF-5CC0-4906-B952-F5B15D428D43"] = {distance: 100};
           updates = [];//Clear the updates array
         }
         else {
           var distances = _.map(updates, function(item){return item.beacons[0].accuracy});
           var validList = _.filter(distances, function(item){ if(item>0) return item; });
           var average = _.reduce(validList, function(sum,item){ return sum + item })/validList.length;
           //currentGame.beacons[currentBeacon.uuid] = {
           currentGame.beacons["C3EFA9AF-5CC0-4906-B952-F5B15D428D43"] = {
              distance: average,
              isFound: _isFound(average)
           };
         }
         this.game.set(currentGame);
      }
      catch(e) {
         console.log('[interval] Error: '+String(e));
      }

    }, 2000);
  } // end of isCordova

});
