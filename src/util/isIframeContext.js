export default function isIframeContext(win) {
  try {
    return win.self !== win.top;
  } catch (e) {
    return true;
  }
}
