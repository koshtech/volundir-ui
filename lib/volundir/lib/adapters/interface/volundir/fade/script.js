function fade(element) {
  console.log(' [Component][fade] start...');

  const fadeElement = document.getElementById(element);

  fadeElement.classList.toggle('fade-out');

  console.log(' [Component][fade] ...end');
}
