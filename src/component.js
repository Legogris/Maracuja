var Component = function(_id, attrs, ancestorIDs) {
	var id = _id;	
	var ancestors = [];

	var getID = function() {
		return id;
	};

	//CONSTRUCTOR
	this.getID = getID;
	this.ancestors = ancestors;
	this.attrs = attrs;

	if(ancestorIDs !== undefined) {
		if(Object.prototype.toString.apply(ancestorIDs) !== '[object Array]') {
			ancestorIDs = c.split(' ');
		}
		for(var id in ancestorIDs) {
			var ancestor = MC.getComponent(ancestors);
			ancestors.push(ancestor);
			/*for(var key in ancestor.attrs) {
				this[key] = ancestor.attrs[key];
			}*/
		}

	}
};