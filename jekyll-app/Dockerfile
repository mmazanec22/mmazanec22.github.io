FROM jekyll/jekyll
WORKDIR /jekyll-app
COPY . .
RUN bundle install
RUN npm install
EXPOSE 4000
EXPOSE 8124
CMD ["jekyll", "serve", "--incremental", "--livereload", "--drafts", "--trace"]