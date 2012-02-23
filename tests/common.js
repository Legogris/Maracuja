define(['dojo/io/script'], function(ioScript) {
	return {
		init: function() {
			ioScript.get({
				url:'../../../../lego/maracuja/out/maracuja.js'
			});
		}
	};
});