# Development
FROM node:24-alpine AS development

ENV TZ="Europe/London"
ENV NODE_ENV=development

ARG PORT=3001
ARG PORT_DEBUG=9229
ENV PORT=${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

RUN apk update && \
    apk add --no-cache git

USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./
COPY --chown=node:node .sequelizerc ./
RUN npm ci
COPY --chown=node:node . .

CMD ["node", "src"]

# Production
FROM node:24-alpine AS production

ENV TZ="Europe/London"
ENV NODE_ENV=production

USER root
RUN apk add --no-cache curl

COPY --from=development --chown=root:root /home/node/package*.json ./
COPY --from=development --chown=root:root /home/node/src ./src/
COPY --from=development --chown=root:root /home/node/.sequelizerc ./.sequelizerc

RUN npm ci --omit=dev

RUN chmod -R a-w /home/node

USER node

ARG PORT=3001
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "src"]
