document.addEventListener('click', (e) => {
  if (e.target.classList.contains('flash-close')) {
    e.target.closest('.flash').remove();
  }
});
