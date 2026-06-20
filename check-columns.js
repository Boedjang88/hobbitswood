require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DIRECT_URL
});
pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'SiteSettings\'')
  .then(res => {
    console.log(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
