## Stack

- React.js
- Redux
- Material-UI
- Node + Express
- PostgreSQL

## Database

1. Install PostgreSQL
2. `create database myeasylabs;`
3. `psql -d myeasylabs -f postgres_start.txt`

## Frontend

1. `cd client`
2. `yarn install`
3. `cp env.example .env`
4. `yarn start`
5. Open [http://localhost:3000](http://localhost:3000)

## Backend

1. `cd server`
2. `yarn install`
3. `cp env.example .env`
4. Edit .env and fill in database credentials
5. Make sure your database is running on your machine
6. `yarn dev` for development or `yarn start` for production

## Prettier

1. In Visual Studio Code install the Prettier extension.
2. Go to Code -> Settings -> Preferences, search for `editor.formatOnSave`, set to True.

## Doctor Login

1. Login page for doctors/clients http://localhost:3000/login_client
2. Use email dr@test.com password 12345678
3. Use these credentials so you will see the correct demo data.

## Email

To test email notifications (only for development):

1. Get `username` and `password` from `https://ethereal.email/create`
2. Check emails on `https://ethereal.email/messages`

## Pull Requests
When you are ready with your work please create a git pull request.

It is recommended to test the linter locally before creating pull request:
1. `cd client`
2. `./node_modules/.bin/eslint ./src/`
