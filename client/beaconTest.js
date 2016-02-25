$(function() {

    var $rad = $('#rad'),
        d = 0;

    (function rotate() {
        $rad.css({ transform: 'rotate('+ d +'deg)'}); // apply CSS3
        setTimeout(function() {
            ++d;         // next degree
            rotate();    // recall function
        }, 25);          // every 25ms
    })();                // 1st start

});

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
},
   'hideClass': function() {
      return (!Template.instance.beaconInRange.get()) ? "hidden" : "";
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
    this.beaconDistance.set(undefined);
    this.beaconInRange.set(false);

    //Calculate the position to be reported to the client
    Meteor.setInterval( () => {
      let updates = this.beaconUpdates;

      //Get last update from updates array
      let lastUpdate = updates[updates.length - 1];
      //Set the reactivevar inrange to the last updated inrange value (happens in client in realtime)
      this.beaconInRange.set(lastUpdate.inRegion);
      //Check if the beacon is currently in range
      if(!lastUpdate.inRegion){
         this.beaconInRange.set(false);
         this.beaconDistance.set(undefined);
      }else{
        let distances = _.map(updates, function(item){return item && item.beacons[0] && item.beacons[0].accuracy});
        let validList = _.filter(distances, function(item){ if(item && item>0) return item; });
        let average = _.reduce(validList, function(sum,item){ return sum + item })/validList.length;
        this.beaconDistance.set(average);
      }
    }, 2000);

}
});
