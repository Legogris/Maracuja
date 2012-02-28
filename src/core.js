/* Maracuja core */
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
	
	//FUNCTIONS
	/**@
	* #Maracuja.init
	* @category Core
	* @sign public void Maracuja.init()
	* @param sceneID ID of DOM element to use as scene
	* Initializes the Maracuja framework. Needs to be called before anything else.
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

	/**@
	* #Maracuja.bind
	* @category Core
	* @sign public void Maracuja.bind(eventID, handler)
	* @param eventID Event to bind to
	* @param handler Callback to fire when event is triggered.
	* @param owner Entity associated with callback. optional.
	* Binds a new callback to an event.
	* Callback gets called when event is triggered.
	* Callback signature: function(e, sender, eventArgs), where e is this entity, sender is the initiator of triggering and eventArgs is a user-supplied dictionary.
	**/
	var bind = function(eventID, handler, owner) {
		eventID = eventID.toLowerCase();
		if(typeof handlers[eventID] === 'undefined') {
			handlers[eventID] = [];
		}
		handlers[eventID].push({owner: owner, callback: handler});
	};

	/**@
	* #Maracuja.unbind
	* @category Core
	* @sign public void Maracuja.unbind(eventID, handler)
	* @param eventID Event to unbind
	* @param handler Callback to unbind.
	* Unbinds a previously bound callback from a global event.
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

	/**@
	* #Maracuja.trigger
	* @category Core
	* @sign public void Maracuja.trigger(eventID, eventArgs)
	* @param eventID Event to trigger
	* @param eventArgs Object with additional data to send to callback.
	* Triggers an event, firing all bound callbacks.
	**/
	var trigger = function(eventID, eventArgs) {
		eventID = eventID.toLowerCase();
		var h = handlers[eventID];
		if(typeof h !== 'undefined' && h.length > 0) {
			if(h.length === 1) {
				h[0].callback(h[0].owner, MC, eventArgs);
			} else {
				for(var i in h) {
					h[i].callback(h[i].owner, MC, eventArgs);
				}
			}
		}
		return MC;
	};

	/**@ 
	* #Maracuja.update
	* @category Core
	* @sign public void Maracuja.update(int timeStamp)
	* @param timeStamp elapsed milliseconds since epoch. Uses Date.now() if omitted. optional
	* Update method that gets called each frame.
	* Can also be called manually.
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

	/**@
	* #Maracuja.startUpdating
	* @category Core
	* @sign public void Maracuja.startUpdating()
	* Starts automatic engine, basically calling update() each frame.
	**/
	var startUpdating = function() {
		runUpdate = true;
		window.requestAnimationFrame(update, Gfx.scene);
	};

	/**@
	* #Maracuja.stopUpdating
	* @category Core
	* @sign public void Maracuja.stopUpdating()
	* Stops automatic updating.
	**/
	var stopUpdating = function() {
		runUpdate = false;
	};

	/**@
	* #Maracuja.getFPS
	* @category Core, Timing
	* @sign public void Maracuja.getFPS()
	* Gets the current actual framerate
	**/
	var getFPS = function() {
		console.log(gameTime);
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
