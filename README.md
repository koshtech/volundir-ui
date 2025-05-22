# Volundir

Framework de componentes UI simples para Rails ou uso puro com HTML/CSS/JS.


Criar um kit de javascript capaz de manipular HTML e CSS, mas eu nao quero algo como jquery, quero algo mais estilo mvc para integrar com frameworks como ruby on rails e laravel.

Sample data code:

```ruby

users  = User.all #=> [ { id: 1, name: 'Juca Mariano' }, { id: 2, name: 'Caju das Cove' } ]
                  #   id: 2,
tags   = ['test', 'pages', 'ruby']
photos = ['me.png', 'another_me.jpg', 'not_me.png']
status = ['draft', 'in_revisin', 'revised', 'scheduled', 'published']

users.each do |user|
  # consider ids from 1234 to 2345 for understand pourposes
  page = {
    title: "Teste page from #{User.name}",
    body: 'This is a test text.',
    tags: tags.sample,             # Page has many tags via some simple and effective tagging system
    user: user,                    # Page belongs to user
    photos: photos,                # Page hsa many photos from user
    status: 'draft',               # Valid values: draft, in_revisin, revised, scheduled, published
    revisin: 2
  }

  Page.create(page)
end

@pages = page.all

```


Volundir App Structure:


app/controllers/router.rb
  Slug format: http://localhost:4000/{CONTENT_TITLE}-{USER_ID}-{MODULE_ID}-{CONTENT_ID}-{REVISION}
                                      |               |         |           |            |
                                      |               |         |           |            + Revision of index update
                                      |               |         |           |              porpouse
                                      |               |         |           |
                                      |               |         |           + Id of module model content
                                      |               |         |
                                      |               |         |
                                      |               |         + Module id
                                      |               |
                                      |               |
                                      |               + Owner User Id
                                      |
                                      |
                                      + Title parametrized of module model content

  Slug example: http://localhost:4000/teste-page-from-caju-das-cove-2344-2-987-2

  Content finder:

    parts    = str.split('-')
    revision = parts.pop
    mod      = parts.pop
    user     = parts.pop
    id       = parts.pop
    title    = parts.join('-')

    # Find module and call model finding by id, user and revision if applicable


Exemplo com Ruby on Rails:

Module structure:

app/controllers/crud_controller.rb
  methods:
    internals:
      module_finder: Find current module by many ways
      module_load:  Load module info, content or any other applicable data
      module_cache: Uses cached version of content
      build_content: Build and cache an static and optimized version of content,
                     auto updated on revsion changes
    public: index, new, create, edit, update, destroy, search, schedule,
            cancel_schedule, publish, unpublish
    specials: status, restore, move
    customs: from module

app/modules/page.yml
  id: 987:
  title: My Page
  methods: except(:destroy)
  template: template
  buttons: [
    { submit: 'Save',  action: 'update' },
    { link:   'Help',  href:   'some_url', icon: 'help_plus' },
    {
      button: 'Clone', js: 'custom_js_action',
      options: [ var1, { val: 2}, ['x', 'y'] ],                              #=> Accept any value
      icon: 'clone'
    }
  ]

app/modules/page/assets/{js|css|jpg|png|gif|...}
app/modules/page/controllers/{main|others}
app/modules/page/views/template.html.erb                                           # normal HTML ERB
app/modules/page/views/form[-123].html.erb                                         # can use many forms
app/modules/page/i18n/pt-BR.yml
app/modules/page/media/{photos|videos|audios...}



Template variables

```ruby

application         #=> Return application object
  name
  url
  status
model               #=> Current model instance
  all public methods
controler           #=> Current controller instance
  all backend public methods
action              #=> Current controller action
actions
  posts             #=> URLs for post page forms if pages contains more than one form
  post              #=> URL for post current form if page contains form
  gets              #=> URLs for get page forms if pages contains more than one form
  get               #=> URL for get current form if page contains form
  updates           #=> URLs for update page forms if pages contains more than one form
  update            #=> URL for update current form if page contains form
  destroys          #=> URLs for destroy page forms if pages contains more than one form
  destroy           #=> URL for destroy current form if page contains form
current_user        #=> Current loggedin user data
objects             #=> Current model objects collection if present
object              #=> Current model object data if present

```

Full page example

```html
<each objects="pages" object="page" conditions="page.active? && page.published?" options="index next_if=page.user.nil? break_unless=page.user.present?">
  <div class="row"> <!-- -->
    <div class="col-6 ">
      <p id="page.title" class="title margin-left-3 margin-right-3" data-content-from="page.title"></p>
      <p id="page.body" class="body" data-content-from="page.body"></p>
    </div>
    <div class="col-6">
      <p id="page.user.name" class="user.name" data-content-from="page.user.name"></p>
      <each objects="page.photos" object="photo" conditions="" options="">
        <p>
          <img src="page.cover" title="page.user.username">
        </p>
      </each>
      <ul objects="page.tag_list" object="tag" template="path/to/tag_list" options="index">
        <li data-content-from="tag"></li>
      </ul>

      <select name="status" id="status">
        <option value="volvo">Volvo</option>
      </select>
      <!-- Buttons with static labels -->
      <button data-action="create" data-url="page.url" data-method="post">Create</button>
      <button data-action="update" data-url="page.url" data-method="put" data-label="Save"></button>

      <!-- Buttons with dynamic labels -->
      <button data-action="function" data-url="page.url" data-method="put" data-options="" data-label-object="Page.some_value"></button>

      <!-- Buttons with i18n automatic labels -->
      <button data-action="destroy" data-url="page.url" data-method="delete" data-label="i18n"></button>
    </div>
  </div>
</each>
```


Components

```html
<!-- Modal -->
<div class="modal" id="modal-example">
  <div class="modal-title">Modal Title</div>
  <div class="modal-body">
    <button class="close">&times;</button>
    <h2>Exemple</h2>
    <p>This is a modal window example, activated by topbar right button.</p>
    <ul id="ul-json-data" data-url="http://localhost/api/json/users" data-params="active=true&variable=value" data-column-id="id" data-column-label="name"  class="list-numbered">
      <li id="li-json-item"></li>
    </ul>
    <select id="select-json-data" data-url="http://localhost/api/json/users" data-params="active=true&variable=value" data-column-id="id" data-column-label="name"  class="list-numbered">
      <option id="option-json-item"></option>
    </select>
    <button type="button" data-action="submit" data-method="post" class="submit-modal-example btn-success">Submit</button>
    <button type="button" class="btn btn-cancel close">Cancel</button>
  </div>
  <div class="modal-footer">
  </div>
</div>


<ul data-url="/api/users" data-params="active=true" data-column-id="id" data-column-label="name"></ul>

<select data-url="/api/options" data-column-id="id" data-column-label="title"></select>



<section data-action="populate" data-url="/api/items" data-refresh="10s"></section>


<form data-action="populate" data-url="/api/search" data-method="post">
  <input type="text" name="query" data-filter />
  <div class="results card"></div>
</form>

```

```javascript
// Depois de inserir conteúdo dinâmico com innerHTML
microBind.process(novoContainer) // ou microBind.refresh(elemento
```
