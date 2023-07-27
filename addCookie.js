function addCookie(name, value){
	let whiteList = ['lmru.tech', 'leroymerlin.ru'];
	let domain = whiteList.reduce(( _a, item)=>window.location.hostname.indexOf(item) != -1 ? '.' + item : false); 
	if(!domain){
		alert('Ты не на стенде LeroyMerlin');
		return;
	}
	//document.cookie = name + '=' + value + '; domain=' + domain + '; path=/'; 
	chrome.cookies.set({"name": name, "value": value, "domain": domain, "path": "/"});
	return value;
}	


