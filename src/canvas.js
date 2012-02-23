/* Maracuja.Gfx.Canvas */
var Canvas = function(MC) {
	var Gfx = MC.Gfx;
	
	/**@
	* #Maracuja.Gfx.Canvas.init
	* @category Gfx, Canvas
	* @sign public bool Maracuja.Gfx.Canvas.init()
	* @param canvas Canvas element to use. (optional)
	* @return Success
	* Initializes canvas. Needs to be done between Maracuja.Gfx.init and any drawing involving the canvas.
	* If canvas parameter is omitted, a new canvas will be created as a child for the intialized scene.
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
		return true;
	};
	/**@
	* #Maracuja.Gfx.Canvas.background
	* @category Gfx, Canvas
	* @sign public String Maracuja.Gfx.Canvas.background(String value)
	* @param value Background color or image. (optional)
	* @return Canvas background color
	* Shorthand for setting canvas background
	**/	
	var background = function(value) {
		if(value !== undefined) {
			this.canvas.style.background = value;
		}
		return this.canvas.style.backgroundColor;
	}
	/* PUBLIC */
	return MC.Gfx.Canvas = {
		context: undefined,
		canvas: undefined,
		
		init: init,
		background: background
	};
}(Maracuja);
