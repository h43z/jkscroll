# jk scroll
Shortcuts for your [browser](https://addons.mozilla.org/en-US/firefox/addon/jk-scroll/) by [@h43z](https://twitter.com/h43z). 

Too many browser extensions have permissions that allow them full
access to every website you are visit (often the need to) and so does this one.

But this extension has just 48 lines of understandable code that everyone can
check and verify.

Extend it if you need more functionality.

Shortcut list
```
// content-script.js
j => scroll down
k => scroll up
h => go back one page in history
l => go forward one page in history
<ESC> => remove focus from active element

// background-script.js
// this functionality needs the browser extension API.
// Only so called background scripts have access to it.
w => close tab
t => reopen last closed tab
```

Run `sh create-extension.sh` and install `jk-extension.zip` manually in your
browsers addons/extension section.

So far the commands in  `background-script` won't work in `google-chrome`.
Replace the `browser` keyword with `chrome` and change the code from using
`promises` into callbacks. That should do the trick.
