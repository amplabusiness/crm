(function(){
  const el = document.getElementById('status');
  if(el){
    const span = document.createElement('span');
    span.className = 'status-text';
    span.style.marginLeft = '8px';
    span.textContent = `(loaded at ${new Date().toLocaleTimeString()})`;
    el.appendChild(span);
  }
})();
