var Component = function() {
	var constructor = function(id, attrs, ancestors) {
		if(ancestors !== undefined) {
			for(var id in ancestors) {
				var ancestor = ancestors[id];
				this.ancestors.push(ancestor);
				for(var key in ancestor.attrs) {
					this[key] = ancestor.attrs[key];
				}
			}
		}
		for(var key in attrs) {
			this[key] = attrs[key];
		}
		return this;
	};
	
	return new Class({
		constructor: constructor,
		ancestors: []
	});
}();