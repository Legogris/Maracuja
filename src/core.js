/** 
* Maracuja module
* @module maracuja
*/
/**
* Maracuja core class.
* @class MC
* @static
* @namespace
*/
var Maracuja = function() {
	//NS
	var MC = this;
	
	//FIELDS/PROPERTIES
	var handlers = [];
	var entities = [];
	var components = {};
	var gameTime = {
			start: undefined,
			elapsedTotal: 0,
			frameCount: 0,
			elapsed: 0
	};
	var runUpdate;
	
	//PRIVATE FUNCTIONS
	var initTimer = function() {
		gameTime = {
			start: window.mozAnimationStartTime || Date.now(),
			elapsedTotal: 0,
			frameCount: 0,
			elapsed: 0
		};
	}
	
	/**
	* Initializes the Maracuja framework. Needs to be called before anything else.
	* @method init
	* @param sceneID ID of DOM element to use as scene
	* @return {Boolean} Success
	**/
	var init = function(sceneID) {
		var result = true;
		if(!Gfx.init(sceneID)) {
			result = false;
		}
		initTimer();
		return result;
	};
	
	var component = function(id, attrs, inherits, requires) {
		if(components[id]) {
			throw new Error('Trying to add component with existing id.');
		}
		components[id] = new Component(id, attrs, inherits, requires);
		return components[id];
	}

	var entity = function(component, attrs) {
		return new Entity(component, attrs);
	};
	
	var getComponent = function(id) {
		return components[id];
	};

	/**
	* Binds a new callback to an event.
	* Callback gets called when event is triggered.
	* Callback signature: function(e, sender, eventArgs), where e is this entity, sender is the initiator of triggering and eventArgs is a user-supplied dictionary.
	* @method bind
	* @param {String} eventID Event to bind to
	* @param {Function} handler Callback to fire when event is triggered.
	* @param {Entity} owner Entity associated with callback. optional.
	**/
	var bind = function(eventID, handler, owner) {
		eventID = eventID.toLowerCase();
		if(typeof handlers[eventID] === 'undefined') {
			handlers[eventID] = [];
		}
		handlers[eventID].push({owner: owner, callback: handler});
	};

	/**
	* Unbinds a previously bound callback from a global event.
	* @method unbind
	* @param {String} eventID Event to unbind
	* @param {Function} handler Callback to unbind.
	**/
	var unbind = function(eventID, handler) {
		eventID = eventID.toLowerCase();
		var h = handlers[eventID];
		if(h) {
			for(var i = 0, l = h.length; i < l; i++) {
				if(h[i].callback == handler) {
					h.splice(i, 1);
					i--;
					l--;
				}
			}
		}
	}

	/**
	* Triggers an event, firing all bound callbacks.
	* @method trigger
	* @param {String} eventID Event to trigger
	* @param {Object} eventArgs Additional data to send to callback.
	**/
	var trigger = function(eventID, eventArgs) {
		eventID = eventID.toLowerCase();
		var h = handlers[eventID];
		if(typeof h !== 'undefined' && h.length > 0) {
			if(h.length === 1) {
				h[0].callback.call(h[0].owner, MC, eventArgs);
			} else {
				for(var i in h) { //See trigger in entity.js for comment
					try {
						h[i].callback.call(h[i].owner, MC, eventArgs);
					} catch(e) {
						if(console && console.error) {
							console.error(e);
						} else {
							window.setTimeout(function() {throw e}, 0);
						}
					}
				}
			}
		}
		return MC;
	};

	/**
	* Update method that gets called each frame.
	* Can also be called manually.
	* @method update
	* @param {Number} timeStamp elapsed milliseconds since epoch. Uses Date.now() if omitted. optional
	**/
	var update = function(timeStamp) {
		if(runUpdate) {
			window.requestAnimationFrame(update, Gfx.scene);
		}
		if(typeof timeStamp === 'undefined') {
			timeStamp = Date.now();
		}
		var delta = timeStamp - gameTime.start - gameTime.elapsedTotal;
		gameTime.elapsedTotal += delta;
		gameTime.elapsed = delta;
		gameTime.frameCount++;
		trigger('update', {gameTime: gameTime});
		trigger('updated', {gameTime: gameTime});
		Gfx.update(gameTime);
	};

	/**
	* Starts automatic engine, basically calling update() each frame.
	* @method startUpdating
	**/
	var startUpdating = function() {
		runUpdate = true;
		window.requestAnimationFrame(update, Gfx.scene);
	};

	/**
	* Stops automatic updating.
	* @method stopUpdating
	**/
	var stopUpdating = function() {
		runUpdate = false;
	};

	/**
	* Gets the current actual framerate
	* @method getFPS
	* @return {Number} Current framerate
	**/
	var getFPS = function() {
		return gameTime.frameCount / gameTime.elapsedTotal * 1000;
	}
	
	/* PUBLIC */
	return {
		Gfx: {},
		
		init: init,
		c: component,
		component: component,
		e: entity,
		entity: entity,
		getComponent: getComponent,
		bind: bind,
		unbind: unbind,
		trigger: trigger,
		update: update,
		startUpdating: startUpdating,
		stopUpdating: stopUpdating,
		getFPS: getFPS,

		//DEBUG
		handlers: handlers
	};
}();
