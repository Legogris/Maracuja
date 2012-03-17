/*var Component = function(MC) {
	var constructor = function(my, id, attrs, ancestorIDs, requires) {
		console.log(arguments);
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
	};

	return function(id, attrs, ancestorIDs, requires) {
		var my = {
			id: id,
			attrs: attrs,
			requires: [],
			ancestors: []
		};


		//Properties
		Object.defineProperties(this, {
			ancestors:	{ get: function() { return my.ancestors; }},
			attrs: 		{ get: function() { return my.attrs; }},
			requires: 	{ get: function() { return my.requires; }}
		});
		this.getID = getID;

		//Constructor
		var args = Array.prototype.slice.apply(arguments);
		args.unshift(my);
		constructor.apply(this, args);
		console.log(this);
		return this;
	};
}(Maracuja);*/
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
			console.log(id, 'ancestors', my.ancestors);
		}
		if(typeof requires !== 'undefined' && requires) {
			if(Object.prototype.toString.apply(requires) !== '[object Array]') {
				requires = requires.split(' ');
			}
			for(var rID in requires) {
				my.requires.push(requires[rID]);
			}
			console.log(id, 'requires', my.requires)
		}
		this.getID = getID;
	};

	c = Class(constructor, ['ancestors', 'attrs', 'requires']);
	return c;
}(Maracuja);