FROM artifactory.corp.olacabs.com:5000/node:8.0.0
MAINTAINER Bhargav Chippada <bhargav.chippada19@gmail.com>
RUN mkdir -p /home/web
COPY . /home/web/
WORKDIR /home/web/
RUN npm install
ENTRYPOINT npm run start