//dirty code to get a second splash screen
Session.set('found', {ice:false,dog:false,fridge:false,bed:false});

Template.beacon.helpers({
   'iceFound': function() {
      return Session.get('found').ice;
   },
   'dogFound': function() {
      return Session.get('found').dog;
   },
   'fridgeFound': function() {
      return Session.get('found').fridge;
   },
   'bedFound': function() {
      return Session.get('found').bed;
   }
});