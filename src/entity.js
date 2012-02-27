var Entity = function(MC) {
	return function(c) {
		//Private variables
		var components = {};
		var self = this;
		var handlers = {};

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
			return addComponent(this, com);
		};
		
		var addComponent = function(e, c) {
			if(c && !e.has(c.getID())) {
				components[c.getID()] = c;
				if(c.ancestors.length > 0) {
					e.implement(c.ancestors);
				}
				var attrs = c.attrs;
				if(attrs !== undefined) {
					for(var key in attrs) {
						if(key.substring(0, 2) === 'on') { //Startswith 'on', eg is an event handler
							e.bind(key, attrs[key]);
						}
						else {
							e[key] = attrs[key];
						}
					}
					if(e.init !== undefined) {
						e.init();
						e.init = undefined;
					}
				}
			}
			return self;
		};

		var has = function(c) {
			return !!components[c];
			return this;
		};

		var bind = function(eventID, handler) {
			if(typeof handlers[eventID] === 'undefined') {
				handlers[eventID] = [];
			}
			handlers[eventID].push(handler);
			return this;
		};

		var trigger = function(eventID, eventArgs) {
			var h = handlers[eventID];
			if(typeof h !== 'undefined' && h.length > 0) {
				if(h.length === 1) {
					h[0](this, eventArgs);
				} else {
					for(var i in h) {
						h[i](this, eventArgs);
					}
				}
			}
			return this;
		};

		//ACTUAL CONSTRUCTOR
		this.has = has;
		this.implement = implement;
		this.bind = bind;
		this.trigger = trigger;
		this.implement(c);
		return this;
	};
}(Maracuja);