var Components = function(MC) {
	try {
		/**@
		* #2D
		* @category Components, Graphics
		* Base component needed for 2D graphics. Inherited from both DOM and Canvas components.
		* Visible entities implementing this component are added to Maracuja's redraw handler.
		**/
		MC.c('2D', {
			redraw: false,
			_visible: true,
			z: 0,
			onInit: function() {
				//console.log('2D init', this);
			},
			onUpdated: function(sender, eventArgs) {
				if(this.redraw && this.visible()) {
					MC.Gfx.redrawEntity(this);
					this.redraw = false;
				}
			},

			/**@
			@comp 2D
			@sign public this .show()
			* Returns the entity to a visibel state. Triggers redraw.
			*/
			show: function() {
				this._visible = true;
				this.redraw = true;
				return this;
			},

			/**@
			@comp 2D
			@sign public this .hide()
			* Hides the entity. Triggers redraw.
			*/
			hide: function() {
				this._visible = false;
				this.redraw = true;
				return this;
			},

			/**@
			@comp 2D
			@sign public this .show(Number x, Number y, Number z)
			@param x X component of coordinates
			@param y Y component of coordinates
			@param z Z component of coordinates
			* Moves the entity to the given coordinates. Triggers redraw.
			*/
			move: function(x, y, z) {
				if(typeof x !== 'undefined')
					this.x = x;
				if(typeof y !== 'undefined')
					this.y = y;
				if(typeof z !== 'undefined')
					this.z = z;
				this.redraw = true;
				return this;
			},

			/**@
			@comp 2D
			@sign public Boolean .visible()
			* Returns true if the entity is visible and within the bounds of the viewport. Else returns false.
			*/
			visible: function() {
				if(this._visible === false) {
					return false;
				}
				var side = Math.max(this.width, this.height); //To make sure we always stay inside even at rotation
				return this.x + side >= this.layer.x && this.x < this.layer.x + this.layer.width &&
					this.y + side >= this.layer.y && this.y < this.layer.y + this.layer.height;
			}
		}, null, 'x y width height');

		/**@
		* #Canvas
		* @category Components, Graphics
		* Base component needed for 2D Canvas graphics. Not yet implemented.
		**/
		MC.c('Canvas', {
			onInit: function() {
			}
		});

		/**@
		* #DOM
		* @category Components, Graphics
		* @attr layerIndex What layer the entity belongs to. Optional. Defaults to 0.
		* @attr class The DOM class of the entity. Optional. Defaults to nothing.
		* @property element The DOM element representing this entity on the stage.
		* Base component needed for 2D DOM-based graphics. Bound event-handlers that correspond with DOM events (click, mouseover, etc) will get added to the handlers of the DOM element.
		**/
		MC.c('DOM', {
			layerIndex: 0,
			class: '',
			onInit: function() {
				var element = document.createElement('div')
				element.style.position = 'absolute';
				this.layer = MC.Gfx.getLayer(this.layerIndex); 
				this.layer.appendChild(element);
				this.element = element;
				this.setClass(this.class);
				for(var eventID in this._handlers) {
					if(MC.Settings.domEvents.indexOf(eventID) > -1) {
						this.element.addEventListener(eventID, function(e) {
							this.trigger(e.type, e);
						});
					}
				}
			},
			onDestroy: function(sender, eventArgs) {
				this.layer.removeChild(this.element);
			},
			onUpdate: function(sender, eventArgs) {
			},
			onDraw: function(sender, eventArgs) {
				this.updatePosition();
				if(this.element.className !== this.class) {
					this.element.className = this.class;
				}
			},
			onEventBound: function(sender, eventArgs) {
				if(MC.Settings.domEvents.indexOf(eventArgs.eventID) > -1) {
					this.element.addEventListener(eventArgs.eventID, function(e) {
						this.trigger(e.type, e);
					});
				}
			},
			setClass: function(cssClass) {
				this.class = cssClass;
				this.redraw = true;
				return this;
			},
			updatePosition: function() {
				if(this.visible()) {
					this.element.style.display = 'block';
					this.element.style.left = (this.x - this.layer.x) + 'px'; 
					this.element.style.top = (this.y - this.layer.y) + 'px'; 
					this.element.style.zIndex = this.z;
				} else {
					this.element.style.display = 'none';
				}
				return this;
			},
		}, '2D');

		MC.c('Sprite', {
			tileIndex: {x: 0, y: 0},
			onInit: function() {
				this.spriteLoaded = false;
				if(typeof this.loadSprite === 'undefined') {
					throw new MC.RequirementFailedError('Component requirement loadSprite not satisfied.');
				}
			}, 
		}, '2D');

		MC.c('Text', {
			onInit: function() {
				this.redraw = true;
			},
			setText: function(text) {
				this.text = text;
				this.redraw = true;
				return this;
			}
		}, '2D', 'text');

		MC.c('DOMText', {
			onDraw: function(sender, eventArgs) {
				this.element.innerHTML = this.text;
			}
		}, 'DOM Text');

		MC.c('DOMSprite', {
			onInit: function() {
				this.element.style.backgroundRepeat = 'no-repeat';
				if(typeof this.tileMap !== 'undefined') {
					this.loadSprite(this.tileMap);
				}
				this.redraw = true;
			},
			loadSprite: function(tileMap) {
				this.tileMap = tileMap;
				this.element.style.width = this.width + 'px';
				this.element.style.height = this.height + 'px';
				this.element.style.backgroundImage = "url('"+this.tileMap.image+"')";
				this.element.style.backgroundSize = this.width*this.tileMap.size.x+'px ' + this.height*this.tileMap.size.y+'px';
				if(typeof this.tileIndex !== 'undefined') {
					this.element.style.backgroundPosition = -(this.tileIndex.x*this.width)+'px ' + (this.tileIndex.y*this.height)+'px';
				}
				this.updatePosition();
				this.redraw = true;
				this.spriteLoaded = true;
				return this;
			},
			reloadSprite: function() {
				this.loadSprite(this.tileMap);
			}
		}, 'DOM Sprite');
	} catch(e) { console.log(e);};
}(Maracuja);
