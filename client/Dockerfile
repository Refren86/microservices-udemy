FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY ./ ./
ENV CI=true
ENV WDS_SOCKET_PORT=0
CMD ["npm", "start"]
