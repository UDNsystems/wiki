const fs = require('fs');
const path = require('path');

const Database = require("@replit/database")
const db = new Database()

let folderDuck = fs.readdirSync("./static/pages");

folderDuck.forEach(x => {
	console.log('moving',x.slice(0,-3))
	let page = fs.readFileSync(path.join("./static/pages",x),{encoding: 'utf-8'});
	
	db.set(`page/${x.slice(0,-3)}`,page);
})