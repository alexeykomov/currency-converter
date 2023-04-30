# Currency converter

The project is created for technical screening.

### Technical choices
1. Docker is used to host Postgres.
2. To connect to Postgres, `pg` package is used.
3. To manage css, CSS modules are used.
4. To manage client-side state, Redux Toolkit is used.
5. `recharts` library was used to create charts.
6. Firebase is used to manage auth.

### Setup
#### Server
1. Obtain `service-account.json` file and `.env` files from author.
2. `cd server`
3. `./run-db.sh`
4. `nvm use`
5. `npm i`
6. `npm start`

#### Client
1. `cd client`
2. `nvm use`
3. `npm i`
4. `npm start`
