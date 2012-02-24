var Ticker = function(MC){
	var init = function(){
	};
	
	var setInterval = function(interval) {
		_interval = interval;
	}
	
	var setFPS = function(fps) {
		this.setInterval(1000/fps);
	}
	
	return MC.Ticker = {
		init: init
	};
}(Maracuja);