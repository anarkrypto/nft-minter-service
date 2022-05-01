FROM node:16-alpine as base
WORKDIR /app
COPY ./src/ ./src/
COPY ./artifacts/ ./artifacts/
COPY package*.json ./
COPY tsconfig.json ./

FROM base as production
ENV NODE_ENV=production
RUN npm ci
RUN npm run build
CMD ["node", "./dist/worker"]

FROM base as dev
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

ENV NODE_ENV=development
RUN npm install
RUN npm run build
CMD ["node", "./dist/worker"]