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
			} else {
				addComponent(this, com);
			}
			handlers['init'].reverse(); //Usually event callbacks will be called in order of attachement - with onInit, the base ones get called first
			this.trigger('init');
			this.unbind('init');
			return this;
		};
		
		var addComponent = function(e, c) {
			if(c && !e.has(c.getID())) {
				components[c.getID()] = c;
				_attach(e, c.attrs, false);
				for(var i = 0, l = c.ancestors.length; i < l; i++) {
					var com = MC.getComponent(c.ancestors[i]);
					addComponent(e, com);
				}
				var req = c.requires;
				for(var i = 0, l = req.length; i < l; i++) {
					if(typeof e[req[i]] === 'undefined') {
						throw new MC.RequirementFailedError('Component requirement ' + req[i] + ' not satisfied.');
					}
				}
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
			_attach(this, attrs, true);
		};

		var _attach = function(e, attrs, override) {
			if(attrs !== undefined) {
				for(var key in attrs) {
					if(key.substring(0, 2) === 'on') { //Startswith 'on', eg is an event handler.
						e.bind(key.substring(2, key.length), attrs[key]);
					}
					else {
						if(override || typeof e[key] === 'undefined') {
							e[key] = attrs[key];
						}
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
			this.trigger('eventBound', {eventID: eventID, callback: handler});
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
						Maracuja.unbind(eventID, h[0]);						
					} else {
						for(var i = 0, l = h.length; i < l; i++) {
							Maracuja.unbind(eventID, h[i]);
						}
					}
					handlers[eventID] = [];
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

		var destroy = function() {
			this.trigger('destroy');
			for(var eventID in handlers) {
				this.unbind(eventID);
			}
		};

		this.has = has;
		this.implement = implement;
		this.bind = bind;
		this.unbind = unbind;
		this.trigger = trigger;
		this.attach = attach;
		this.destroy = destroy;
		this._handlers = handlers;

		//ACTUAL CONSTRUCTOR
		this.attach(attrs);
		this.implement(c);
		return this;
	};
}(Maracuja);