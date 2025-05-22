version = File.read("VERSION").strip

Gem::Specification.new do |spec|
  spec.name          = "volundir"
  spec.version       = "0.0.0"
  spec.summary       = "Pure and clean UI framework."
  # spec.files         =  Dir['README.md', 'VERSION', 'Gemfile', 'Rakefile', '{app,bin,lib,config,vendor}/**/*']
  spec.files         =  Dir['README.md', 'VERSION', '{app,bin,lib,config,vendor,test}/**/*']
  spec.description   = "A pure and clean CSS and Javascript UI framework."
  spec.author        = "Fernando Kosh"
  spec.email         = "fernando.kosh@gmail.com"
  spec.homepage      = "http://github.com/fernandokosh/volundir"
  spec.require_paths = ["lib"]
  spec.add_dependency('rails_fake_api')
end
