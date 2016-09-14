Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'pages#bio', as: 'bio'

  get '/blog', to: 'pages#blog', as: 'blog'

  get '/dev_projects', to: 'pages#dev_projects', as: 'dev_projects'

  get 'civic_projects', to: 'pages#civic_projects', as: 'civic_projects'

  get '/stories', to: 'pages#stories', as: 'stories'

end
