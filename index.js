const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const connectionString = 'postgres://zqlsxjukaoyufk:b8a8f3548e5e5fc3896e4c5e858bb5fbf6592ad2fbc1fbd49cb1c7e43b3151c4@ec2-52-201-55-4.compute-1.amazonaws.com:5432/dfb3mndsc2qknr'
const pool = new Pool({
	connectionString: connectionString,
	ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/db', async (req, res) => {
  	try {
  		const client = await pool.connect()
  		const result = await client.query('SELECT * FROM test_table');
  		const results = { 'results': (result) ? result.rows : null };
  		res.render('pages/db', results );
  		client.release();
  	} catch (err) {
  		console.error(err);
  		res.send("Error " + err);
  	}
  })
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}