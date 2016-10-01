function callAPIFunction(username, password, func) {
	'use strict';
	var url, xhr;

//	url = 'https://hackathon.postbank.de/bank-api/gold/postbankid/token?username=' + username + '&password=' + password;
	url = 'https://tursics.com/postbank.php?username=' + username + '&password=' + password;

	xhr = new XMLHttpRequest();
	xhr.open('POST', url);
//	xhr.setRequestHeader('Device-Signature', '485430330021fc0f');
//	xhr.setRequestHeader('API-Key', '485430330021fc0f');
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				if ('' !== xhr.responseText) {
					var response = JSON.parse(xhr.responseText);
					func(response);
				} else {
					func({});
				}
			} else {
				func({});
			}
		} else {
			func({});
		}
	};
	xhr.onerror = function (e) {
		func({});
	};
	xhr.send(null);
}

/*
docs: https://hackathon.postbank.de/bank-api/gold/documentation/index.html
API key: 485430330021fc0f

POSTBANKID



POST
https://hackathon.postbank.de/bank-api/gold/postbankid/token

Header
Device-Signature: 485430330021fc0f
API-Key: 485430330021fc0f

Body
username: HackathonSep6
username: HackathonSep7
password: hat0814
*/

function injectSeachPanel() {
	'use strict';
	var dists, elem;

	dists = document.getElementsByClassName('fio-hacked');
	if (dists.length === 0) {
		elem = document.getElementsByClassName('fio-search-panel')[0];
		elem.innerHTML += '<div class="fio-hacked" style="background:#fecb00; color:#000060;"></div>';

		callAPIFunction('HackathonSep6', 'hat0814', function (obj) {
			elem = document.getElementsByClassName('fio-hacked')[0];
			elem.innerHTML = 'Token: ' + obj.token;
			console.log(obj);
		});
	}
}

var bankObserver = new MutationObserver(function (mutations) {
	'use strict';

	mutations.forEach(function (mutation) {
		var i, addedNode, dists;
		for (i = 0; i < mutation.addedNodes.length; i++) {
			addedNode = mutation.addedNodes[i];
			if (addedNode) {
				try {
					dists = addedNode.getElementsByClassName('fio-search-panel');
					if (dists.length > 0) {
						injectSeachPanel();
					}
				} catch (x) {
				}
			}
/*			if (addedNode.getAttribute("data-hpos"))
			{
				var hotelNode = addedNode;
				var hotelId = hotelNode.getAttribute("id");
				var dists = hotelNode.getElementsByClassName('distances_centered');
//				console.log("Added hotel with id [" + hotelId + "].");

				if(dists.length > 0) {
					var hotelItem = hotelNode.getAttribute("data-hotelitemurl");
					getHRSHotelAddress(hotelItem,hotelId);
				}

				distancesObserver.observe(hotelNode, { childList: true });
			}*/
		}
	});
});

var target = document.getElementsByClassName("content").item(0);
var config = { childList: true, subtree: true };
bankObserver.observe(target, config);
