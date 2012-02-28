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
			var viewport = MC.Gfx.viewport;
			var side = Math.max(this.width, this.height); //To make sure we always stay inside even at rotation
			return this.x + side >= viewport.x && this.x < viewport.x + viewport.width &&
				this.y + side >= viewport.y && this.y < viewport.y + viewport.height;
		}
	}, null, 'x y width height');

	MC.c('Canvas', {
		onInit: function(self) {
		}
	}, 'Sprite');

	MC.c('DOM', {
		onInit: function(self) {
			console.log('DOM init');
			var element = document.createElement('div')
			element.style.position = 'absolute';
			element.style.width = self.width + 'px';
			element.style.height = self.height + 'px';
			element.style.backgroundImage = "url('"+self.tileMap.image+"')";
			element.style.backgroundRepeat = 'no-repeat';
			element.style.backgroundPosition = (self.tileIndex.x*self.tileMap.tileWidth)+'px ' + (self.tileIndex.y*self.tileMap.tileHeight)+'px';
			MC.Gfx.getLayer(self.layer).appendChild(element);
			self.element = element;
			self.updatePosition();
			self.redraw = true;
		},
		updatePosition: function() {
			var viewport = MC.Gfx.viewport;
			if(this.visible()) {
				this.element.style.display = 'block';
				this.element.style.left = (this.x - viewport.x) + 'px'; 
				this.element.style.top = (this.y - viewport.y) + 'px'; 
			} else {
				this.element.style.display = 'none';
			}
		},
		onUpdate: function(self, sender, eventArgs) {},
		onDraw: function(self, sender, eventArgs) {
			console.log('draw!');
			self.updatePosition();
		}
	}, 'Sprite');


	MC.c('Sprite', {
		layer: 0,
		onInit: function(self) {
			console.log('Sprite init');
		}, 
		move: function(x, y) {
			this.x = x;
			this.y = y;
			this.redraw = true;
		}
	}, '2D', 'tileMap tileIndex');

	} catch(e) { console.log(e);};

}(Maracuja);
