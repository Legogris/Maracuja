var Components = function(MC) {
	try {
		MC.c('2D', {
			redraw: false,
			_visible: true,
			z: 0,
			onInit: function(self) {
				//console.log('2D init', self);
			},
			onUpdated: function(self, sender, eventArgs) {
				if(self.redraw && self.visible()) {
					MC.Gfx.redrawEntity(self);
					self.redraw = false;
				}
			},
			show: function() {
				this._visible = true;
				return this;
			},
			hide: function() {
				this._visible = false;
				return this;
			},
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
			visible: function() {
				if(this._visible === false) {
					return false;
				}
				var side = Math.max(this.width, this.height); //To make sure we always stay inside even at rotation
				return this.x + side >= this.layer.x && this.x < this.layer.x + this.layer.width &&
					this.y + side >= this.layer.y && this.y < this.layer.y + this.layer.height;
			}
		}, null, 'x y width height');

		MC.c('Canvas', {
			onInit: function(self) {
			}
		});

		MC.c('DOM', {
			layerIndex: 0,
			class: '',
			onInit: function(self) {
				var element = document.createElement('div')
				element.style.position = 'absolute';
				self.layer = MC.Gfx.getLayer(self.layerIndex); 
				self.layer.appendChild(element);
				self.element = element;
				self.setClass(self.class);
				for(var eventID in self._handlers) {
					if(MC.Settings.domEvents.indexOf(eventID) > -1) {
						self.element.addEventListener(eventID, function(e) {
							self.trigger(e.type, e);
						});
					}
				}
			},
			onDestroy: function(self, sender, eventArgs) {
				self.layer.removeChild(self.element);
			},
			onUpdate: function(self, sender, eventArgs) {
			},
			onDraw: function(self, sender, eventArgs) {
				self.updatePosition();
				if(self.element.className !== self.class) {
					self.element.className = self.class;
				}
			},
			onEventBound: function(self, sender, eventArgs) {
				if(MC.Settings.domEvents.indexOf(eventArgs.eventID) > -1) {
					self.element.addEventListener(eventArgs.eventID, function(e) {
						self.trigger(e.type, e);
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
			onInit: function(self) {
				self.spriteLoaded = false;
				if(typeof self.loadSprite === 'undefined') {
					throw new MC.RequirementFailedError('Component requirement loadSprite not satisfied.');
				}
			}, 
		}, '2D');

		MC.c('Text', {
			onInit: function(self) {
				self.redraw = true;
			},
			setText: function(text) {
				self.text = text;
				self.redraw = true;
				return this;
			}
		}, '2D', 'text');

		MC.c('DOMText', {
			onDraw: function(self, sender, eventArgs) {
				self.element.innerHTML = self.text;
			}
		}, 'DOM Text');

		MC.c('DOMSprite', {
			onInit: function(self) {
				self.element.style.backgroundRepeat = 'no-repeat';
				if(typeof self.tileMap !== 'undefined') {
					self.loadSprite(self.tileMap);
				}
				self.redraw = true;
			},
			loadSprite: function(tileMap) {
				this.tileMap = tileMap;
				this.element.style.width = this.width + 'px';
				this.element.style.height = this.height + 'px';
				this.element.style.backgroundImage = "url('"+this.tileMap.image+"')";
				this.element.style.backgroundSize = this.width+'px ' + this.height+'px';
				if(typeof this.tileIndex !== 'undefined') {
					this.element.style.backgroundPosition = (this.tileIndex.x*this.tileMap.tileWidth)+'px ' + (this.tileIndex.y*this.tileMap.tileHeight)+'px';
				}
				this.updatePosition();
				this.redraw = true;
				this.spriteLoaded = true;
				return this;
			},
		}, 'DOM Sprite');
	} catch(e) { console.log(e);};
}(Maracuja);
