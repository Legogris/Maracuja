define(['doh', 'maracuja'], function(doh, MC) {
	doh.registerUrl('maracuja.tests.gfx.core',
		require.toUrl('maracuja/tests/gfx.html'));
	doh.registerUrl('maracuja.tests.gfx.canvas',
		require.toUrl('maracuja/tests/canvas.html'));
});