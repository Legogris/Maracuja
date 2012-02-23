/* Maracuja core */
var Maracuja = function() {
	//NS
	var MC = this;
	
	//FIELDS/PROPERTIES
	var entities = [];
	var components = [];
	
	//FUNCTIONS
	var init = function(scene) {
		var result = true;
		result = !!Gfx.init(scene) ? result : false;
		return result;
	};
	
	/* PUBLIC */
	return {
		Gfx: {},
		init: init
	};
}();
