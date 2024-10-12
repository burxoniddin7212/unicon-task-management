const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
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
