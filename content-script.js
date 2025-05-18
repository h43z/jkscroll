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
  'i': _=> generatorIterateInputs.next(),
  'n': _=> chrome.runtime.sendMessage('n'),
  'p': _=> chrome.runtime.sendMessage('p'),
  // make CTRL-c analog to Escape
  'c': e => e.ctrlKey && setTimeout(_=>document.activeElement.blur(), 5)
}

function* iterateInputs(){
  // Iterate through all textinputs on a website by pressing i
  while(true){
    const allInputs = document.querySelectorAll(`
      input:not([type]):not([disabled]):not([readonly]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"]),
      input[type="text"]:not([disabled]):not([readonly]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"]),
      input[type="password"]:not([disabled]):not([readonly]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"]),
      textarea:not([disabled]):not([readonly]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"]),
      div[contenteditable="true"]:not([disabled]):not([hidden]):not([style="display:none"]):not([style="visibility:hidden"])`
    )

    let foundInput = false
    for (let i = 0; i < allInputs.length; i++) {
      // skip if element or any ancestor has the display property set to none
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
      if(!allInputs[i].offsetParent)
        continue

      foundInput = true
      yield allInputs[i].focus()
    }

    if(!allInputs.length || !foundInput)
      yield
  }
}

function clickOnTextSelection(){
  // Below code will click the first HTML Element that has a Text selection
  // if Enter was pressed. This is useful after using the default firefox search
  // functionality of ctrl+f or / and makes them work like the ' search.
  elementWithSelection = getSelection().anchorNode?.parentElement

  if(!elementWithSelection)
    return

  elementWithSelection.click()
  getSelection().empty()
}

addEventListener('keydown', event => {
  // check if jkscroll was manually disabled
  if(localStorage.getItem('jkdisable')) return

  // don't hook into native browser shortcuts except CTRL-c
  if((event.key !== 'c' && event.ctrlKey) || event.altKey || event.metaKey)
    return

  // only continue if a key from defined actions is pressed
  if(!actions[event.key]) return

  // don't hook if user is typing text into some kind of input field
  // except if Escape key was pressed or CTRL-C
  if(
    (
      event.target.nodeName === 'SELECT' ||
      event.target.nodeName === 'INPUT' ||
      event.target.nodeName === 'TEXTAREA' ||
      event.target.getAttribute("contenteditable") === "true"
    )
    && (event.key !== 'Escape' && !(event.ctrlKey && event.key === 'c'))
  ) return

  // store key pressed in lastAction and run the according action function
  actions[event.key](event)
  lastAction = event.key

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
