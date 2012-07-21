/**
 * Entity class, commonly initiated via Maracuja.e. Actual constructor private.
 * @module maracuja 
 * @namespace
 * @class Entity
 * @constructor
 * @param {Object} my Private variables
 * @param {String|Array} c Component(s) to implement, as array or space-separated list in string
 * @param {Object} attrs Values for attributes
 */
var Entity = function(MC) {
	var constructor = function(my, c, attrs) {
		//Private variables
		my.components = {};
		my.handlers = {};

		/**
		* Implements additional components to already initialized entity.
		* Some components require certain attributes to be attached before implementation.
		* 
		* @method implement
		* @param {String|Array} c Component ID(s) to implement, in space-separated string or array of strings.
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
					addComponent.call(this, com);
				}
			} else {
				addComponent.call(this, com);
			}
			if(typeof my.handlers['init'] !== 'undefined') {
				my.handlers['init'].reverse(); //Usually event callbacks will be called in order of attachement - with onInit, the base ones get called first
				this.trigger('init');
				this.unbind('init');
			}
			return this;
		};
		
		var addComponent = function(c) {
			if(c && !this.has(c.getID())) {
				var cAttrs = c.getAttributes(my);
				my.components[c.getID()] = c;
				_attach.call(this, cAttrs, false);
				for(var i = 0, l = c.ancestors.length; i < l; i++) {
					var aID = c.ancestors[i];
					var com = MC.getComponent(aID);
					if(this.has(aID)) { //rebind oninit to make it happen before this one
						var handlers = my.handlers['init'];
						for(var i in handlers) {
							var h = handlers[i];
							if(h.callback.component === aID) {
								this.unbind('init', h.callback);
								this.bind('init', h.callback);
							}
						}
					} else {
						addComponent.call(this, com);
					}
				}
				var req = c.requires;
				for(var i = 0, l = req.length; i < l; i++) {
					if(typeof this[req[i]] === 'undefined') {
						throw new MC.RequirementFailedError('Component requirement ' + req[i] + ' not satisfied.');
					}
				}
			} 
			return this;
		};

		/**
		* Attaches new properties and their values to the entity.
		* @method attach
		* @param attrs Dictionary with attributes to attach. Values with keys starting with 'on' will be bound as event handlers.
		**/
		var attach = function(attrs) {
			_attach.call(this, attrs, true);
		};

		var _attach = function(attrs, override) {
			if(attrs !== undefined) {
				for(var key in attrs) {
					if(attrs.hasOwnProperty(key)) {
						if(key.substring(0, 2) === 'on') { //Startswith 'on', eg is an event handler.
							this.bind(key.substring(2, key.length), attrs[key]);
						}
						else {
							if(override || typeof this[key] === 'undefined') {
								this[key] = attrs[key];
							}
						}
					}
				}
			}
		};

		/**
		* Checks if this entity is implementing component with supplied ID.
		* 
		* @method has
		* @param {String} c Component ID to check
		* @return {Boolean} True if supplied component is implemented, False otherwise.
		**/
		var has = function(c) {
			return !!my.components[c];
		};

		/**
		* Binds a new callback to an event.
		*
		* @method bind
		* @param {String} eventID Event to bind to
		* @param {function} handler Callback to fire when event is triggered. Callback signature: function(e, sender, eventArgs), where e is this entity, sender is the initiator of triggering and eventArgs is a user-supplied dictionary.
		* @param {Boolean} global If this is true, the event handler is also attached to the same event on the global Maracuja object. Defaults to true.
		**/
		var bind = function(eventID, handler, global) {
			if(global === undefined) { global = true; }
			eventID = eventID.toLowerCase();
			if(typeof my.handlers[eventID] === 'undefined') {
				my.handlers[eventID] = [];
			}
			my.handlers[eventID].push({owner: this, callback: handler});
			if(global && eventID !== 'init') {
				Maracuja.bind(eventID, handler, this);
			}
			this.trigger('eventBound', {eventID: eventID, callback: handler});
			return this;
		};

		/**
		* Unbinds a previously bound callback from an event, both from current entity and globally.
		* If handler parameter is not supplied, all attached callbacks to the given event will be unbound.
		* 
		* @method unbind
		* @param {String} eventID Event to unbind
		* @param {function} handler Callback to unbind. optional
		* @param {Boolean} global If this is true, the event handler is also unbound from the global Maracuja object. Defaults to true.
		**/
		var unbind = function(eventID, handler, global) {
			if(global === undefined) { global = true; }
			eventID = eventID.toLowerCase();
			var h = my.handlers[eventID];
			if(h) {
				if(typeof handler !== 'undefined') {
					for(var i = 0, l = h.length; i < l; i++) {
						if(h[i].callback === handler) {
							h.splice(i, 1);
							i--;
							l--;
						}
					}
					if(global && eventID !== 'init') {
						Maracuja.unbind(eventID, handler);
					}
				} else { //unbind all handlers
					//Optimize for case when there is only one callback
					if(h.length === 1) {
						if(global && eventID !== 'init') {
							Maracuja.unbind(eventID, h[0]);	
						}					
					} else {
						for(var i = 0, l = h.length; i < l; i++) {
							if(global && eventID !== 'init') {
								Maracuja.unbind(eventID, h[i]);
							}
						}
					}
					my.handlers[eventID] = [];
				}
			}
			return this;
		};

		/**
		* Triggers an event, firing all bound callbacks.
		* 
		* @method trigger
		* @param {String} eventID Event to trigger
		* @param eventArgs Object with additional data to send to callback.
		**/
		var trigger = function(eventID, eventArgs) {
			var h = my.handlers[eventID];
			if(typeof h !== 'undefined' && h.length > 0) {
				if(h.length === 1) {
					h[0].callback.call(h[0].owner, this, eventArgs);
				} else {
					for(var i = 0, l = h.length; i < l; i++) {
						try {
							h[i].callback.call(h[i].owner, this, eventArgs);
						} catch(e) {	//On error, logs to console or throws an error in a separate 'thread' to not cancel remaining callbacks
							if(console && console.error) {
								console.error(e)
							} else {
								window.setTimeout(function() {throw e}, 0);
							}
						}
					}
				}
			}
			return this;
		};

		/**
		* Destroys the entity and unbinds all associated events.
		* 
		* @method destroy
		**/
		var destroy = function() {
			this.trigger('destroy');
			for(var eventID in my.handlers) {
				if(my.handlers.hasOwnProperty(eventID)) {
					this.unbind(eventID);
				}
			}
		};

		this.has = has;
		this.implement = implement;
		this.bind = bind;
		this.unbind = unbind;
		this.trigger = trigger;
		this.attach = attach;
		this.destroy = destroy;

		//ACTUAL CONSTRUCTOR
		this.attach(attrs);
		this.implement(c);
		return this;
	};
	var c = Class(constructor, ['handlers']);
	return c;
}(Maracuja);