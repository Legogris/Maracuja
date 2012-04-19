/**
* Built-in components
* @module maracuja
* @submodule components
*/
var Components = function(MC) {
	try {
		/**
		* Bases component needed for 2D graphics. Inherited from both DOM and Canvas components.
		* Visible entities implementing this component are added to Maracuja's redraw handler.
		* Requires attributes: width, height, x, y
		* @class 2D
		* @namespace MC.Components
		**/
		MC.c('2D', function(my) {
			return {
				/**
				* The ID of the layer that the entity belongs to. Layers are used for scrolling etc. 
				* Only set on init.
				* @type {Integer}
				* @property layerIndex
				* @default 0
				*/
				z: 0,
				onInit: function() {
					console.log('2D init');
					my.visible = true;
					my.redraw = false;
					my.layerIndex = this.layerIndex || 0;
				},
				onUpdated: function(sender, eventArgs) {
					if(my.redraw && this.visible()) {
						MC.Gfx.redrawEntity(this);
						my.redraw = false;
					}
				},

				/**
				* Returns the entity to a visible state. Triggers redraw.
				* @method show
				*/
				show: function() {
					my.visible = true;
					my.redraw = true;
					return this;
				},

				/**
				* Hides the entity. Triggers redraw.
				* @method hide
				*/
				hide: function() {
					my.visible = false;
					my.redraw = true;
					return this;
				},

				/**
				* Moves the entity to the given coordinates. Triggers redraw.
				*
				* @method move
				* @param {Number} x X component of coordinates
				* @param {Number} y Y component of coordinates
				* @param {Number} z Z component of coordinates
				*/
				move: function(x, y, z) {
					if(typeof x !== 'undefined')
						this.x = x;
					if(typeof y !== 'undefined')
						this.y = y;
					if(typeof z !== 'undefined')
						this.z = z;
					my.redraw = true;
					return this;
				},

				/**
				* Returns true if the entity is visible and within the bounds of the viewport. Else returns false.
				* @method visible
				* @return {Boolean} True if the entity is visible and within the bounds of the viewport. Else returns false.
				*/
				visible: function() {
					if(my.visible === false) {
						return false;
					}
					var side = Math.max(this.width, this.height); //To make sure we always stay inside even at rotation
					return this.x + side >= this.layer.x && this.x < this.layer.x + this.layer.width &&
						this.y + side >= this.layer.y && this.y < this.layer.y + this.layer.height;
				}
			};
		}, null, 'x y width height');

		/**
		* Base component needed for 2D Canvas graphics. Not yet implemented.
		*
		* @class Canvas
		* @namespace MC.Components
		**/
		MC.c('Canvas', function(my) {
			return {
				onInit: function() {
				}
			};
		});

		/**
		* Base component needed for 2D DOM-based graphics. Bound event-handlers that correspond with DOM events (click, mouseover, etc) will get added to the handlers of the DOM element.
		*
		* @class DOM
		* @namespace MC.Components
		* @uses MC.Components.2D
		**/
		MC.c('DOM', function(my) {
			return {
				/**
				* The associated DOM element
				* @type {Object}
				* @property element
				* @protected 
				*/
				/**
				* The DOM class of the associated DOM element.
				* Only set on init.
				* @type {String}
				* @property class
				* @default ''
				*/
				class: '',
				onInit: function() {
					console.log('DOM init');
					my.element = document.createElement('div')
					my.element.style.position = 'absolute';
					this.layer = MC.Gfx.getLayer(my.layerIndex); 
					this.layer.appendChild(my.element);
					this.setClass(this.class);
					for(var eventID in this._handlers) {
						if(MC.Settings.domEvents.indexOf(eventID) > -1) {
							my.element.addEventListener(eventID, function(e) {
								this.trigger(e.type, e);
							});
						}
					}
				},			
				onDestroy: function(sender, eventArgs) {
					this.layer.removeChild(my.element);
				},
				onUpdate: function(sender, eventArgs) {
				},
				onDraw: function(sender, eventArgs) {
					this.updatePosition();
					if(my.element.className !== this.class) {
						my.element.className = this.class;
					}
				},
				onEventBound: function(sender, eventArgs) {
					if(MC.Settings.domEvents.indexOf(eventArgs.eventID) > -1) {
						my.element.addEventListener(eventArgs.eventID, function(e) {
							this.trigger(e.type, e);
						});
					}
				},
				/**
				* Sets the DOM class of the entity's DOM object.
				* @method setClass
				* @param {String} cssClass Class to set
				* @return {Entity}
				*/
				setClass: function(cssClass) {
					var redraw = this.class === cssClass;
					this.class = cssClass;
					if(redraw) {
						my.redraw = true;
					}
					return this;
				},
				/**
				* Updates the position of the DOM element
				* @method updatePosition
				* @private
				* @return {Entity}
				*/
				updatePosition: function() {
					if(this.visible()) {
						my.element.style.display = 'block';
						my.element.style.left = (this.x - this.layer.x) + 'px'; 
						my.element.style.top = (this.y - this.layer.y) + 'px'; 
						my.element.style.zIndex = this.z;
					} else {
						my.element.style.display = 'none';
					}
					return this;
				},
			};
		}, '2D');
		
		/**
		* 
		* Sprite component. Requires function loadSprite.
		* Requires: function loadSprite
		* 
		* @class Sprite
		* @namespace MC.Components
		* @uses MC.Components.2D
		*/
		MC.c('Sprite', function(my) {
			return {
				/**
				* Position of current tile in map to display
				* {x: Integer, y: Integer}
				* @type {Object}
				* @property tileIndex 
				*/
				tileIndex: {x: 0, y: 0},
				onInit: function() {
					console.log('Sprite init');
					this.spriteLoaded = false;
					if(typeof this.loadSprite === 'undefined') {
						throw new MC.RequirementFailedError('Component requirement loadSprite not satisfied.');
					}
					if(typeof this.tileMap !== 'undefined') {
						this.loadSprite(this.tileMap);
					}
				},
				/**
				* Loads the associated tilemap.
				* tilemap: {
				*  image: {String}, (URL of tilemap image),
				*  tileWidth: {Integer},
				*  tileHeight: {Integer},
				*  size: {
				* 		x: {Integer},
				* 		y: {Integer}
				*  }
				* }
				* @method loadSprite
				*/

				/**
				* Reloads the current tilemap.
				* @method reloadSprite
				*/
				reloadSprite: function() {
					this.loadSprite(this.tileMap);
				}
			};
		}, '2D', 'loadSprite');

		/**
		* 
		* Text component
		* Requires: String text
		* 
		* @class Text
		* @namespace MC.Components
		* @uses MC.Components.2D
		*/
		MC.c('Text', function(my) {
			return {
				onInit: function() {
					my.redraw = true;
				},
				/**
				* Sets the text to display
				* @method setText
				*/ 
				setText: function(text) {
					var redraw = this.text === text;
					this.text = text;
					if(redraw) {
						my.redraw = true;
					}
					return this;
				}
			};
		}, '2D', 'text');

		/**
		* 
		* DOM-based text component
		* 
		* @class DOMText
		* @namespace MC.Components
		* @uses MC.Components.DOM
		* @uses MC.Components.Text
		*/
		MC.c('DOMText', function(my) {
			return {
				onDraw: function(sender, eventArgs) {
					my.element.innerHTML = this.text;
				}
			};
		}, 'Text DOM');

		/**
		* 
		* DOM-based sprite component
		* 
		* @class DOMSprite
		* @namespace MC.Components
		* @uses MC.Components.DOM
		* @uses MC.Components.Sprite
		*/
		MC.c('DOMSprite', function(my) {
			return {
				onInit: function() {
					console.log('DOMSprite init');
					my.element.style.backgroundRepeat = 'no-repeat';
					my.redraw = true;
				},
				loadSprite: function(tileMap) {
					this.tileMap = tileMap;
					my.element.style.width = this.width + 'px';
					my.element.style.height = this.height + 'px';
					my.element.style.backgroundImage = "url('"+this.tileMap.image+"')";
					my.element.style.backgroundSize = this.width*this.tileMap.size.x+'px ' + this.height*this.tileMap.size.y+'px';
					if(typeof this.tileIndex !== 'undefined') {
						my.element.style.backgroundPosition = -(this.tileIndex.x*this.width)+'px ' + (this.tileIndex.y*this.height)+'px';
					}
					this.updatePosition();
					my.redraw = true;
					this.spriteLoaded = true;
					return this;
				}
			};
		}, 'Sprite DOM');
//frequency: {Integer}, How many milliseconds between animation frames
		/**
		*
		* Animation component
		* 
		* Requires animations
		* animations: [
		*  [
		*   start: {
		*    x: {Integer},
		*    y: {Integer}
		*   },
		*   end: {
		*    x: {Integer},
		*    y: {Integer}
		*   },
		*   name: {String}
		*  ]
		* ]
		* 
		* @class Animation
		* @namespace MC.Components
		* @uses MC.Component.Sprite
		*/
		MC.c('Animation', function(my) {
			return {
				onInit: function() {},
				onUpdate: function(sender, eventArgs) {
				},
				startAnimation: function(name) {},
				stopAnimation: function(name) {}
			};
		}, 'Sprite', 'animations');

	} catch(e) { console.log(e);};
}(Maracuja);
