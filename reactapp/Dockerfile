FROM node:15.13-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . . 
RUN chown -R node /app/node_modules
CMD ["npm","start"]