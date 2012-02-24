var Entity = function(MC) {
	return function(c) {
		//Private variables
		var components = {};
		var self = this;

		var implement = function(c) {
			var pieces;
			var com;
			if(Object.prototype.toString.apply(c) === '[object Array]') {
				pieces = c;
			} else {
				pieces = c.split(' ');
			}
			com = MC.getComponent(pieces[0]);

			if(pieces.length > 1) {
				for(var i = 0, len = pieces.length; i < len; i++) {
					com = MC.getComponent(pieces[i]);
					addComponent(com);
				}
				return self;
			}
			return addComponent(com)
		};
		
		var addComponent = function(c) {
			if(c && !has(c.getID())) {
				components[c.getID()] = c;
				if(c.ancestors.length > 0) {
					implement(c.ancestors);
				}
				var attrs = c.attrs;
				if(attrs !== undefined) {
					for(var key in attrs) {
						this[key] = attrs[key];
					}
					if(attrs.init !== undefined) {
						attrs.init();
						this.init = undefined;
					}
				}
			}
			return self;
		};

		var removeComponent = function(c) {
			if(c && has(c.getID())) {
				var com = MC.getComponent(c);

			}
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
}(Maracuja);