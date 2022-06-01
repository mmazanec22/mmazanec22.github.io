FROM jekyll/jekyll
WORKDIR /code
COPY . .
RUN bundle install
RUN npm install
RUN jekyll build --config _config.yml,_config_tailwind.yml
EXPOSE 4000
EXPOSE 35729
CMD ["jekyll", "serve", "--livereload", "--watch"]