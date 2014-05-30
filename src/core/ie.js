(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';
	
	module.IE_VERSION = (function() {
		var v = 3, div = document.createElement('div');

		while (
			div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		){}

		return v > 4 ? v : undefined;
	})();

	return module;

}));
