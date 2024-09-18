var scrollTarget = window
var lastAction = null

const actions = {
  'j': _ => scrollTarget.scrollBy(0, 50),
  'k': _ => scrollTarget.scrollBy(0, -50),
  'h': _ => history.back(),
  'l': _ => history.forward(),
  't': _ => chrome.runtime.sendMessage('t'),
  'w': _ => chrome.runtime.sendMessage('w'),
  // setTimeout seems to fix pressing escape in google search
  'Escape': _=> setTimeout(_=>document.activeElement.blur(), 5),
  'G': _=> scrollTarget.scrollTo(0, scrollTarget.scrollHeight),
  'g': _=> lastAction === 'g' && scrollTarget.scrollTo(0, 0),
  'r': _=> location.reload()
}

addEventListener('keydown', event => {
  // disable jkscroll manually for certain websites
  if(localStorage.getItem('jkdisable')) return

  // don't hook into native browser shortcuts
  // most of them are done with ctrl
  if(event.ctrlKey) return

  // only continue if a key from defined actions is pressed
  if(!actions[event.key]) return

  // don't hook if user is typing text into some kind of input field
  // except if Escape key was pressed
  if(
      (
        event.target.nodeName === 'INPUT' ||
        event.target.nodeName === 'TEXTAREA' ||
        event.target.getAttribute("contenteditable") === "true"
      )
    && event.key !== 'Escape'
  ) return

  // store key pressed in lastAction and run the according action function
  actions[lastAction = event.key]()

  // don't allow any pages to do their own shortcut actions for j and k
  if(event.key === 'j' || event.key === 'k'){
    event.preventDefault()
  }
}, true)

// it's hard to figure out which element exactly should be addressed with
// scrollBy(), window.scrollBy() does often not work, document does never.
// that's why every scroll event will safe whatever was the target of of the
// event into a variable, which will later be used by jkscroll
// if jk scrolling does not work by default on visiting a page it would help to
// either press space or scroll with a mouse for scrollTarget to get populated
addEventListener('scroll', event => {
  scrollTarget = event.target.scrollingElement || event.target
}, true)
