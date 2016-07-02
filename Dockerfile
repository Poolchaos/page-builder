FROM    registry.zailab.com/node:0.10.40

# Environmental variables
ENV     USER=root HOME=/tmp

ADD     ./target                  /target
ADD     ./vendor                  /vendor
ADD     ./config/application.json /config/application.json
ADD     ./config.js               /config.js
ADD     ./index.html              /index.html
ADD     ./favicon.ico              /favicon.ico
ADD     ./jspm_packages           /jspm_packages

# Install dependencies
RUN     npm install git+https://zaijenkins:Zcutp123@bitbucket.org/zaralab/plugin-environment-js#feature/refactor && \ 
        npm install git+https://zaijenkins:Zcutp123@bitbucket.org/zaralab/web-server -g && \
        npm install grunt-cli -g && \
        npm install grunt && \
        grunt --version

EXPOSE  8000
CMD     ["web-server", "--hostname", "0.0.0.0", "--path", ".", "--application", "contact-centre"]
