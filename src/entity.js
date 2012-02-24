var Entity = function() {
	var constructor = function(c) {
		console.log('constructor', this);
		implement(c);
	};
	
	var implement = function(c) {
		console.log('implement', this);
		var pieces;
		if(Object.prototype.toString.apply(c) === '[object Array]') {
			pieces = c;
		} else {
			pieces = c.split(' ');
			c = pieces[0];
		}
		
		if(pieces.length > 1) {
			for(var i = 0, len = pieces.length; i < len; i++) {
				addComponent(pieces[i]);
			}
			return this;
		}
		return addComponent(c)
	};
	
	var addComponent = function(c) {
		if(c) {
			console.log('addComponent', this);
			if(!has(c)) {
				this.components.push(c);
				implement(c.requires);
			}
		}
		return this;
	};
	
	var has = function(c) {
		return !!this.components[c];
	};
	
	return new Class({
		constructor: constructor,
		has: has,
		components: [],
	});
}();
