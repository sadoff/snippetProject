async function setCookie(name, value) {
	let whiteList = ['lmru.tech', 'leroymerlin.ru'];
	let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});

	if (tabs.length != 0) {
		let domain = whiteList.find((item) => tabs[0].url.indexOf(item) != -1 ? '.' + item : false);

		if (domain !== undefined) {
			chrome.cookies.set({'name': name, 'value': value, 'domain': domain, 'path': '/', 'url': tabs[0].url});
			return new Promise((resolve, _) => resolve(value));
		}
	}

	warning();
}

async function getCookie(name) {
	let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});

	if (tabs.length != 0) {
		return chrome.cookies.get({'name': name, 'url': tabs[0].url});
	}

	warning();
}

async function reload() {
	await chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		if (tabs.length != 0) {
			return chrome.tabs.reload(tabs[0].id)
		}

		warning();
	});
}

function warning() {
	alert('Ты не на стенде LeroyMerlin!');
}

function isCookieTrue(value) {
	return value != undefined && value != null && value.value != 'false';
}

(async function main() {
	/**
	 * _ym_uid, _ga, rxVisitor
	 */
	let ym_uid = await getCookie('_ym_uid');
	let ga = await getCookie('_ga');
	let rxVisitor = await getCookie('rxVisitor');

	if (isCookieTrue(ym_uid)) document.getElementById('_ym_uid').innerText = ym_uid.value;
	if (isCookieTrue(ga)) document.getElementById('_ga').innerText = _ga.value;
	if (isCookieTrue(rxVisitor)) document.getElementById('rxVisitor').innerText = rxVisitor.value;

    /**
	 * cartInfo
	 * key1:value2%3Bkey2:value2
	 */
	document.getElementById('cartInfo').addEventListener('click', function () {
		setCookie(this.value, prompt('Введите значение для корзины', '1:1'));
		reload();
	});

	/**
	 * _unitedMiddle
	 * true/false
	 */
	let _unitedMiddle = await getCookie('_unitedMiddle');

	document.getElementById('unitedMiddle').setAttribute('class', isCookieTrue(_unitedMiddle) ? _unitedMiddle.value : 'false');
	document.getElementById('unitedMiddle').addEventListener('click', async function () {
		this.setAttribute('class', await setCookie(this.value, this.getAttribute('class') == 'false' ? 'true' : 'false'));
		reload();
	});
})();