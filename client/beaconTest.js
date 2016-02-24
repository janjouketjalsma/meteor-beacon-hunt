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
        'beaconInRange': Template.instance().beaconInRange,
        'beaconDistance': Template.instance().beaconDistance
      }
    }else{
      return {
        identifier: "Not on cordova!"
      }
    }
  }
});

Template.beaconTest.onCreated(function(){

  if(Meteor.isCordova){
    /**
    ** Collect beacon updates
    **/
    //Init our beacon group
    this.beaconRegion = new ReactiveBeaconRegion({
      identifier: "Big",
      uuid: "C3EFA9AF-5CC0-4906-B952-F5B15D428D43"
    });

    //This will hold updates from the beacons
    this.beaconUpdates = [];

    //Autorun our update code
    let self=this
    this.autorun(function () {

      //Watch for a beaconResponse;
      let beaconResponse = self.beaconRegion.getBeaconRegion();
      //If we have a response push it to the beaconUpdates array, we will use this later in an interval
      self.beaconUpdates.push(beaconResponse);
      //Only keep the last 5 updates
      if(self.beaconUpdates.length > 5){
        self.beaconUpdates.shift();
      }
    });

    /**
    ** Automated UI position calculator
    **/
    //Init our reactivedict (stores values we will show to the UI)
    this.beaconDistance = new ReactiveVar('beaconDistance');
    this.beaconInRange = new ReactiveVar('beaconInRange');

    //Calculate the position to be reported to the client
    setInterval(function(){
      let updates = this.beaconUpdates;

      //Get last update from updates array
      let lastUpdate = updates[updates.length - 1];
      //Set the reactivevar inrange to the last updated inrange value (happens in client in realtime)
      this.beaconInRange.set(lastUpdate.inRegion);
      //Check if the beacon is currently in range
      if(!lastUpdate.inRegion){
        this.beaconInRange.set(undefined);
      }else{
        var distances = _.map(updates, function(item){return item.beacons[0].accuracy});
        var validList = _.filter(distances, function(item){ if(item>0) return item; });
        var average = _.reduce(validList, function(sum,item){ return sum + item })/validList.length;
        this.beaconDistance.set(average);
      }
    }, 2000);
  }
});
