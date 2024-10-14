const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DBHOST,
      user: process.env.DBUSER,
      password: process.env.DBPASSWORD,
      database: process.env.DBDATABASE,
      searchPath: ['public'],
    },
    migrations: {
      directory: './src/db/migrations/all-create-tables',
      extension: 'ts',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
};
