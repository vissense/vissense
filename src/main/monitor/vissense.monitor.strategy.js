/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
VisMon.Strategy = function() {};
VisMon.Strategy.prototype.start = function() {
    throw new Error('Strategy#start needs to be overridden.');
};
VisMon.Strategy.prototype.stop = function() {
    throw new Error('Strategy#stop needs to be overridden.');
};

VisMon.Strategy.NoopStrategy = function() {};
VisMon.Strategy.NoopStrategy.prototype = Object.create(VisMon.Strategy.prototype);
VisMon.Strategy.NoopStrategy.prototype.start = function(monitor) {
    monitor.update();
};
VisMon.Strategy.NoopStrategy.prototype.stop = function() {};

VisMon.Strategy.PollingStrategy = function(config) {
    this._config = defaults(config, {
        interval: 1000
    });
    this._started = false;
};
VisMon.Strategy.PollingStrategy.prototype = Object.create(VisMon.Strategy.prototype);
VisMon.Strategy.PollingStrategy.prototype.start = function(monitor) {
    var me = this;

    fireIf(!me._started, function() {
        me.stop();

        me._update = function() {
            monitor.update();
        };

        addEventListener('visibilitychange', me._update);

        (function update() {
            monitor.update();
            me._timer = setTimeout(update, me._config.interval);
        }());

        me._started = true;
    })();

    return me._started;
};
VisMon.Strategy.PollingStrategy.prototype.stop = function() {
    var me = this;
    if(!me._started) {
        return false;
    }
    clearTimeout(me._timer);
    removeEventListener('visibilitychange', me._update);

    me._started = false;

    return true;
};

VisMon.Strategy.EventStrategy = function(config) {
    this._config = defaults(config, {
        debounce: 30
    });
    this._started = false;
};
VisMon.Strategy.EventStrategy.prototype = Object.create(VisMon.Strategy.prototype);
VisMon.Strategy.EventStrategy.prototype.start = function(monitor) {
    var me = this;
    fireIf(!me._started, function() {
        me.stop();

        me._update = debounce(function() {
            monitor.update();
        }, me._config.debounce);

        addEventListener('visibilitychange', me._update);
        addEventListener('scroll', me._update);
        addEventListener('resize', me._update);

        me._update();

        me._started = true;
    })();

    return this._started;
};

VisMon.Strategy.EventStrategy.prototype.stop = function() {
    var me = this;
    if(!me._started) {
        return false;
    }
    removeEventListener('resize', me._update);
    removeEventListener('scroll', me._update);
    removeEventListener('visibilitychange', me._update);

    me._started = false;

    return true;
};