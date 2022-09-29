# jk scroll
Shortcuts for your browser by [@h43z](https://twitter.com/h43z). 

Too many browser extensions have permissions that allow them full
access to every website you are visiting. 

This extension does 90% of what I want from a shortcut extension in just 22
lines of understandable code.

Extend it if you need more functionality.

Shortcut list
```
// content-script.js
j => scroll down
k => scroll up

// background-script.js 
// this functionality needs the browser extension API.
// Only so called background scripts have access to it.
d => close tab
u => reopen last closed tab
```

Run `sh create-extension.sh` and install `jk-extension.zip` manually in your
browsers addons/extension section.
