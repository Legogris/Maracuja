define(['doh', 'maracuja'], function(doh, MC) {
	doh.registerGroup('maracuja.tests.core', 
		[
			{
				name: 'MC.init()',
				timeout: 500,
				runTest: function() {
					var result = .init();
					doh.t(result);
				}
			},
			{
				name: 'MC.c, MC.getComponent, Component.getID',
				timeout: 500,
				runTest: function() {
					var c1 = MC.getComponent('c1');
					var c2 = MC.getComponent('c2');
					doh.is(c1.getID(), 'c1');
				}
			}
		], function() {
			testVar = 0;
			MC.c('c1', {
				init: function() {
					testVar += 10;
				}
			});
			MC.c('c2', {
				init: function() {
					testVar += 40;
				}
			}, 'c1');
			MC.c('c3', {
				init: function() {
					testVar += 2;
				}
			}, 'c1');
		},
		function() {});
});