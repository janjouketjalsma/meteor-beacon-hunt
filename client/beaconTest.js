Template.beaconTest.helpers({
  'beacons': function(){
    if(Meteor.isCordova){
      //Output region data to console
      console.log(beaconRegion.getBeaconRegion());

      //Call getBeaconRegion
      return this.beaconRegion.getBeaconRegion();
    }else{
      return {
        identifier: "Not on cordova!"
      }
    }

  }
});

Template.beaconTest.onCreated(function(){
  //Init our beacon group
  if(Meteor.isCordova){
    const beaconRegion = new ReactiveBeaconRegion({
      identifier: "Big",
      uuid: "C3EFA9AF-5CC0-4906-B952-F5B15D428D43D"
    });
  }
});
