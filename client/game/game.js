Template.game.helpers({
	hint:function(){
		if(Session.get('found').ice)
			return 'Congratulations, now you can sleep!'
		else
			return 'I am feeling sleepy, maybe we \r\n should take a nap with Rahul'
	}
})

