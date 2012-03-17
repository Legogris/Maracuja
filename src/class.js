var Class = function() {
	return function(constructor, getters, setters) {
		var getProperties = function(my) {
			var properties = {};
			var g = function(key) { 
				return function() { return my[key]; };
			};
			var s = function(key) {
				return function(value) { my[key] = value; };
			};
			for(var i in getters) {
				var key = getters[i];
				properties[key] = { get: g(key) };
			}
			for(var i in setters) {
				var key = setters[i];
				if(typeof properties[key] === 'undefined') {
					properties[key] = {};
				}
				properties[key].set = s(key);
			}
			return properties;
		}; 
		

		//Actual constructor
		return function() {
			var privates = {};
			Object.defineProperties(this, getProperties(privates));
			var args = Array.prototype.slice.apply(arguments);
			args.unshift(privates);
			constructor.apply(this, args);
			return this;
		}
	};
}();