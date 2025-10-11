document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', async () => {
      const url = el.dataset.action
      const method = el.dataset.method || 'get'

      const res = await fetch(url, {
        method: method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: method === 'get' ? null : JSON.stringify({ foo: "bar" })
      })

      const data = await res.json()
      alert(`Resposta: ${data.message || 'OK'}`)
    })
  })
})

console.log('volundir/actions.js loaded.')
