Volundir::Engine.routes.draw do
  get "demo", to: "demo#index", as: :demo
  get "/",    to: "demo#index", as: :root
end
