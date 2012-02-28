var Errors = function(MC) {
		MC.RequirementFailedError = function RequirementFailedError(message) {
			this.name = 'RequirementFailedError';
			this.message = (message || '');
		};
		MC.RequirementFailedError.prototype = new Error();
}(Maracuja);