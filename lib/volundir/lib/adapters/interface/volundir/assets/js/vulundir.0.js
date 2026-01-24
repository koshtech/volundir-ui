document.addEventListener('DOMContentLoaded', () => {
  microBind.init()
})

const microBind = {
  observers: [],
  init() {
    this.process(document.body)
    this.observeDom()
  },

  process(root) {
    root.querySelectorAll('[data-url]').forEach(el => {
      this.loadDataInto(el)
    })
  },

  async loadDataInto(el) {
    const url = el.dataset.url
    if (!url) return

    const params = new URLSearchParams(el.dataset.params || '')
    const columnId = el.dataset.columnId || 'id'
    const columnLabel = el.dataset.columnLabel || 'name'

    try {
      const res = await fetch(`${url}?${params}`)
      const data = await res.json()
      this.renderData(el, data, columnId, columnLabel)
    } catch (err) {
      console.error(`Erro ao carregar dados de ${url}:`, err)
    }
  },

  renderData(el, data, columnId, columnLabel) {
    const tag = el.tagName.toLowerCase()
    el.innerHTML = '' // limpa o conteúdo anterior

    if (tag === 'ul' || tag === 'ol') {
      data.forEach(item => {
        const li = document.createElement('li')
        li.textContent = `${item[columnLabel]}`
        li.dataset.id = item[columnId]
        el.appendChild(li)
      })
    } else if (tag === 'select') {
      data.forEach(item => {
        const opt = document.createElement('option')
        opt.value = item[columnId]
        opt.textContent = item[columnLabel]
        el.appendChild(opt)
      })
    } else {
      console.warn(`Elemento ${tag} não suportado para renderização automática.`)
    }
  },

  refresh(el) {
    this.loadDataInto(el)
  },

  observeDom() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches('[data-url]')) {
              this.process(node)
            } else if (node.querySelectorAll) {
              this.process(node)
            }
          }
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
    this.observers.push(observer)
  }
}
