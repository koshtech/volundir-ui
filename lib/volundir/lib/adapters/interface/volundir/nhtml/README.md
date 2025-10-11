# nHTML

next HTML is a realistic proposal to make hypertext more dynamic.





<!-- ```html -->

<load type="style|css" src="css/custom.css">
<load type="script" src="js/custom.js">

<var name="showSidebar" value="true">

<array name="sidebarItems" value="[{ title: 'Some Place', url: 'https://some_place.com' }, { title: 'Another Place', url: 'https://another_place.com' }]">

<hash name="user_data" value="{ name: 'John Doe', email: 'john@doe.foo' }">


<if var="showSidebar" value="true">

<elseif  var="showSidebar" value="maybe">

<else>

</if>




<unless var="showSidebar" value="false">

<else>

</if>


<ul>
  <for item="sidebarItem" items="sidebarItems" index="true|false">
    <li id="li-{{sidebarItem.id}}"><a href="{{sidebarItem.url}}">{{sidebarItem.title}}</li>
  </for>
</ul>



<!-- Grid -->
<!-- Automatic width cols -->
<row>
  <col>
    <div ...></div>
  </col>
  <col>
    <div ...></div>
  </col>
</row>

<!-- Defined width cols -->
<row>
  <col width="3">
    <div ...></div>
  </col>
  <col width="9">
    <div ...></div>
  </col>
</row>



<form
  object="user_data"
  action="update_users_path"
  id="user_data.id"
  class="form-horizontal"
  layout="default|duo|triple"
  method="post|get"
  enctype="multipart/form-data">

  <hidden name="_method" value="post">

  <field name="name" type="text" class="form-control" placeholder="Your name">

  <checkbox name="terms" class="form-check-input">

  <field "birthdate" type="date" label="Data de Nascimento" class="form-control">
  <field "email" type="email" class="form-control" placeholder="Email">
  <field "documents" type="file" label="Documentos" class="form-control" multiple=true>
  <field "age" type="number" class="form-control" placeholder="Senha">
  <field "password" type="password" class="form-control" placeholder="Senha">
  <field "profile" type="select" class="form-check-input" options="profile_option>
    data-on-change="populate"
    data-model="country"
    data-model-id="value"
    data-model-params="active=1"
    data-target="country"
    data-target-value="id"
    data-target-text="name"
    data-helper="my_helper_func"
    data-helper-param="my_var=my_value"
  <field "country" type="select" class="form-control">
  <field "bio" type="text_area" class="form-control">
  <button type="submit" value="Cadastrar" class="btn btn-success">
  <link_to href="/" value="Cancelar" class="btn btn-link">
<end_form>



```



```html




Full page example

```html

<div class="page">
  <div class="page-container">
    <div class="page-header">
      <div class="page-title"></div>
    </div>

    <!-- if showSidebar == true -->
    <if var="showSidebar" value="true">
      <div class="page-sidebar" position="left">
        <div class=""></div>
      </div>
    </if>

    <!-- unless hideBody == true -->
    <unless var="hideBody" value="true">
      <div class="page-body">

        <var name="showTable" value="true">

        <!-- if value of showFooter is not defined, true is assumed -->
        <if var="showTable">
          <table>
            <!-- for user in users -->
            <tr >

            </tr>
          </table>
        </if>

      </div>
    </unless>

    <!-- if value of showFooter is not defined, true is assumed -->
    <if var="showFooter">
      <div class="page-footer"></div>
    </if>
  </div>
</div>


```


```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title></title>
    <render meta="all|page|og|twitter">
    <render assets="volundir-ui">
    <render asset="css/custom.css">
    <render asset="js/custom.js">
  </head>

  <body class="app-body">
    <div id="splash-screen" class="splash-screen"></div>
    <div id="full-screen" class="full-screen"></div>
    <div class="layout">
      <div class="layout-container">
        <aside class="sidebar-left">
          <p>Volundir</p>
          <h2>Menu</h2>
          <nav>
            <ul>
              <li class="nav-item"><a href="/">Home</a></li>
              <!-- <li class="nav-item"><a href="/dashboard">Dashboard</a></li> -->
              <!-- <li class="nav-item"><a href="/store">Repository</a></li> -->
              <li class="nav-item"><a href="/users">Users</a></li>
              <li class="nav-item"><a href="/register">Register</a></li>
              <li class="nav-item"><a href="/forgot">Forgot</a></li>
              <li class="nav-item"><a href="/login">Login</a></li>
              <li class="nav-item"><a href="/logout">Logout</a></li>
            </ul>
          </nav>
        </aside>

        <div class="main-content-right">
          <div class="navbar">
            <span>Admin Panel</span>
            <div>
              <!-- {{if user_loggedin == 'true'}} -->
                <div class="notification dropdown">
                  <button class="notification-icon dropdown-toggle btn-mini">
                    &#128276; <span class="notification-count">3</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="dropdown-header">Recent Notifications</li>
                    <li><a href="#">New message from João</a></li>
                    <li><a href="#">Your order #123 was delivered</a></li>
                    <li><a href="#">Reminder: Meet at 14h</a></li>
                    <li><a href="#" class="text-center">All</a></li>
                  </ul>
                </div>

                <div class="dropdown">
                  <button class="dropdown-toggle btn-mini">
                    <!-- <img src="https://via.placeholder.com/30" alt="User Avatar" class="user-profile-img" /> -->
                    <span class="icon user"></span>
                    John Doe
                  </button>
                  <ul class="dropdown-menu">
                    <li class="dropdown-header">Hi, John!</li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/settings">Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a href="/logout">Logout</a></li>
                  </ul>
                </div>
              <!-- {{endif}} -->
              <button class="btn-success btn-mini ml-2" onclick="document.getElementById('modal-example').classList.add('show')">Modal index </button>
              <button
                class="btn-success btn-mini ml-2"
                data-modal="static"
                modal-id="test-modal-static"
                modal-title="My Test Modal"
                modal-body="This is a text content."
                modal-button-confirm-label="Confirm!"
                modal-button-confirm-action="/my_action"
                modal-button-cancel-label="Cancel">Modal Loaded
              </button>
            </div>
          </div>

          <div class="content">
            <div id="flash-messages"></div>
            <div class="container mt-4" id="app">


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


            </div>
          </div>

          <footer class="footer">&copy; 2025 Volundir Kit Repository</footer>
        </div>
      </div>
    </div>
  </body>
