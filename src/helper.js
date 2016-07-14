var EventRegistry = require('./helper/EventRegistry');
var PubSub = require('./helper/PubSub');

export default () => ({
    EventRegistry: EventRegistry,
    PubSub: PubSub
})
