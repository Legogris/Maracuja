var Components = function(MC) {
	try {
	MC.c('2D', {
		redraw: false,
		onInit: function(self) {
			console.log('2D init', self);
		},
		onUpdated: function(self, sender, eventArgs) {
			if(redraw && self.visible()) {
				MC.Gfx.redrawEntity(self);
			}
		},
		visible: function() {
			var viewport = MC.Gfx.viewport;
			return this.x + this.width >= viewport.x && this.x < viewport.x + viewport.width &&
				this.y + this.height >= viewport.y && this.y < viewport.y + viewport.height;
		}
	}, null, 'x y width height');

	MC.c('Canvas', {
		onInit: function(self) {
			console.log('Canvas init', self);
		}
	}, '2D');

	MC.c('DOM', {
		onInit: function(self) {
			console.log('DOM init', self);
		}
	}, '2D');
	} catch(e) { console.log(e);}
}(Maracuja);
