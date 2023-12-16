# ------------ STAGE: Install deps
FROM node:20.10-alpine3.18 as deps
LABEL stage=deps
ENV NODE_ENV development

WORKDIR /srv/deps

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./

RUN yarn global add @nestjs/cli
RUN yarn install --frozen-lockfile

# ------------ STAGE: Build app
FROM node:20.10-alpine3.18 as build
LABEL stage=build
ENV NODE_ENV production

WORKDIR /srv/build

COPY ./src ./src
COPY ./tsconfig*.json ./
COPY ./nest-cli.json ./
COPY ./.prettierrc ./
COPY ./.eslintignore ./
COPY ./.eslintrc.js ./
COPY ./jest.config.json ./

COPY --from=deps /srv/deps/node_modules ./node_modules

RUN yarn build
RUN yarn install --production && yarn cache clean

# ------------ STAGE: Execute app
FROM node:20.10-alpine3.18 as execute
LABEL stage=execute
ENV NODE_ENV production

WORKDIR /srv/app

COPY --from=build --chown=node:node /srv/build/start.sh ./start.sh
COPY --from=build --chown=node:node /srv/build/node_modules ./node_modules
COPY --from=build --chown=node:node /srv/build/dist ./dist
COPY --from=build --chown=node:node /srv/build/docker-services.json ./services.json
COPY --from=build --chown=node:node /srv/build/.env.local ./.env.local

EXPOSE 9051

RUN chmod ugo+rwx /srv/app/start.sh
RUN apk update && apk upgrade && apk add --no-cache bash git openssh curl

CMD ["node", "dist/main.js"]

FROM node:20.10-alpine3.18 as dev
LABEL stage=dev
ENV NODE_ENV development

WORKDIR /srv/app

COPY . .

RUN yarn install
ENV PATH=/srv/app/node_modules/.bin:$PATH

EXPOSE 9051
