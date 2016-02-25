//dirty code to get a second splash screen
Session.set('welcome', false);
Session.set('rules', false);

Template.welcome.rendered = function(){
	$(function() {setTimeout(function(){
	Session.set('welcome', true)}, 15000);
	});
};

Template.welcome.helpers({
   'loaded': function() {
      return (Session.get('welcome')) ? "hidden" : "";
   }
});

Template.rules.events({
   'click button': function() {
	Session.set('rules', true)
   }
});

Template.rules.helpers({
   'loaded': function() {
      return (Session.get('rules')) ? "hidden" : "";
   }
});