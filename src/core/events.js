(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';

	// http://dustindiaz.com/rock-solid-addevent
	var EventCache = (function () {
		var listEvents = [];
		return {
			listEvents: listEvents,
			add: function (/*node, sEventName, fHandler*/) {
				listEvents.push(arguments);
			},
			flush: function () {
				var i, item;
				for (i = listEvents.length - 1; i >= 0; i = i - 1) {
					item = listEvents[i];
					if (item[0].removeEventListener) {
						item[0].removeEventListener(item[1], item[2], item[3]);
					}
					if (item[1].substring(0, 2) !== 'on') {
						item[1] = 'on' + item[1];
					}
					if (item[0].detachEvent) {
						item[0].detachEvent(item[1], item[2]);
					}
					item[0][item[1]] = null;
				}
			}
		};
	})();

	module.addEvent = function(obj, type, fn) {
		var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
			EventCache.add(obj, type, fn);
		} else if (obj.attachEvent) {
			obj['e' + t + fn] = fn;
			obj[t + fn] = function () {
				obj['e' + t + fn](window.event);
			};
			obj.attachEvent('on' + t, obj[t + fn]);
			EventCache.add(obj, t, fn);
		} else {
			obj['on' + t] = obj['e' + t + fn];
		}
	};

	module.addEvent(window, 'unload', EventCache.flush);

	return module;

}));
