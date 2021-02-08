FROM node:10

WORKDIR /workspace

RUN npm install -g @angular/cli@6.1.1

COPY . . 
RUN npm install

ENV PATH /workspace/node_modules/.bin:$PATH