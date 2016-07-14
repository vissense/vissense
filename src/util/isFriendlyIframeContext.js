var isIframeContext = require('./isIframeContext');

export default function isFriendlyIframeContext(win) {
  try {
    if (!isIframeContext(win)) {
      return false;
    }
    var selfLocation = win.self.location;
    var topLocation = win.top.location;

    return selfLocation.protocol === topLocation.protocol &&
      selfLocation.host === topLocation.host &&
      selfLocation.port === topLocation.port;
  } catch (e) {
    return false;
  }
}
