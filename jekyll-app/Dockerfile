FROM jekyll/jekyll
WORKDIR /jekyll-app
COPY . .
RUN bundle install
RUN npm install
EXPOSE 4000
EXPOSE 35729
CMD ["jekyll", "serve", "--livereload"]