FROM node:14
WORKDIR /usr/src/twd-api
COPY ./package*.json ./
RUN npm install
CMD [ "tail", "-f", "/dev/null" ]
