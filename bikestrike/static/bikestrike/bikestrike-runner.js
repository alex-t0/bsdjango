requirejs(['bikestrike'],
  function   (bikestrike) {
    if (bikestrike)
      alert('bikestrike seems loaded (from bikestrike)');
    bikestrike.$('body').css("background-color","gray");
});
