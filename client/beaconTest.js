Template.beaconTest.helpers({
  'beacons': function(){


    if(Meteor.isCordova){
      //Output region data to console
      let beacons = Template.instance().beaconRegion.getBeaconRegion();

      console.log('printing beacons:');
      console.log(beacons);

      //Call getBeaconRegion
      return beacons;
      
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
    this.beaconRegion = new ReactiveBeaconRegion({
      identifier: "Big",
      uuid: "C3EFA9AF-5CC0-4906-B952-F5B15D428D43"
    });
  }
});
