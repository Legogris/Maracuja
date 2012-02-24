var Component = function(_id, attrs, ancestors) {
	var id = _id;	
	var ancestors = [];

	var getID = function() {
		return id;
	};

	//CONSTRUCTOR
	this.ancestors = ancestors;
	this.getID = getID;

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
};