var scrollTarget = window
var lastAction = null

const generatorIterateInputs = iterateInputs()

const actions = {
  'j': _=> scrollTarget.scrollBy(0, 50),
  'k': _=> scrollTarget.scrollBy(0, -50),
  'h': _=> history.back(),
  'l': _=> history.forward(),
  't': _=> chrome.runtime.sendMessage('t'),
  'w': _=> chrome.runtime.sendMessage('w'),
  // setTimeout seems to fix pressing escape in google search
  'Escape': _=> setTimeout(_=>document.activeElement.blur(), 5),
  'G': _=> scrollTarget.scrollTo(0, scrollTarget.scrollHeight),
  'g': _=> lastAction === 'g' && scrollTarget.scrollTo(0, 0),
  'r': _=> location.reload(),
  'Enter': _=> clickOnTextSelection(),
  'i': _=> generatorIterateInputs.next()
}

function* iterateInputs(){
  // iterate through all texinputs on a website with pressing i
  while(true){
    const allInputs = document.querySelectorAll(`
      input[type="text"]:not([disabled]):not([readonly]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"]),
      textarea:not([disabled]):not([readonly]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"]),
      div[contenteditable="true"]:not([disabled]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"])`
    )

    for (let i = 0; i < allInputs.length; i++) {
      // skip if element or any ancestor has the display property set to none
      if(!allInputs[i].offsetParent)
        continue

      yield allInputs[i].focus()
    }

    if(!allInputs.length)
      yield
  }
}

function clickOnTextSelection(){
  // Below code will click the first HTML Element that has a Text selection
  // if Enter was pressed. This is useful after using the default firefox search
  // with ctrl+f or /. This enables better mouseless website navigation.
  elementWithSelection = getSelection().anchorNode?.parentElement

  if(!elementWithSelection)
    return

  elementWithSelection.click()
  getSelection().empty()
}

addEventListener('keydown', event => {
  // disable jkscroll manually for certain websites
  if(localStorage.getItem('jkdisable')) return

  // don't hook into native browser shortcuts
  if(event.ctrlKey || event.altKey || event.metaKey) return

  // only continue if a key from defined actions is pressed
  if(!actions[event.key]) return

  // don't hook if user is typing text into some kind of input field
  // except if Escape key was pressed
  if(
    (
      event.target.nodeName === 'SELECT' ||
      event.target.nodeName === 'INPUT' ||
      event.target.nodeName === 'TEXTAREA' ||
      event.target.getAttribute("contenteditable") === "true"
    )
    && event.key !== 'Escape'
  ) return

  // store key pressed in lastAction and run the according action function
  lastAction = event.key
  actions[event.key]()

  // don't allow websites to do their own shortcut actions for defined jkscroll
  // actions
  event.preventDefault()
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
