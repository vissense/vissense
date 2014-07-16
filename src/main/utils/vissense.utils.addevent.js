/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils) {
    'use strict';
    /*--------------------------------------------------------------------------*/
    // http://dustindiaz.com/rock-solid-addevent
    var EventCache = (function () {
        var listEvents = [];
        var remove = function(i) {
            var item = listEvents[i];
            if(!!item[0] && !!item[1] && !!item[2]) {
                if (item[0].removeEventListener) {
                    item[0].removeEventListener(item[1], item[2], item[3]);
                } else if (item[0].detachEvent) {
                    item[0].detachEvent('on' + item[1], item[2]);
                    item[0][item[1]+item[2]] = null;
                    item[0]['e'+item[1]+item[2]] = null;
                }
            }
            return item;
        };
        return {
            listEvents: listEvents,
            add: function(/*node, sEventName, fHandler*/) {
                listEvents.push(arguments);
                return listEvents.length - 1;
            },
            remove: remove,
            flush: function() {
                var i;
                for (i = listEvents.length - 1; i >= 0; i = i - 1) {
                    remove(i);
                }
            }
        };
    })();

    function addEvent(obj, type, fn) {
        var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
            return EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            obj['e' + t + fn] = fn;
            obj[t + fn] = function () {
                obj['e' + t + fn].call(obj, window.event);
            };
            obj.attachEvent('on' + t, obj[t + fn]);
            return EventCache.add(obj, t, fn);
        }
        return -1;
    }

    // flush all remaining events
    addEvent(window, 'unload', EventCache.flush);

    VisSenseUtils.addEvent = addEvent;

}(window, window.VisSenseUtils));