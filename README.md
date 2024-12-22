# jk scroll
vim inspired shortcuts for your [browser](https://addons.mozilla.org/en-US/firefox/addon/jk-scroll/) by [@h43z](https://twitter.com/h43z). 

Many browser extensions have permissions that grant them full access to every 
website you visit abd often they need to. And so does this one BUT

this extension only has 53 lines of understandable code that everyone can
check and verify for themselves.

Extend it if you need more functionality.

Shortcut list
```
// content-script.js
j       => scroll down
k       => scroll up
h       => go back one page in history
l       => go forward one page in history
t       => reopen last closed tab
w       => close tab
Escape  => remove focus from active element
G       => go to bottom of page
gg      => go to top of page
r       => reload tab
Enter   => click on selected text (useful for / and CTRL+f search)
i       => focus next Input element

// background-script.js
// this functionality needs the browser extension API.
// Only so called background scripts have access to it.
w     => close tab
t     => reopen last closed tab
```

To disable jkscroll for a specific website create a localStorage item with the
name of `jkdisable` and some truthy value.

Run `sh create-extension.sh` and install `jk-extension.zip` manually in your
browsers addons/extension section.

So far the commands in  `background-script` won't work in `google-chrome`.
Replace the `browser` keyword with `chrome` and change the code from using
`promises` into callbacks. That should do the trick.
