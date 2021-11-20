var converter = new showdown.Converter();
converter.setOption('tables',true);

var editor = monaco.editor.create(document.getElementById('container'), {
		value: '# [placeholder](https://example.com)',
		language: 'markdown',
		automaticLayout: true,
		wordWrap: 'on'
});
monaco.editor.setTheme('vs-dark')
if (localStorage.username && localStorage.password) {
	document.getElementById('modcontrols').hidden = false;
	document.getElementById('login').hidden = true;
}
async function checkLogin(username, password) {
	let req = await fetch(`/api/login/check/${username}?password=${escape(password)}`);

	if (req.status === 200) return true;
	return false;
}
async function $login() {
	let username = prompt('Username?');
	let password = prompt('Password?');

	let success = await checkLogin(username, password);

	if (success) {
		localStorage.username = username;
		localStorage.password = password;
		document.getElementById('modcontrols').hidden = false;
		document.getElementById('login').hidden = true;
		
		return alert('Logged in successfully!');
	}
	return alert('Failed to login, check if the username and password are correct and try again.');
}
function $edit() {
	if (!localStorage.username || !localStorage.password) return alert('You need to be logged in!');
	editor.getModel().setValue(loadedPageCache);
	document.querySelector('#page').hidden = true;
	document.querySelector('#editor').hidden = false;
	document.querySelector('#modcontrols').hidden = true;
}
function $cancel() {
	document.querySelector('#page').hidden = false;
	document.querySelector('#editor').hidden = true;
	document.querySelector('#modcontrols').hidden = false;
}
async function $save() {
	var json = {
		content: editor.getModel().getValue(),
		username: localStorage.username,
		password: localStorage.password
	};
	this.disabled = true;
	this.style.cursor = "busy";
	await fetch(`/api/page/${loadedPageNameCache}`,{
		method: 'POST',
		body: JSON.stringify(json),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	this.style.cursor = "progress";
	delete cache[loadedPageNameCache];
	await loadPageFromHash();
	document.querySelector('#page').hidden = false;
	document.querySelector('#editor').hidden = true;
	document.querySelector('#modcontrols').hidden = false;
	this.style.cursor = "pointer";
	this.disabled = false;
}
async function $newpage() {
	let pageId = prompt('Page ID (e.g. docs)?');
	if (!confirm('Are you sure you want to create the page '+pageId+"?")) return;
	this.disabled = true;
	this.style.cursor = "busy";
	var json = {
		content: `# ${pageId}\nThis is the start of a new page, press the edit button and start writing!`,
		username: localStorage.username,
		password: localStorage.password
	};
	await fetch(`/api/page/${pageId}`,{
		method: 'POST',
		body: JSON.stringify(json),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	location.hash = pageId;
	this.disabled = false;
	this.style.cursor = "pointer";
}
async function $delpage() {
	function areyouSure() {
		return confirm('Are you sure?');
	}
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	if (!areyouSure()) return;
	let input = prompt(`Retype "${loadedPageNameCache}" to confirm you really want to delete this page.`);
	if (input !== loadedPageNameCache) return;
	await fetch(`/api/page/${loadedPageNameCache}?username=${escape(localStorage.username)}&password=${escape(localStorage.password)}`,{
		method: 'DELETE'
	})
	location.hash = "home"
}

window.onhashchange = function() {
	loadPageFromHash();
}
let cache = {};
let loadedPageCache = "";
let loadedPageNameCache = "";
function updateLinks() {
	let links = document.querySelectorAll('a');
	links.forEach(link => {
		if (!link.href.startsWith(location.origin)) return;
		let ducktmp = link.href.split('#');
		if (ducktmp.length === 1) return;
		let page = ducktmp[1];
		link.onmouseenter = async function() {
			if (!cache[page]) {
				cache[page] = await (await fetch(`/api/page/${page}`)).text();

				console.log('cached',page);
			}
		}
	})
}
updateLinks();
async function loadPageFromHash() {
	let page = location.hash.slice(1);
	loadedPageNameCache = page;
	document.getElementById('page').innerHTML = `<br><center>Loading ${page}.md ...</center>`;
	let pageData = null;
	if (cache[page]) {
		pageData = cache[page];
	} else {
		let pageResponse = await fetch(`/api/page/${page}`);
    if (!pageResponse.ok) pageData = "# 404 Page not found!"; else
		  pageData = await pageResponse.text();
	}
	
	let pageHTML = converter.makeHtml(pageData);

	document.getElementById('page').innerHTML = pageHTML;
	
	if (document.querySelector('#page > pre code')) {
		hljs.highlightAll();
	}
	updateLinks();
	document.getElementById('page').classList.add('susduc');
	setTimeout(_ => document.getElementById('page').classList.remove('susduc'),1500)
	loadedPageCache = pageData;
}

if (location.hash !== "" && location.hash !== "#" && location.hash !== "#!") {
	loadPageFromHash();
} else {
	location.hash = "#home";
}