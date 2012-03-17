var Component = function(MC) {
	var constructor = function(my, id, attrs, ancestorIDs, requires) {
		var getID = function() {
			return my.id;
		};
		
		my.id = id;
		my.attrs = attrs;
		my.requires = [];
		my.ancestors = [];

		if(typeof ancestorIDs !== 'undefined' && ancestorIDs) {
			if(Object.prototype.toString.apply(ancestorIDs) !== '[object Array]') {
				ancestorIDs = ancestorIDs.split(' ');
			}
			for(var aID in ancestorIDs) {
				my.ancestors.push(ancestorIDs[aID]);
			}
		}
		if(typeof requires !== 'undefined' && requires) {
			if(Object.prototype.toString.apply(requires) !== '[object Array]') {
				requires = requires.split(' ');
			}
			for(var rID in requires) {
				my.requires.push(requires[rID]);
			}
		}
		this.getID = getID;
	};

	var c = Class(constructor, ['ancestors', 'attrs', 'requires']);
	return c;
}(Maracuja);