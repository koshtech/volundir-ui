document.addEventListener('DOMContentLoaded', () => {
  const populateElement = async (el) => {
    const url = el.dataset.url
    const params = el.dataset.params || ''
    const columnId = el.dataset.columnId
    const columnLabel = el.dataset.columnLabel

    if (!url || !columnId || !columnLabel) return

    try {
      const res = await fetch(`${url}?${params}`)
      const data = await res.json()

      // Limpa o conteúdo antigo
      el.innerHTML = ''

      data.forEach(item => {
        const id = item[columnId]
        const label = item[columnLabel]

        switch (el.tagName) {
          case 'UL':
          case 'OL':
            const li = document.createElement('li')
            li.textContent = label
            li.dataset.id = id
            el.appendChild(li)
            break

          case 'SELECT':
            const option = document.createElement('option')
            option.value = id
            option.textContent = label
            el.appendChild(option)
            break

          case 'TABLE':
            const tr = document.createElement('tr')
            const tdId = document.createElement('td')
            const tdLabel = document.createElement('td')
            tdId.textContent = id
            tdLabel.textContent = label
            tr.appendChild(tdId)
            tr.appendChild(tdLabel)
            el.appendChild(tr)
            break

          case 'DIV':
            const p = document.createElement('p')
            p.textContent = label
            p.dataset.id = id
            el.appendChild(p)
            break

          default:
            console.warn(`Elemento <${el.tagName.toLowerCase()}> não é suportado diretamente.`)
        }
      })
    } catch (err) {
      console.error(`Erro ao carregar dados para <${el.tagName.toLowerCase()}> com data-url "${url}":`, err)
    }
  }

  // Aplica em todos os elementos com os atributos obrigatórios
  document.querySelectorAll('[data-url][data-column-id][data-column-label]').forEach(el => {
    populateElement(el)
  })
})
