FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm config set registry https://registry.npm.taobao.org npm info underscore
RUN npm install -g roadhog yarn
RUN npm list -g -depth=0
EXPOSE 8000

 

