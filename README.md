# Curbside - the secondhand market place that's actually pleasant to use
Post items for sale, interact with sellers, save items you are interested in. All Curbside market profits get directed towards green initiatives.

<p align="center">
  <img src="readme-images/screenshots1.png" />
</p>

## Built With

### Frontend
* 🏗 React + Typescript
* 🗺 Leaflet.js
* 💄 SCSS and Bootstrap
* 🧪 Jest, Cypress, and Testing Library

### Backend
* 🏗 Node.js + Express
* 📦 PostgreSQL
* 📊 Prisma
* 📍 PostGIS Extension for Geo Queries
* 🔌 Socket.io
* 🔐 Firebase Authentication
* 📔 Firebase Image Storage


## Run it on your machine

### Set up
1. Create a [Firebase](https://firebase.com/) app for authentication and image storage
2. Create an empty PostgreSQL database as well as an empty test database (e.g. Curbside and Curbside_TEST)


### Installation
1. Fork and clone the repo
2. Add the three `.env` files in `client/` and `server/` folders (see examples below)
3. Install requirements with `npm install` from project root folder, /server and /client folders
4. Generate Prisma artifacts and sync database schema with prisma client with `npx prisma generate` and `npx prisma db push` from `/server` folder.

### Run
1. Start the sever with `npm start:server` from project root folder;
2. Start the app in the browser with `npm start:client` from project root folder;


### Environmental Variables
1. Create .env file in client/src folder:
```
# Firebase keys
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=

# Server URL
REACT_APP_BASE_API_URL=
```

2. Create a /config folder in /server folder
3. Create dev.env file in server/config folder:
```
# Server port
PORT=

# Local DB
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"

# Firebase storage
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PROJECT_ID=
```

4. Set up environment for tests (Skip this if running tests is not a priority)
   - Set up two users through your Firebase console and paste their UIDs in SECRET_UID and SECRET_UID2.
   - This will be needed to send valid requests that pass serverside token verification.
   - Create test.env file  in server/config folder: 

```
# Server port (note, should be other than for dev server)
PORT=4444

# Local test DB
DATABASE_URL="postgresql://username:password@localhost:5432/dbname_TEST?schema=public"

# Real users used for testing purposes
SECRET_UID=
SECRET_UID2=
FIREBASE_API_KEY=

# Firebase storage (same as dev)
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PROJECT_ID=
```



