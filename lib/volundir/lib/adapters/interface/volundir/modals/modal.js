document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-toggle="modal"]').forEach(el => {
    el.addEventListener('click', () => {
      const modal = document.querySelector(el.dataset.target)
      modal?.classList.add('active')
    })
  })

  document.querySelectorAll('.modal .close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').classList.remove('active')
    })
  })
})
