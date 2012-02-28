var Component = function(MC) {
	return function(_id, attrs, ancestorIDs, _requires) {
		var id = _id;	
		var ancestors = [];
		var requires = [];

		var getID = function() {
			return id;
		};

		//CONSTRUCTOR
		this.getID = getID;
		this.ancestors = ancestors;
		this.attrs = attrs;
		this.requires = requires;

		if(typeof ancestorIDs !== 'undefined' && ancestorIDs) {
			if(Object.prototype.toString.apply(ancestorIDs) !== '[object Array]') {
				ancestorIDs = ancestorIDs.split(' ');
			}
			for(var aID in ancestorIDs) {
				ancestors.push(ancestorIDs[aID]);
			}
		}
		if(typeof _requires !== 'undefined' && _requires) {
			if(Object.prototype.toString.apply(_requires) !== '[object Array]') {
				_requires = _requires.split(' ');
			}
			for(var rID in _requires) {
				requires.push(_requires[rID]);
			}
		}
	};
}(Maracuja);