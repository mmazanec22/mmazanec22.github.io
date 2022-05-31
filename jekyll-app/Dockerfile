FROM jekyll/jekyll
WORKDIR /jekyll-app
COPY . .
RUN bundle install
EXPOSE 4000
CMD ["jekyll", "serve", "--incremental"]