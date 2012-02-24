var Entity = function(c) {
	//Private variables
	var components = {};

	var implement = function(c) {
		console.log('implement', c);
		var pieces;
		var com;
		if(Object.prototype.toString.apply(c) === '[object Array]') {
			pieces = c;
		} else {
			pieces = c.split(' ');
			com = MC.getComponent(pieces[0]);
		}
		
		if(pieces.length > 1) {
			for(var i = 0, len = pieces.length; i < len; i++) {
				com = MC.getComponent(pieces[i]);
				addComponent(com);
			}
			return this;
		}
		return addComponent(com)
	};
	
	var addComponent = function(c) {
		if(c) {
			console.log('addComponent', c);
			if(!has(c)) {
				components[c.getID()] = c;
				if(c.ancestors.length > 0) {
					implement(c.ancestors);
				}
			}
		}
		return this;
	};
	
	var has = function(c) {
		return !!components[c];
	};

	//ACTUAL CONSTRUCTOR
	this.has = has;
	this.implement = implement;
	this.implement(c);
	return this;
};
