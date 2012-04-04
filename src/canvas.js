/**
* Canvas side of Gfx
* @namespace MC.Gfx
* @class Canvas
* @static
*/
var Canvas = function(MC) {
	var Gfx = MC.Gfx;
	var gameTime = undefined;
	var entities = [];
	var changed;
	
	/**
	* Initializes canvas. Needs to be done between Maracuja.Gfx.init and any drawing involving the canvas.
	* If canvas parameter is omitted, a new canvas will be created as a child for the intialized scene.
	* @method init
	* @param {DOMElement} canvas Canvas element to use. (optional)
	* @return {Boolean} Success
	**/
	var init = function(canvas) {
		if(!Gfx.scene) {
			console.log("Scene not initialized yet.");
			return false;
		}
		var canvas = document.createElement('canvas');
		canvas.setAttribute('width', Gfx.sceneWidth);
		canvas.setAttribute('height', Gfx.sceneHeight);
		Gfx.scene.appendChild(canvas);
		
		var ctx = canvas.getContext('2d');
		if(!ctx) {
			console.log('Could not get 2D drawing context for canvas.');
			return false;
		}
		this.canvas = canvas;
		this.context = ctx;
		this.inUse = true;
		changed = true;
		return true;
	};
	
	var update = function(_gameTime) {
		console.log("Canvas update not implemented");
	}
	
	/**
	* Shorthand for setting canvas background
	* @method background
	* @param {String} value Background color or image. (optional)
	* @return {String} Canvas background color
	**/	
	var background = function(value) {
		if(value !== undefined) {
			this.canvas.style.background = value;
		}
		return this.canvas.style.backgroundColor;
	};
	
	/* PUBLIC */
	return MC.Gfx.Canvas = {
		context: undefined,
		canvas: undefined,
		inUse: false,
		
		init: init,
		update: update,
		background: background
	};
}(Maracuja);
