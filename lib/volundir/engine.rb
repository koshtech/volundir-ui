module Volundir
  class Engine < ::Rails::Engine
    isolate_namespace Volundir
    engine_name 'volundir'

    initializer "volundir.assets.precompile" do |app|
      app.config.assets.precompile += %w[
        volundir/layout.css
        volundir/modal.css
        volundir/volundir.js
      ]
    end

    initializer "volundir.add_controllers" do |app|
      app.config.autoload_paths += %W(#{config.root}/app/controllers)
    end
  end
end
