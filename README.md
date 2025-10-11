
# Volundir UI Framework

Volundir UI is a lightweight CSS + JS framework designed for clean layouts and modular components. It provides a modern foundation using Flexbox layout and includes prebuilt utilities, forms, buttons, cards, modals, and more.


# Volundir App Framework

**Volundir UI** is a lightweight and agnostic Vanilla JS framework designed to provide a Rails-style JavaScript application development experience.

Volundir uses adapters to provide, connect, and manage interface components, storage systems, hardware devices, and more. You can run Volundir on pure HTML and limited hostings because it is designed to require no dependencies, installations, or permissions. This makes Volundir agnostic to hosting, interface, storage, and everything else.

Volundir is a set of components that can be used together to deliver the best experience for developers. Currently, Volundir is planned to be composed of:

- **Volundir-UI** – A lightweight CSS + JS framework
- **Volundir-App** – A lightweight and agnostic Vanilla JS framework
- **volundir-depot** - The Volundir Depot System, a repository of Volundir components
- **Volundir-Rails** – A dynamic Volundir backend using Rails (requires a Rails hosting)
- **Volundir-Laravel** – A dynamic Volundir backend using Laravel (requires a Laravel hosting)
- **Volundir-Static** – Tools and scripts to improve static usage of Volundir (requires FTP or SSH access)

---

## Another UI Framework?

It depends on how you evaluate or use our tools. As shown above, this is a complete solution covering three entirely different environments, offering a development environment for modern interfaces and SPA/PWA applications, compatible with what developers are already used to on the backend.

I didn't think about how it would be distributed or how others would use it. This is my approach to solving problems—tailored to the needs of my team, partners, and clients.

I found in this model the perfect solution for beginners and developers who are not deeply experienced in interface development. Most people know only a little JavaScript—just enough to use `if` statements, `alert`, and maybe a bit of jQuery. Meanwhile, the market demands Angular, React, Vue.js, and others—each with major version incompatibilities that affect code, design, syntax, parameters, method names, and class names. Updating a frontend becomes a nightmare. In fact, most people avoid it.

But that’s okay! Applications must evolve. Change is normal. However, if the original developer doesn't keep up with these changes, they won’t be able to use the latest version of the tools they once chose. Syntax changes, filenames change, rules change, parameters are renamed or translated—traps everywhere.

Volundir aims to keep everything working—regardless of the version, timing, or method of implementation. Even if Volundir changes drastically in the future and looks nothing like it does today, these projects exist in large part to ensure that an application built on version 1.0 will still work correctly when updated directly to version 30—provided that the update guides available at the time are followed.

And those updates likely won’t involve your actual code. They’ll likely be limited to configuration or the addition of components necessary to maintain compatibility.

Personally, I think it’s a technological bottleneck not being able to simply upgrade. I do this with my operating system—why shouldn't I be able to do the same with my framework?

**Well, I can! Because I use Volundir.**



## ❓ Why "Volundir"?

Volundir is named after **Volundr (or Wayland the Smith)** — a legendary blacksmith in Norse mythology renowned for crafting divine weapons and artifacts of great power. His tale is one of unmatched skill and fierce vengeance against betrayal.

In the manga *Shuumatsu no Valkyrie*, "Volundr" refers to the sacred ritual in which a valkyrie merges her soul with a human, becoming a divine weapon tailored to that soul's strength.

This framework adopts the name **Volundir** to reflect that same spirit of craftsmanship, transformation, and precision — offering developers a powerful foundation to forge their own applications with elegance and control.


## 🌐 Getting Started

Include the styles and scripts in your HTML:

```html
<link rel="stylesheet" href="css/volundir-ui.css">
<script src="js/volundir.js" defer></script>
```

Make sure your HTML follows the basic structure:

```html
<body>
  <div class="layout-container">
    <div class="sidebar-left">
      <!-- Sidebar content -->
    </div>
    <div class="main-content-right">
      <!-- Main content -->
    </div>
  </div>
</body>
```

---

## 📦 Components

### ✅ Layout

```html
<div class="layout-container">
  <div class="sidebar-left">Sidebar</div>
  <div class="main-content-right">Content</div>
</div>
```

Responsive by default. Use media queries if needed.

### 🎛️ Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger">Danger</button>
```

#### Sizes

```html
<button class="btn btn-small">Small</button>
<button class="btn">Default</button>
<button class="btn btn-large">Large</button>
```

### 🧾 Forms

```html
<form>
  <label for="email">Email:</label>
  <input type="email" id="email" class="form-control">

  <label for="password">Password:</label>
  <input type="password" id="password" class="form-control">

  <button class="btn btn-primary">Login</button>
