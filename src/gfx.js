/**
* gfx
* @namespace MC
* @class Gfx
* @static
*/
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

	/**
	* Initializes the scene. Must be run before any other Gfx functions are used.
	* Special attributes: height and width. If these are not supplied, Maracuja will try to use the elements existing offset values.
	* #sign public bool Maracuja.Gfx.init(String SceneID)
	* @method init
	* @param sceneID The element of the DOM ID to use as scene
	* @param attrs Additional attributes to apply to scene DOM elements style (optional)
	* @return {Boolean} Success
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
		element.width = this.sceneWidth;
		element.height = this.sceneHeight;
		element.style.width = this.sceneWidth+'px';
		element.style.height = this.sceneHeight+'px';
		element.x = viewport.x;
		element.y = viewport.y;
		this.scene.appendChild(element);
		return layerID;
	}; 

	var getLayer = function(id) {
		return layers[id];
	}; 

	/**
	* Gets called each frame to update all entities and draw those that should be drawn
	* #Maracuja.Gfx.update
	* #category Gfx
	* #sign public void Maracuja.Gfx.update(float gameTime)
	* @method update
	* @param gameTime Dictionary holding time values
	**/
	var update = function(_gameTime) {
		gameTime = _gameTime;
		for(var i = 0, l = redrawEntities.length; i < l; i++) {
			redrawEntities[i].trigger('draw', {gameTime: gameTime});
		}
		redrawEntities = [];
		if(Canvas.inUse) {
			Canvas.update(gameTime);
		}
	}

	/**
	* Tells the updater to queue this entity for redrawing next update
	* # sign public void Maracuja.Gfx.redrawEntity(Entity e)
	* @method redrawEntity
	* @param value Entity Entity to redraw
	**/
	var redrawEntity = function(e) {
		redrawEntities.push(e);
	};

	
	/**
	* Setting or getting scene background
	* #sign public String Maracuja.Gfx.background(String value)
	* @method background
	* @param value Background color or image. (optional)
	* @return {String} Scene background value
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
