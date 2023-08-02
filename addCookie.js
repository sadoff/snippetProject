function setCookie(name, value) {
	let whiteList = ['lmru.tech', 'leroymerlin.ru'];
	let url = getCurrentPageUrl();

	let domain = whiteList.reduce(( _a, item) => url.indexOf(item) != -1 ? '.' + item : false); 
	if (!domain) {
		alert('Ты не на стенде LeroyMerlin!');
		return;
	}
	
	chrome.cookies.set({'name': name, 'value': value, 'domain': domain, 'path': '/', 'url': url});
}

async function getCurrentPageUrl() {
	let url;

	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		url = tabs[0].url;
		alert(url);
	});

	return url;
}

function getCookie(name) {
	alert(getCurrentPageUrl());
	//return chrome.cookies.get({'name': name, 'url': getCurrentPageUrl()});
}

/**
 * cartInfo
 * key1:value2%3Bkey2:value2
 */
document.getElementById('cartInfo').addEventListener('click', function () {
	setCookie(this.value, prompt('Введите значение для корзины', '1:1'));
});

/**
 * _unitedMiddle
 * true/false
 */
let _unitedMiddle = getCookie('_unitedMiddle');

document.getElementById('unitedMiddle').setAttribute('class', _unitedMiddle != undefined ? _unitedMiddle.value : 'false');
document.getElementById('unitedMiddle').addEventListener('click', function () {
	this.setAttribute('class', setCookie(this.value, this.getAttribute('class') == 'false' ? 'true' : 'false'));
});