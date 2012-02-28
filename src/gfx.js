/* Maracuja.Gfx */
var Gfx = function(MC) {
	var layers = [];
	var redrawEntities = [];	//DOM Entities that were modified during this frame and need to be redrawn
	var gameTime = undefined;
	var viewport = {
		x: undefined,
		y: undefined,
		width: undefined,
		height: undefined
	};

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
		this.sceneWidth = viewport.width = width;
		this.sceneHeight = viewport.height = height;

		viewport.x = 0;
		viewport.y = 0;

		layers = [];
		this.addLayer();
		return true;
	};
	
	var addLayer = function() {
		var element = document.createElement('div');
		layers.push(element);
		var layerID = layers.length;
		element.setAttribute('id', 'layer' + layerID);
		element.style.position = 'relative';
		element.style.overflow = 'hidden';
		element.style.width = this.sceneWidth+'px';
		element.style.height = this.sceneHeight+'px';
		scene.appendChild(element);
		return layerID;
	}; 

	var getLayer = function(id) {
		return layers[id];
	}; 

	/**@
	* #Maracuja.Gfx.update
	* @category Gfx
	* @sign public void Maracuja.Gfx.update(float gameTime)
	* @param gameTime Dictionary holding time values
	* Method that gets called each frame to update all entities and draw those that should be
	**/
	var update = function(_gameTime) {
		gameTime = _gameTime;
		MC.trigger('update', {gameTime: gameTime});
		MC.trigger('updated', {gameTime: gameTime});
		for(var i in redrawEntities) {
			redrawEntities[i].trigger('draw', {gameTime: gameTime});
		}
		redrawEntities = [];
		if(Canvas.inUse) {
			Canvas.update(gameTime);
		}
	}

	/**@
	* #Maracuja.Gfx.redrawEntity
	* @category Gfx
	* @sign public void Maracuja.Gfx.redrawEntity(Entity e)
	* @param value Entity Entity to redraw
	* Tells the updater to queue this entity for redrawing next update
	**/
	var redrawEntity = function(e) {
		redrawEntities.push(e);
	};

	
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
		viewport: viewport,

		addLayer: addLayer,
		getLayer: getLayer,
		init: init,
		update: update,
		redrawEntity: redrawEntity,
		background: background
	};
}(Maracuja);
