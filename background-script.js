chrome.runtime.onMessage.addListener(cmd => {
  switch(cmd){
    case 'u':
      browser.sessions.getRecentlyClosed({maxResults: 1})
        .then(s => browser.sessions.restore(s[0].sessionId))
    break;
  }
})
