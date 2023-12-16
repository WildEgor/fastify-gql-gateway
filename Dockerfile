# ------------ STAGE: Install deps
FROM node:20.10-alpine3.18 as deps
LABEL stage=deps
ENV NODE_ENV development

WORKDIR /srv/deps

COPY ./tsconfig*.json ./
COPY ./nest-cli.json ./
COPY ./.prettierrc ./
COPY ./.eslint* ./
COPY ./jest.config.json ./
COPY package.json ./
COPY yarn.lock .

RUN yarn global add @nestjs/cli
RUN yarn install --frozen-lockfile

# ------------ STAGE: Build app
FROM node:20.10-alpine3.18 as build
LABEL stage=build
ENV NODE_ENV production

WORKDIR /srv/build

COPY ./src ./src
COPY ./docker-services.json ./services.json
COPY ./.env.local ./.env.local
COPY --from=deps /srv/deps ./

RUN yarn build

# ------------ STAGE: Execute app
FROM node:20.10-alpine3.18 as execute
LABEL stage=execute
ENV NODE_ENV production

WORKDIR /srv/app

COPY --from=build --chown=node:node /srv/build ./

EXPOSE 9051

CMD ["node", "dist/main.js"]

FROM node:20.10-alpine3.18 as dev
LABEL stage=dev
ENV NODE_ENV development

WORKDIR /srv/app

COPY . .

RUN yarn install
ENV PATH=/srv/app/node_modules/.bin:$PATH

EXPOSE 9051
