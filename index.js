const express = require('express');
const app = express();
app.use(express.json());

const Database = require("@replit/database")
const db = new Database()

const users = JSON.parse(process.env.users);

// app.get('/', (req, res) => {
//   res.send('Hello Express app!')
// });
app.use('/static',express.static(__dirname + "/static"));

//app.use('/node_modules',express.static(__dirname + "/node_modules"));
app.use('/monaco', express.static(__dirname + "/node_modules/monaco-editor"))
app.get('/',(req, res) => {
	res.sendFile(__dirname + '/index.html');
})
app.get('/manifest.json',(req, res) => {
	res.sendFile(__dirname + '/manifest.json');
})
app.get('/sw.js',(req, res) => {
	res.sendFile(__dirname + '/sw.js');
})


app.get('/api/page/:name',(req, res) => {
	console.log(`get ${req.params.name}`)
	if (req.params.name === "*") {
		return db.list('page/').then(x => res.json(x.map(y => y.slice(5))));
	}
	db.get(`page/${req.params.name}`).then(data => {
		if (!data) return res.status(404).send();
		res.type('text/plain').send(data);
	})
	
})

app.get('/api/login/check/:username',(req, res) => {
	const username = req.params.username;
	const password = req.query.password;

	if (!username || !password) return res.status(403).send();
	if (!users[username]) return res.status(403).send();
	if (users[username] !== password) return res.status(403).send();
	res.send('ok');
	console.log(`user with the name of ${username} has authenticated`)
})
app.post('/api/page/:name',(req, res) => {
	console.log(`post ${req.params.name}`)
	const {content, username, password} = req.body;
	if (!content) return res.status(401).send('missing body content');
	if (!username || !password) return res.status(403).send();
	if (!users[username]) return res.status(403).send();
	if (users[username] !== password) return res.status(403).send();
	db.set(`page/${req.params.name}`,req.body.content);
	res.send('ok');
})
app.delete('/api/page/:name', (req, res) => {
	console.log(`delete ${req.params.name}`)
	const {username, password} = req.query;
	if (!username || !password) return res.status(403).send();
	if (!users[username]) return res.status(403).send();
	if (users[username] !== password) return res.status(403).send();
	db.delete(`page/${req.params.name}`);
	res.send('ok');
	
})

app.listen(3000, () => {
  console.log('server started');
});