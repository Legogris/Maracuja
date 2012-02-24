var Component = function(MC) {
	return function(_id, attrs, ancestorIDs) {
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
				ancestorIDs = ancestorIDs.split(' ');
			}
			for(var aID in ancestorIDs) {
				//var ancestor = MC.getComponent(ancestorIDs[id]);
				//console.log(id, ancestor);
				ancestors.push(ancestorIDs[aID]);
				/*for(var key in ancestor.attrs) {
					this[key] = ancestor.attrs[key];
				}*/
			}

		}
	};
}(Maracuja);