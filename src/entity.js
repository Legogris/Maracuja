var Entity = function(MC) {
	return function(c, attrs) {
		//Private variables
		var components = {};
		var handlers = {};

		/**@
		* #Entity.implement
		* @category Core
		* @sign public void Entity.implement(c)
		* @param c Component ID(s) to implement, in space-separated string or array of strings
		* Implements additional components to already initialized entity.
		* Some components require certain attributes to be attached before implementation.
		**/
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
				return this;
			}
			return addComponent(this, com);
		};
		
		var addComponent = function(e, c) {
			if(c && !e.has(c.getID())) {
				components[c.getID()] = c;
				if(c.ancestors.length > 0) {
					e.implement(c.ancestors);
				}
				e.attach(c.attrs);
				var req = c.requires;
				for(var i = 0, l = req.length; i < l; i++) {
					if(typeof e[req[i]] === 'undefined') {
						throw new MC.RequirementFailedError('Component requirement ' + req[i] + ' not satisfied.');
					}
				}
				e.trigger('init');
				e.unbind('init');
			} 
			return e;
		};

		/**@
		* #Entity.attach
		* @category Core
		* @sign public void Entity.attach(attrs)
		* @param attrs Dictionary with attributes to attach
		* Attaches new properties and their values to the entity.
		* Values with keys starting with 'on' will be bound as event handlers.
		**/
		var attach = function(attrs) {
			if(attrs !== undefined) {
				for(var key in attrs) {
					if(key.substring(0, 2) === 'on') { //Startswith 'on', eg is an event handler
						this.bind(key.substring(2, key.length), attrs[key]);
					}
					else {
						this[key] = attrs[key];
					}
				}
			}
		};

		/**@
		* #Entity.has
		* @category Core
		* @sign public void Entity.has(c)
		* @param c Component ID to check
		* @returns True if supplied component is implemented, False otherwise.
		* Checks if this entity is implementing component with supplied ID.
		**/
		var has = function(c) {
			return !!components[c];
			return this;
		};

		/**@
		* #Entity.bind
		* @category Core
		* @sign public void Entity.bind(eventID, handler)
		* @param eventID Event to bind to
		* @param handler Callback to fire when event is triggered.
		* Binds a new callback to an event.
		* Callback gets called both when event is triggered on this entity, as well as globally on the Maracuja object.
		* Callback signature: function(e, sender, eventArgs), where e is this entity, sender is the initiator of triggering and eventArgs is a user-supplied dictionary.
		**/
		var bind = function(eventID, handler) {
			eventID = eventID.toLowerCase();
			if(typeof handlers[eventID] === 'undefined') {
				handlers[eventID] = [];
			}
			handlers[eventID].push({owner: this, callback: handler});
			Maracuja.bind(eventID, handler, this);
			return this;
		};

		/**@
		* #Entity.unbind
		* @category Core
		* @sign public void Entity.unbind(eventID, handler)
		* @param eventID Event to unbind
		* @param handler Callback to unbind. optional
		* Unbinds a previously bound callback from an event, both from current entity and globally.
		* If handler parameter is not supplied, all attached callbacks to the given event will be unbound.
		**/
		var unbind = function(eventID, handler) {
			eventID = eventID.toLowerCase();
			var h = handlers[eventID];
			if(h) {
				if(typeof handler !== 'undefined') {
					for(var i = 0, l = h.length; i < l; i++) {
						if(h[i].callback == handler) {
							h.splice(i, 1);
							i--;
							l--;
						}
					}
					Maracuja.unbind(eventID, handler);
				} else { //unbind all handlers
					//Optimize for case when there is only one callback
					if(h.length === 1) {
						Maracuja.unbind(eventID, handler);						
					} else {
						for(var i = 0, l = h.length; i < l; i++) {
							Maracuja.unbind(eventID, h[i]);
						}
						handlers[eventID] = [];
					}
				}

			}
			return this;
		};

		/**@
		* #Entity.trigger
		* @category Core
		* @sign public void Entity.trigger(eventID, eventArgs)
		* @param eventID Event to trigger
		* @param eventArgs Object with additional data to send to callback.
		* Triggers an event, firing all bound callbacks.
		**/
		var trigger = function(eventID, eventArgs) {
			eventID = eventID.toLowerCase();
			var h = handlers[eventID];
			if(typeof h !== 'undefined' && h.length > 0) {
				if(h.length === 1) {
					h[0].callback(h[0].owner, this, eventArgs);
				} else {
					for(var i in h) {
						h[i].callback(h[i].owner, this, eventArgs);
					}
				}
			}
			return this;
		};



		this.has = has;
		this.implement = implement;
		this.bind = bind;
		this.unbind = unbind;
		this.trigger = trigger;
		this.attach = attach;
		//ACTUAL CONSTRUCTOR

		this.attach(attrs);
		this.implement(c);
		return this;
	};
}(Maracuja);