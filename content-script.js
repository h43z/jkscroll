addEventListener('keydown', event => {
  if(event.target !== document.body) return

  switch(event.key){
    case 'j': scrollBy(0, 50); break;
    case 'k': scrollBy(0, -50); break;
    case 'h': history.back(); break;
    case 'l': history.forward(); break;
  }
})