</html>
```


Rendered page example:


```html



<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title></title>
    <render meta="all|page|og|twitter">

    <meta name="description" content="Volundir Kit Repository Manager provides tools to manage your kit repository efficiently.">
    <meta name="keywords" content="Volundir, Kit, Repository, Manager, Admin, Dashboard">
    <meta name="author" content="Your Name or Company">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:url" content="YOUR_WEBSITE_URL">
    <meta property="og:title" content="Volundir Kit Repository Manager">
    <meta property="og:description" content="Volundir Kit Repository Manager provides tools to manage your kit repository efficiently.">
    <meta property="og:image" content="YOUR_IMAGE_URL">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="YOUR_WEBSITE_URL">
    <meta property="twitter:title" content="Volundir Kit Repository Manager">
    <meta property="twitter:description" content="Volundir Kit Repository Manager provides tools to manage your kit repository efficiently.">
    <meta property="twitter:image" content="YOUR_IMAGE_URL">

    <!-- <link href="http://localhost:3020/lib/volundir/adapters/interface/volundir/assets/css/volundir-ui.css" rel="stylesheet" media="all"> -->
    <link href="{{load_asset css/volundir-ui.css}}" rel="stylesheet" media="all">
    <!-- <script src="{{load_asset js/flash.js}}"></script> -->
  <!--   <script src="//load_asset js/actions.js//"></script>
    <script src="//load_asset js/modal.js//"></script>
    <script src="//load_asset js/volundir.js//"></script>
    <script src="//load_asset js/json-requests.js//"></script>
    <script src="//load_asset js/volundir-ui.js//"></script> -->
  </head>

  <body class="layout">
    <div class="layout-container">
      <aside class="sidebar-left">
        <p>Volundir</p>
        <h2>Menu</h2>
        <nav>
          <ul>
            <li class="nav-item"><a href="/">Home</a></li>
            <!-- <li class="nav-item"><a href="/dashboard">Dashboard</a></li> -->
            <!-- <li class="nav-item"><a href="/store">Repository</a></li> -->
            <li class="nav-item"><a href="/users">Users</a></li>
            <li class="nav-item"><a href="/register">Register</a></li>
            <li class="nav-item"><a href="/forgot">Forgot</a></li>
            <li class="nav-item"><a href="/login">Login</a></li>
            <li class="nav-item"><a href="/logout">Logout</a></li>
          </ul>
        </nav>
      </aside>

      <div class="main-content-right">
        <div class="navbar">
          <span>Admin Panel</span>
          <div>
            <!-- {{if user_loggedin == 'true'}} -->
              <div class="notification dropdown">
                <button class="notification-icon dropdown-toggle btn-mini">
                  &#128276; <span class="notification-count">3</span>
                </button>
                <ul class="dropdown-menu">
                  <li class="dropdown-header">Recent Notifications</li>
                  <li><a href="#">New message from João</a></li>
                  <li><a href="#">Your order #123 was delivered</a></li>
                  <li><a href="#">Reminder: Meet at 14h</a></li>
                  <li><a href="#" class="text-center">All</a></li>
                </ul>
              </div>

              <div class="dropdown">
                <button class="dropdown-toggle btn-mini">
                  <!-- <img src="https://via.placeholder.com/30" alt="User Avatar" class="user-profile-img" /> -->
                  <span class="icon user"></span>
                  John Doe
                </button>
                <ul class="dropdown-menu">
                  <li class="dropdown-header">Hi, John!</li>
                  <li><a href="/profile">Profile</a></li>
                  <li><a href="/settings">Settings</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a href="/logout">Logout</a></li>
                </ul>
              </div>
            <!-- {{endif}} -->
            <button class="btn-success btn-mini ml-2" onclick="document.getElementById('modal-example').classList.add('show')">Modal index </button>
            <button
              class="btn-success btn-mini ml-2"
              data-modal="static"
              modal-id="test-modal-static"
              modal-title="My Test Modal"
              modal-body="This is a text content."
              modal-button-confirm-label="Confirm!"
              modal-button-confirm-action="/my_action"
              modal-button-cancel-label="Cancel">Modal Loaded
            </button>
          </div>
        </div>

        <div class="content">
          <div id="flash-messages"></div>
          <div class="container mt-4" id="app">


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


          </div>
        </div>

        <footer class="footer">&copy; 2025 Volundir Kit Repository</footer>
      </div>
    </div>

    <div class="modal" id="modal-example">
      <div class="modal-content">
        <div class="modal-title">
          <button class="close">&times;</button>
          Modal Title
        </div>
        <div class="modal-body">
          <h2>Modal Example Subtitle</h2>
          <p>This is an example modal window, activated by the top right button.</p>
        </div>
        <div class="modal-footer">
          <button type="button" data-action="submit" data-method="post" class="submit-modal-example btn btn-success">Submit</button>
          <button type="button" class="btn btn-cancel close">Cancel</button>
        </div>
      </div>
    </div>

  </body>
</html>
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
