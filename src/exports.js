(function(MC) {
	//Expose to the global window
	window.MC = MC;
	//Allow AMD loading for those who support it.
	if(typeof define === 'function' && define.amd) {
		define([], function() {return MC; } );
	}
})(Maracuja);