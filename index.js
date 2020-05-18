const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const connectionString = 'postgres://hyhpyrmnobegtw:06fa9ee29484c06fb97fbdbf5047f3b663d125fa295556e7efd7151fca06645a@ec2-18-209-187-54.compute-1.amazonaws.com:5432/d4rdfj9mhiv2aj'
const pool = new Pool({
	connectionString: connectionString,
	ssl: true
});

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/db', async (req, res) => {
	try {
		const client = await pool.connect();
		const result = await client.query('SELECT * FROM test_table');
		const results = { 'results': (result) ? result.rows : null };
		res.render('pages/db', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
