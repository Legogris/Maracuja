/**
 * Component class, commonly initiated via Maracuja.c. Actual constructor private. 
 * The 'init' event will be triggered on entity-level upon implementation.
 *
 * @class Component
 * @constructor
 * @param {Object} my Private properties, automatically given by Class constructor
 * @param {String} id ID of the component
 * @param {Object} attrs Object holding all component-specific attributes, methods and event-handlers. Names of event-handlers start with 'on' followed by the event in question.
 * @param {String|Array} ancestorIDs Space-separated list string or array of IDs of other components to implement as well. Attributes of ancestors get overridden if supplid by inheriting components.
 * @param {String|Array} requires Space-separated list string or array of attributes that need to be present in order for implementation of this component to occur. 
 */
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
