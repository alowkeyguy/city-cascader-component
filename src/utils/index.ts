export const addEvent = (el: any, event: string, handler: () => void): void => {
  if (!el) {
    return
  }
  if (el.addEventListener) {
    el.addEventListener(event, handler, true)
  } else {
    el['on' + event] = handler
  }
}

export const removeEvent = (
  el: any,
  event: string,
  handler: () => void
): void => {
  if (!el) {
    return
  }
  if (el.removeEventListener) {
    el.removeEventListener(event, handler, true)
  } else {
    el['on' + event] = null
  }
}
