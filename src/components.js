var Components = function(MC) {
	try {
	MC.c('2D', {
		init: function() {
			console.log('2D init', this);
		}
	});

	MC.c('Canvas', {
		init: function() {
			console.log('Canvas init', this);
		}

	}, '2D');

	MC.c('DOM', {
		init: function() {
			console.log('DOM init', this);
		}
	}, '2D');
	} catch(e) { console.log(e);}
}(Maracuja);
