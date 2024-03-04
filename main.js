async function setCookie(key, value) {
	let whiteList = ['lmru.tech', 'leroymerlin.ru'];
	let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});

	if (tabs.length != 0) {
		let domain = whiteList.find((item) => tabs[0].url.indexOf(item) != -1 ? '.' + item : false);

		if (domain != null) {
			chrome.cookies.set({'name': key, 'value': value, 'domain': domain, 'path': '/', 'url': tabs[0].url});
			return new Promise((resolve, _) => resolve(value));
		}
	}

	warning();
}

async function getCookie(key) {
	let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});

	if (tabs.length != 0) {
		return chrome.cookies.get({'name': key, 'url': tabs[0].url});
	}

	warning();
}

async function getLocalStorage(key) {
	let tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});

	if (tabs.length != 0) {
		return await chrome.scripting.executeScript({
			target: {
				tabId: tabs[0].id
			},
			args: [key],
			func: (key) => localStorage[key]
		});
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
	alert('Ты не на стенде LM!');
}

function isDefinedAndNotFalse(value) {
	return value != null && value.value != 'false' && value.value != null;
}

function toggle(item, condition) {
	item.setAttribute("data-state", condition.toString());

	item.classList.add(condition.toString());
	item.classList.remove((!condition).toString());
}

let main_block = document.getElementById('main');

await fetch('https://raw.githubusercontent.com/sadoff/snippetProject/main/sheme.json')
	.then(r => r.json())
	.then(r => {
		r.main.forEach(panel => {
			let panel_code = '<div class="panel">';

			if (panel.name !== false) {
				panel_code += '<h2>' + panel.name + '</h2>';
			}

			panel.objects.forEach(object => {
				if (object.type == 'button') {
					panel_code += '<button value="' + object.name + 
						'" onclick="setCookie(\'' + object.name + 
						'\', ' + eval(object.action) + '">' + 
						object.name + '</button>';
				}
				
				if (object.type == 'toggle' || object.type == 'mini_toggle') {
					panel_code += '';
				}
			});
			
			main_block.innerHTML += panel_code + '</div>';
		});

		r.fields.forEach(field => {

		});

		document.getElementById('loader').style.display = 'none';
		document.getElementById('wrapper').style.display = 'block';
	});

(async function main() {
	let sheme = await fetch('https://raw.githubusercontent.com/sadoff/snippetProject/main/sheme.json');
	/**
	 * Таблица со значениями базовых cookies и данных из Local Storage
	 */
	let ym_uid = await getCookie('_ym_uid');
	let ga = await getCookie('_ga');
	let cartInfo = await getCookie('cartInfo');
	let rxVisitor = await getCookie('rxVisitor');
	let checkoutOrderId = await getLocalStorage('checkoutOrderId');
	let checkoutSessions = await getLocalStorage('checkoutSessions');
	
	if (isDefinedAndNotFalse(ym_uid)) document.getElementById('_ym_uid').value = ym_uid.value;
	if (isDefinedAndNotFalse(ga)) document.getElementById('_ga').value = ga.value;
	if (isDefinedAndNotFalse(cartInfo)) document.getElementById('cartInfo').value = cartInfo.value;
	if (isDefinedAndNotFalse(rxVisitor)) document.getElementById('rxVisitor').value = rxVisitor.value;
	if (checkoutOrderId != null && checkoutOrderId.length > 0) document.getElementById('checkoutOrderId').value = checkoutOrderId[0].result;
	if (checkoutSessions != null && checkoutSessions.length > 0) document.getElementById('checkoutSessions').value = checkoutSessions[0].result;

    /**
	 * cartInfo
	 * key1:value2%3Bkey2:value2
	 */
	document.getElementById('addCartInfo').addEventListener('click', async function () {
		setCookie(this.value, prompt('Введите значение для корзины', '1:1'));
		reload();
	});

	/**
	 * Добавление обработчиков событий для всех элементов с data-type="toggle"
	 */
	let toggleButtons = document.querySelectorAll('[data-type="toggle"]');
	for (const button of toggleButtons) {
        let cookie = await getCookie(button.value);

		toggle(button, isDefinedAndNotFalse(cookie));

        button.addEventListener('click', async function () {
			toggle(this, this.getAttribute('data-state') == 'false');
        	await setCookie(this.value, this.getAttribute('data-state'));
        	reload();
        });
    }

	/**
	 * Добавление обработчиков событий для всех элементов с data-type="value"
	 */
    let valueButtons = document.querySelectorAll('[data-type="value"]');
    for (const button of valueButtons) {
        let cookie = await getCookie(button.value);
	
		if (isDefinedAndNotFalse(cookie) && cookie.value == button.getAttribute('data-value')) {
			toggle(button, true);
		}

        button.addEventListener('click', async function () {
			let cookie = await getCookie(this.value);

			toggle(this, this.getAttribute('data-state') == 'false');
			if (isDefinedAndNotFalse(cookie) && cookie.value == this.getAttribute('data-value')) {
				await setCookie(this.value, 'false');
			} else {
				await setCookie(this.value, this.getAttribute('data-value'));
			}
        	reload();
        });
    }

	/**
	 * Добавление обработчиков событий на поля ввода
	 */
	let inputs = document.querySelectorAll('[type="text"]');
	for (const input of inputs) {
		input.addEventListener('click', async function () {
			navigator.clipboard.writeText(input.value);
        });
	}
})();