/* Maracuja.Gfx */
var Gfx = function(MC) {
	var layers = [];
	var redrawEntities = [];	//DOM Entities that were modified during this frame and need to be redrawn
	var gameTime = undefined;
	
	/**@
	* #Maracuja.Gfx.init
	* @category Gfx
	* @sign public bool Maracuja.Gfx.init(String SceneID)
	* @param sceneID The element of the DOM ID to use as scene
	* @param attrs Additional attributes to apply to scene DOM elements style (optional)
	* @return Success
	* Initializes the scene. Must be run before any other Gfx functions are used.
	* Special attributes: height and width. If these are not supplied, Maracuja will try to use the elements existing offset values.
	**/
	var init = function(sceneID, attrs) {
		if(sceneID === undefined) {
			return false;
		}
		var scene = MC.find('#' + sceneID, document)[0],
			width = scene.offsetWidth,
			height = scene.offsetHeight;
		this.scene = scene;
		//Set supplied attributes
		if(attrs !== undefined) {
			for(var key in attrs) {
				var val = attrs[key];
				switch(key) {
					case width:
						width = parseInt(val);
						scene.style.width = width + 'px';
						break;
					case height:
						height = parseInt(val);
						scene.style.height = height + 'px';
						break;
					case background:
						background(val);
						break;
					default:
						scene.style[key] = val;
						break;
				}
			}
		}
		this.sceneWidth = width;
		this.sceneHeight = height;
		return true;
	};
	
	/**@
	* #Maracuja.Gfx.update
	* @category Gfx
	* @sign public void Maracuja.Gfx.update(float gameTime)
	* @param gameTime Dictionary holding time values
	* Draw method that gets called each frame to update
	**/
	var update = function(_gameTime) {
		gameTime = _gameTime;
		for(var i in redrawEntities) {
			redrawEntities[i].draw();
		}
		if(Canvas.inUse) {
			Canvas.update(gameTime);
		}
	}
	
	/**@
	* #Maracuja.Gfx.background
	* @category Gfx
	* @sign public String Maracuja.Gfx.background(String value)
	* @param value Background color or image. (optional)
	* @return Scene background value
	* Setting or getting scene background
	**/
	var background = function(value) {
		if(value !== undefined) {
			this.scene.style.background = value;
		}
		return this.scene.style.backgroundColor;
	}

	/* PUBLIC */
	return MC.Gfx = {
		Canvas: {},
		
		scene: undefined,
		
		init: init,
		update: update,
		background: background
	};
}(Maracuja);
