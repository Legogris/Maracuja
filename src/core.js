/* Maracuja core */
var Maracuja = function() {
	//NS
	var MC = this;
	
	//FIELDS/PROPERTIES
	var entities = [];
	var components = [];
	var gameTime = {
			start: undefined,
			elapsedTotal: 0,
			frameCount: 0,
			elapsed: 0
	};
	
	//PRIVATE FUNCTIONS
	var initTimer = function() {
		gameTime = {
			start: window.mozAnimationStartTime || Date.now(),
			elapsedTotal: 0,
			frameCount: 0,
			elapsed: 0
		};
		window.requestAnimationFrame(update, Gfx.scene);
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
		if(Gfx.init(sceneID)) {
			initTimer();
		} else {
			result = false;
		}
		return result;
	};
	
	var component = function(id, attrs, inherits) {
		if(components[id]) {
			throw new Error('Trying to add component with existing id.');
		}
		components[id] = new Component(id, attrs, inherits);
		return components[id];
	}

	var entity = function(component) {
		return new Entity(component);
	};
	
	/**@
	* #Maracuja.update
	* @category Core
	* @sign public void Maracuja.update(int timeStamp)
	* @param timeStamp elapsed milliseconds since epoch
	* Update method that gets called each frame by requestAnimationFrame-
	**/
	var update = function(timeStamp) {
		window.requestAnimationFrame(update, Gfx.scene);
		var delta = timeStamp - gameTime.start - gameTime.elapsedTotal;
		gameTime.elapsedTotal += delta;
		gameTime.elapsed = delta;
		gameTime.frameCount++;
		Gfx.update(gameTime);
	}
	
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
		getFPS: getFPS
	};
}();
