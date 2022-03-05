FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/build/index.js
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
# RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/build/index.js
USER node
CMD ["npm", "start"]
