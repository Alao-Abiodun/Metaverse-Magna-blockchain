FROM node:18.18.0-alpine
# enable pnpm via corepack
RUN corepack enable
# create and set working directory
WORKDIR /usr/app
# copy package.json
COPY package.json ./
# install dependencies
RUN yarn install
# copy source code
COPY . .
# build source file
RUN yarn build
# expose port 3000
EXPOSE 3000
# start app
CMD ["yarn", "run", "start"]