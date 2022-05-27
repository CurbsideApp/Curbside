FROM node:lts
WORKDIR /app
# COPY package.json and package-lock.json files

COPY /client/build/. ./client/build/
COPY /server/package*.json ./server/
RUN  cd server && npm install

COPY /server/tsconfig.json ./server/

COPY /server/config/dev.env ./server/.env

# COPY
COPY /server/. ./server/

RUN cd server && npx prisma generate

# A command to start the server
CMD cd server && npx ts-node index.ts