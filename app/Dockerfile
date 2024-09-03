FROM node:18-alpine

RUN apk update
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV NEXT_PUBLIC_API_URL "https://clic.epfl.ch/s4s/api"
ENV NEXT_PUBLIC_FRONTEND_URL "https://clic.epfl.ch/s4s"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci

COPY . .
RUN npm run build

# switch to unprivileged user from node base image
RUN chown -R node .
USER node

CMD [ "npm", "start" ]