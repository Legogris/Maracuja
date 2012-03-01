var Components = function(MC) {
	try {
	MC.c('2D', {
		redraw: false,
		onInit: function(self) {
			console.log('2D init', self);
		},
		onUpdated: function(self, sender, eventArgs) {
			if(self.redraw && self.visible()) {
				MC.Gfx.redrawEntity(self);
			}
		},
		visible: function() {
			var side = Math.max(this.width, this.height); //To make sure we always stay inside even at rotation
			return this.x + side >= this.layer.x && this.x < this.layer.x + this.layer.width &&
				this.y + side >= this.layer.y && this.y < this.layer.y + this.layer.height;
		}
	}, null, 'x y width height');

	MC.c('Canvas', {
		onInit: function(self) {
		}
	}, 'Sprite');

	MC.c('DOM', {
		onInit: function(self) {
			var element = document.createElement('div')
			element.style.position = 'absolute';
			element.style.backgroundRepeat = 'no-repeat';
			self.layer = MC.Gfx.getLayer(self.layerIndex); 
			self.layer.appendChild(element);
			self.element = element;
			if(typeof self.tileMap !== 'undefined') {
				self.loadSprite(self.tileMap);
			}
		},
		updatePosition: function() {
			if(this.visible()) {
				this.element.style.display = 'block';
				this.element.style.left = (this.x - this.layer.x) + 'px'; 
				this.element.style.top = (this.y - this.layer.y) + 'px'; 
			} else {
				this.element.style.display = 'none';
			}
		},
		loadSprite: function(tileMap) {
			this.tileMap = tileMap;
			this.element.style.width = this.width + 'px';
			this.element.style.height = this.height + 'px';
			this.element.style.backgroundImage = "url('"+this.tileMap.image+"')";
			if(typeof this.tileIndex !== 'undefined') {
				this.element.style.backgroundPosition = (this.tileIndex.x*this.tileMap.tileWidth)+'px ' + (this.tileIndex.y*this.tileMap.tileHeight)+'px';
			}
			this.updatePosition();
			this.redraw = true;
		},
		onUpdate: function(self, sender, eventArgs) {},
		onDraw: function(self, sender, eventArgs) {
			self.updatePosition();
		}
	}, 'Sprite');


	MC.c('Sprite', {
		layerIndex: 0,
		tileIndex: {x: 0, y: 0},
		onInit: function(self) {
			console.log('Sprite init');
			self.spriteLoaded = false;
		}, 
		move: function(x, y) {
			this.x = x;
			this.y = y;
			this.redraw = true;
		}
	}, '2D', 'loadSprite');

	} catch(e) { console.log(e);};

}(Maracuja);
