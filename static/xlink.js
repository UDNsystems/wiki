function xlink(obj) {
	if (window["$"+obj.id]) {
		obj.addEventListener('click', window["$"+obj.id].bind(obj));
	}
}

function start_xlinking(objSelector) {
	document.querySelectorAll(objSelector).forEach(x => {
		if (x.href === "javascript:void(0)") {
			xlink(x);
		}
	})
}

let objs = ['a','button'];

objs.forEach(obj => start_xlinking(obj));
