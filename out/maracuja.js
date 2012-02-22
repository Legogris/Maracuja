/*!
* Maracuja v0.0.1
* http://www.studsmedia.se
* 
* Copyright 2012, Robert "Legogris" Edstrom
* Licensed under MIT license
* Date: 2012-02-22 13:59:35 +0100
*/
(function(window, undefined) {

//Sandboxing but with correct window object
var document = window.document;
var navigator = window.navigator;
var location = window.location;
/* Maracuja core */
var Maracuja = function() {
	var init = function() {
		console.log('init');
	};
	/* PUBLIC */
	return {
		Gfx: {},
		init: init
	};
}();
})(window);

