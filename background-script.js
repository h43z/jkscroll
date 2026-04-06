chrome.runtime.onMessage.addListener(cmd => {
  switch(cmd){
    case 'w':
      // close active tab
      browser.tabs.query({currentWindow: true, active: true})
        .then(tab => browser.tabs.remove(tab[0].id))
    break;
    case 't':
      // restore previous closed tab
      browser.sessions.getRecentlyClosed({maxResults: 1})
        .then(s => browser.sessions.restore(s[0].sessionId))
    break;
    case 'n':
    case 'p':
      // move focus to next (right) or previous tab (left)
      browser.tabs.query({currentWindow: true})
        .then(tabs => {
          const direction = cmd === 'p' ? -1 : +1
          const activeIndex = tabs.find(tab => tab.active).index
          // allow cycling through tabs
          const futureActiveIndex = (activeIndex + direction + tabs.length) % tabs.length
          browser.tabs.update(tabs[futureActiveIndex].id, {active: true})
        })
    break;
    case 'o':
      // focus tab that had been previously focused
      browser.tabs.query({currentWindow: true, active: false})
        .then(tabs => {
          let tab = tabs.reduce((previous, current) => {
            return previous.lastAccessed > current.lastAccessed ? previous : current
          })
          browser.tabs.update(tab.id, {active: true})
        })
    break;
  }
})
