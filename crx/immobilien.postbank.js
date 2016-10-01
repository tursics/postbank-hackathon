var user = 'HackathonSep6', // 'HackathonSep7'
	pass = 'hat0814';

// docs: https://hackathon.postbank.de/bank-api/gold/documentation/index.html

function callAPIFunction(username, password, action, token, func) {
	'use strict';
	var url, xhr;

//	url = 'https://hackathon.postbank.de/bank-api/gold/postbankid/token?username=' + username + '&password=' + password + '&action=' + action + '&token=' + token;
	url = 'https://tursics.com/postbank.php?username=' + username + '&password=' + password + '&action=' + action + '&token=' + token;

	xhr = new XMLHttpRequest();
	xhr.open('GET', url);
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

function injectSeachPanel() {
	'use strict';
	var dists, elem, token;

	dists = document.getElementsByClassName('fio-hacked');
	if (dists.length === 0) {
		elem = document.getElementsByClassName('fio-search-panel')[0];
		elem.innerHTML += '<div class="fio-hacked" style="background:#fecb00; color:#000060; padding: 10px 10px 6px; font-size: 14px; font-weight: bold; text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.4);"></div>';

		callAPIFunction(user, pass, 'token', '', function (obj) {
			token = obj.token;

			callAPIFunction(user, pass, '', token, function (obj) { // '' meens 'customer-resource'
				elem = document.getElementsByClassName('fio-hacked')[0];
				elem.innerHTML = 'Hallo ' + obj.name.split(' ')[0] + ', diese Immobilien empfehle ich dir:';

				console.log('IBAN: '+obj.accounts[0].iban);
				console.log('Amount: '+obj.accounts[0].amount);
				console.log(obj);
			});
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
