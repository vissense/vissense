export default () => {
  var removeListenerFunctions = [];

  return {
    addEvent: (element, eventName, handler) => {
      element.addEventListener(eventName, handler, false);
      var removeFunction = () => element.removeEventListener(eventName, handler, false);
      removeListenerFunctions.push(removeFunction);
      return removeFunction;
    },
    removeAll: () => {
      removeListenerFunctions.forEach(listener => listener());
      removeListenerFunctions = [];
    }
  };
}
