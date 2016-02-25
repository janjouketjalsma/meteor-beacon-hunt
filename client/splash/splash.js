//dirty code to get a second splash screen
Session.set('welcome', false)
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