</form>
```

### 🗂 Cards

```html
<div class="card">
  <div class="card-header">Card Header</div>
  <div class="card-body">Card content goes here.</div>
</div>
```

### 📜 Lists

```html
<ul class="list">
  <li class="list-item">Item 1</li>
  <li class="list-item">Item 2</li>
</ul>
```

### 📑 Pagination

```html
<div class="pagination">
  <a class="page-link" href="#">&laquo;</a>
  <a class="page-link active" href="#">1</a>
  <a class="page-link" href="#">2</a>
  <a class="page-link" href="#">&raquo;</a>
</div>
```

### ⚙️ Dropdown

```html
<div class="dropdown">
  <button class="btn dropdown-toggle">Options</button>
  <ul class="dropdown-menu">
    <li><a href="#">Action 1</a></li>
    <li><a href="#">Action 2</a></li>
  </ul>
</div>
```

---

## 🧪 JS Utilities

Basic modal and JSON request support included via `volundir.js`.

### Modal Example

```html
<button data-modal="exampleModal">Open Modal</button>

<div id="exampleModal" class="modal">
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <p>This is a modal!</p>
  </div>
</div>
```

---

## 📁 File Structure

```
layout/
├── css/
│   ├── layout.css
│   ├── button.css
│   ├── card.css
│   ├── forms.css
│   ├── modal.css
│   └── ...others
├── js/
│   ├── volundir.js
│   └── ...helpers
└── application.html
```


## 📘 Log System

Os níveis de mensagem de log (ou severidade) são usados para categorizar a importância e o impacto dos eventos que ocorrem em um sistema ou aplicação. Isso ajuda os desenvolvedores e administradores a filtrar e analisar as informações relevantes. ￼

Abaixo está a descrição de cada tipo solicitado:

INFO (Informação): Utilizado para mensagens que destacam o progresso normal e esperado da aplicação. São eventos rotineiros, como o início ou fim de uma tarefa, o login de um usuário ou uma operação bem-sucedida. Geralmente, são úteis para monitoramento de alto nível.

NOTICE (Aviso/Notificação): Similar ao INFO, mas geralmente indica eventos que são significativos, porém não representam um erro ou problema imediato. Pode ser usado para notificar sobre condições que merecem atenção, mas que o sistema pode lidar sem intervenção.

WARN (Aviso/Warning): Indica a ocorrência de um evento potencialmente prejudicial ou inesperado que não impede a execução correta da aplicação no momento. Exemplos incluem o uso de uma funcionalidade obsoleta, um recurso que está próximo do seu limite ou uma falha de conexão temporária que será automaticamente retentada.

ERROR (Erro): Usado para registrar problemas ou falhas que ocorreram e impediram a conclusão de uma operação ou tarefa específica. A aplicação ou parte dela pode continuar a funcionar, mas a ação em questão falhou. Requer investigação para entender a causa raiz e evitar recorrências.

FATAL (Fatal/Crítico): O nível de severidade mais alto. Indica um erro gravíssimo que causou (ou causará) a interrupção total da
aplicação, do serviço ou do sistema. O sistema não consegue mais operar de forma confiável ou continuar a execução.

DEBUG (Depuração): Contém informações detalhadas, geralmente úteis apenas para desenvolvedores durante a fase de desenvolvimento ou solução de problemas (depuração). Inclui detalhes técnicos granulares, como valores de variáveis, chamadas de função e passos de execução, que seriam excessivos em um ambiente de produção normal.

Sucesso: Confirmam que uma operação foi concluída com sucesso.

Atividade: Descrevem fluxos de mensagens e a interação com recursos externos.


O que os logs registram

Quem acessou o sistema e quando: Registra quem fez login e em que momento.
Ações realizadas: Documenta quais arquivos foram abertos e quais alterações foram feitas.
Eventos e processos: Mantém um registro de todas as operações e eventos que ocorreram.
Dados descritivos: Inclui informações contextuais como carimbos de data/hora para ajudar na análise de incidentes. ￼

Finalidades dos logs

Diagnóstico e monitoramento: Ajudam a identificar problemas e a acompanhar o desempenho de um sistema.
Segurança: Permitem monitorar atividades suspeitas e proteger a rede contra ameaças.
Conformidade: São essenciais para atender a requisitos regulamentares em diversas indústrias.
Análise de incidentes: Fornecem um registro detalhado de ações antes de um incidente para ajudar a investigar a causa.
Otimização de performance: Auxiliam na identificação de gargalos e na melhoria da eficiência do sistema.

---

## 📘 License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this framework for personal or commercial purposes, with proper attribution.

