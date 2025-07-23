// Volundir.js
// Author; Fernando Kosh <fernando.kosh@gmail.com>

document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => initVolundir())
  observer.observe(document.body, { childList: true, subtree: true })
  initVolundir()
})

function initVolundir() {
  document.querySelectorAll('[data-action="populate"]:not([data-bound])').forEach(el => {
    el.dataset.bound = 'true'
    bindFilters(el)
    fetchAndRender(el)

    const refreshInterval = parseInterval(el.dataset.refresh)
    if (refreshInterval) {
      setInterval(() => fetchAndRender(el), refreshInterval)
    }
  })

  // Botões de atualização manual
  document.querySelectorAll('[data-action="refresh"]:not([data-bound])').forEach(btn => {
    btn.dataset.bound = 'true'
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.target)
      if (target && target.dataset.action === 'populate') fetchAndRender(target)
    })
  })
}

function bindFilters(container) {
  const filters = container.querySelectorAll('[data-filter]')
  filters.forEach(input => {
    input.addEventListener('input', () => fetchAndRender(container))
  })
}

function fetchAndRender(el) {
  const url = new URL(el.dataset.url, window.location.origin)
  const method = (el.dataset.method || 'get').toLowerCase()
  const params = new URLSearchParams()

  if (el.dataset.params) {
    const extra = new URLSearchParams(el.dataset.params)
    extra.forEach((v, k) => params.append(k, v))
  }

  el.querySelectorAll('[data-filter]').forEach(input => {
    const key = input.name || input.dataset.filter
    const value = input.value
    if (key && value !== undefined) params.set(key, value)
  })

  const fetchOptions = { method: method.toUpperCase() }

  if (method === 'post') {
    fetchOptions.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    fetchOptions.body = params.toString()
  } else {
    url.search = params.toString()
  }

  fetch(url, fetchOptions)
    .then(res => res.json())
    .then(data => renderElement(el, data))
    .catch(err => console.error('Erro ao buscar dados:', err))
}

function renderElement(el, data) {
  if (!Array.isArray(data)) return

  const idField = el.dataset.columnId || 'id'
  const labelField = el.dataset.columnLabel || 'name'
  const clear = () => { el.innerHTML = '' }

  if (el.tagName === 'UL' || el.tagName === 'OL') {
    clear()
    data.forEach(item => {
      const li = document.createElement('li')
      li.textContent = `${item[idField]} - ${item[labelField]}`
      el.appendChild(li)
    })
  }

  else if (el.tagName === 'SELECT') {
    clear()
    data.forEach(item => {
      const option = document.createElement('option')
      option.value = item[idField]
      option.textContent = item[labelField]
      el.appendChild(option)
    })
    const changeEvent = new Event('change', { bubbles: true })
    el.dispatchEvent(changeEvent)
  }

  else if (el.tagName === 'TABLE') {
    const thead = el.querySelector('thead') || el.createTHead()
    const tbody = el.querySelector('tbody') || el.createTBody()
    thead.innerHTML = ''
    tbody.innerHTML = ''

    const headerRow = document.createElement('tr')
    Object.keys(data[0] || {}).forEach(key => {
      const th = document.createElement('th')
      th.textContent = key
      headerRow.appendChild(th)
    })
    thead.appendChild(headerRow)

    data.forEach(item => {
      const tr = document.createElement('tr')
      Object.values(item).forEach(value => {
        const td = document.createElement('td')
        td.textContent = value
        tr.appendChild(td)
      })
      tbody.appendChild(tr)
    })
  }

  else if (el.classList.contains('card')) {
    clear()
    data.forEach(item => {
      const div = document.createElement('div')
      div.className = 'card-item'
      div.textContent = `${item[idField]} - ${item[labelField]}`
      el.appendChild(div)
    })
  }

  else if (['DIV', 'SECTION', 'ARTICLE'].includes(el.tagName)) {
    clear()
    data.forEach(item => {
      const block = document.createElement('div')
      block.className = 'data-block'
      block.textContent = `${item[idField]} - ${item[labelField]}`
      el.appendChild(block)
    })
  }

  else if (el.tagName === 'TEMPLATE') {
    clear()
    const templateContent = el.content
    const parent = el.parentNode
    data.forEach(item => {
      const clone = templateContent.cloneNode(true)
      clone.querySelectorAll('[data-bind]').forEach(node => {
        const key = node.dataset.bind
        node.textContent = item[key] ?? ''
      })
      parent.appendChild(clone)
    })
  }
}

function parseInterval(str) {
  if (!str) return null
  const match = str.trim().match(/^(\d+)(s|ms|m)?$/)
  if (!match) return null
  const value = parseInt(match[1])
  const unit = match[2] || 'ms'
  switch (unit) {
    case 's': return value * 1000
    case 'm': return value * 60000
    case 'ms': return value
    default: return null
  }
}

console.log('Volundir Framework loaded.')
