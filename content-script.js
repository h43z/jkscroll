addEventListener('keydown', event => {
  if(event.target !== document.body)
    return

  switch(event.key){
    case 'j':
      window.scrollBy(0, 50)
    break;
    case 'k':
      window.scrollBy(0, -50)
    break;
  }
})
