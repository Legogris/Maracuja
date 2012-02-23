define(['doh', 'maracuja'], function(doh, MC) {
	doh.register('maracuja.tests.core', [
		{
			name: 'MC.init()',
			timeout: 500,
			runTest: function() {
				var result = MC.init();
				doh.t(result);
			}
	
		}]);
});