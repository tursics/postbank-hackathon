//var user = 'HackathonSep6', // IBAN DE68100100100625019119 <- Single
var	user = 'HackathonSep7', // IBAN DE18100100100625020116   <- Familie
	pass = 'hat0814',
	profile = {};

// docs: https://hackathon.postbank.de/bank-api/gold/documentation/index.html

// "Miete Wohnung Februar 2015" -620,00
// "Stadtverwaltung, Hundesteuer 2015" -130,00
// "Familienkasse Kindergeld Februar 2015" +184,00

function scoring(content) {
	'use strict';
	var i, j, transaction, amount, purpose;
	profile.balance = 0;
	profile.children = 0;
	profile.rent = 0;
	profile.car = 0;

	for (i = 0; i < content.length; ++i) {
		transaction = content[i];
		profile.balance = Math.max(profile.balance, transaction.balance);
		amount = transaction.amount;
		// transaction.bookingDate

		purpose = '';
		for (j = 0; j < transaction.purpose.length; ++j) {
			purpose += transaction.purpose[j];
		}

		if (amount > 0) {
			profile.children += purpose.indexOf('Familienkasse Kindergeld') > -1 ? 1 : 0;
		} else {
			profile.rent = Math.max(profile.rent, purpose.indexOf('Miete') > -1 ? Math.abs(amount) : 0);
			profile.car += purpose.indexOf('Aral') > -1 ? 1 : 0;
			profile.car += purpose.indexOf('Shell') > -1 ? 1 : 0;
			profile.car += purpose.indexOf('Total') > -1 ? 1 : 0;
			profile.car += purpose.indexOf('Esso') > -1 ? 1 : 0;
			profile.car += purpose.indexOf('Avia') > -1 ? 1 : 0;
			profile.car += purpose.indexOf('Jet') > -1 ? 1 : 0;
		}
	}
}

function euro2int(str) {
	'use strict';

	var ret = str.replace('.', '').replace('.', '');
	return parseInt(ret, 10);
}

function int2euro(val) {
	'use strict';
	var str = val.toString();

	if (str.length > 3) {
		str = str.substr(0, str.length - 3) + '.' + str.substr(-3);
	}
	if (str.length > 7) {
		str = str.substr(0, str.length - 7) + '.' + str.substr(-7);
	}
	str += ' €';

	return str;
}

function int2eurocent(val) {
	'use strict';
	var str = val.toString();
	if (str.indexOf('.') === -1) {
		str += '.00';
	} else if (str.indexOf('.') === (str.length - 2)) {
		str += '0';
	}
	str = str.replace('.', ',');

	if (str.length > 7) {
		str = str.substr(0, str.length - 7) + '.' + str.substr(-7);
	}
	str += ' €';

	return str;
}

function callAPIFunction(username, password, action, token, func) {
	'use strict';
	var url, xhr;

	url = 'https://hackathon.postbank.de/bank-api/gold/postbankid/' + action + '?username=' + username + '&password=' + password;

	xhr = new XMLHttpRequest();
	if ('token' !== action) {
		xhr.open('GET', url);
	} else {
		xhr.open('POST', url);
	}
	xhr.setRequestHeader('Device-Signature', '485430330021fc0f');
	xhr.setRequestHeader('API-Key', '485430330021fc0f');
	if ('token' !== action) {
		xhr.setRequestHeader('X-Auth', token);
	}
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status < 400) {
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

function thinningSeachPanel() {
	'use strict';
	var dists, elem, elem2, i, val;

	dists = document.getElementsByClassName('fio-infinite-item');
	for (i = 0; i < dists.length; ++i) {
		elem = document.getElementsByClassName('fio-infinite-item')[i];
		elem2 = elem.getElementsByClassName('labeled-output__value')[0];
		val = euro2int(elem2.innerHTML);

		if (profile.amount < val) {
			elem.style.color = '#e7908e';

			elem2 = elem.getElementsByClassName('fio-item-inner')[0];
			elem2.style.borderColor = '#e7908e';

			elem2 = elem.getElementsByClassName('fio-item-gallery')[0];
			elem2.style.opacity = 0.3;

			elem2 = elem.getElementsByClassName('fio-item-info')[0];
			elem2.style.opacity = 0.3;

			elem2 = elem.getElementsByClassName('btn-primary')[0];
			elem2.style.backgroundColor = '#e7908e';
		}
	}
}

function injectSeachPanel() {
	'use strict';
	var dists, elem, token, iban, productType;

	dists = document.getElementsByClassName('fio-hacked');
	if (dists.length === 0) {
		elem = document.getElementsByClassName('fio-search-panel')[0];
		elem.innerHTML += '<div class="fio-hacked" style="background:#fecb00; color:#000060; padding: 10px 10px 6px; font-size: 14px; font-weight: bold; text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.4);">&nbsp;<br>&nbsp;</div>';

		callAPIFunction(user, pass, 'token', '', function (obj) {
			token = obj.token;

			callAPIFunction(user, pass, '', token, function (obj) { // '' meens 'customer-resource'
				iban = obj.accounts[0].iban;
				productType = obj.accounts[0].productType;

				profile.amount = parseFloat(obj.accounts[0].amount) * 5;
				profile.amount = parseInt(profile.amount / 1000, 10) * 1000;

				elem = document.getElementsByClassName('fio-hacked')[0];
				elem.innerHTML = 'Hallo ' + obj.name.split(' ')[0] + ', diese Immobilien empfehle ich dir:<br>';
				elem.innerHTML += '<span style="color: #5d4800; font-size: 13px; text-shadow: none; font-weight: 500;">(dein Limit sollte bei ' + int2euro(profile.amount) + ' liegen)</span>';

				callAPIFunction(user, pass, 'accounts/' + productType + '/' + iban + '/transactions', token, function (obj) {
					scoring(obj.content);
					thinningSeachPanel();
				});
			});
		});
	}
}

function injectEstatePanel() {
	'use strict';
	var dists, elem, token, iban, productType, str;

	dists = document.getElementsByClassName('fio-estate-hacked');
	if (dists.length === 0) {
		elem = document.getElementsByClassName('fio-estate-highlights')[0];
		elem.innerHTML += '<div class="fio-estate-hacked col-xs-12 ng-scope"></div>';

		callAPIFunction(user, pass, 'token', '', function (obj) {
			token = obj.token;

			callAPIFunction(user, pass, '', token, function (obj) { // '' meens 'customer-resource'
				iban = obj.accounts[0].iban;
				productType = obj.accounts[0].productType;

				profile.amount = parseFloat(obj.accounts[0].amount) * 5;
				profile.amount = parseInt(profile.amount / 1000, 10) * 1000;

				callAPIFunction(user, pass, 'accounts/' + productType + '/' + iban + '/transactions', token, function (obj) {
					scoring(obj.content);
//					thinningSeachPanel();
					console.log( profile);

					var elem2 = elem.getElementsByClassName('labeled-output__value')[0];
					var cost = euro2int(elem2.innerHTML);
					var amount = profile.amount / 5;
					var interest = 1.07 / 100;
					var years = 20;
//					var sum = (cost - amount) * (Math.pow(1 + interest, years) * interest) / (Math.pow(1 + interest, years) - 1);
					var sum = cost / .2 * 0.0005;
					console.log(sum);

					elem = document.getElementsByClassName('fio-estate-hacked')[0];

					str = '<div class="fio-estate-higlight-item fio-col-md-3 fio-col-sm-6 fio-col-xs-12" style="100%">';
					str += '<div class="labeled-output labeled-output_large">';
					str += '<span class="labeled-output__label">Eigenkapital</span>';
					str += '<span class="labeled-output__value ng-binding">' + int2euro(amount) + '</span>';
					str += '</div></div>';
					elem.innerHTML += str;

					str = '<div class="fio-estate-higlight-item fio-col-md-3 fio-col-sm-6 fio-col-xs-12" style="100%">';
					str += '<div class="labeled-output labeled-output_large" style="background: #ced6e4;">';
					str += '<span class="labeled-output__label">Aktuelle Miete</span>';
					str += '<span class="labeled-output__value ng-binding">' + int2eurocent(profile.rent) + '</span>';
					str += '</div></div>';
					elem.innerHTML += str;

					str = '<div class="fio-estate-higlight-item fio-col-md-3 fio-col-sm-6 fio-col-xs-12">';
					str += '<div class="labeled-output labeled-output_large" style="background: #ced6e4;">';
					str += '<span class="labeled-output__label">Mögliche Rate</span>';
					str += '<span class="labeled-output__value ng-binding">' + int2eurocent(sum) + '</span>';
					str += '</div></div>';
					elem.innerHTML += str;

					str = '<div class="fio-estate-higlight-item fio-col-md-3 fio-col-sm-6 fio-col-xs-12">';
					str += '<div class="labeled-output labeled-output_large">';
					str += '<span class="labeled-output__label">Laufzeit</span>';
					str += '<span class="labeled-output__value ng-binding">' + years + ' Jahre</span>';
					str += '</div></div>';
					elem.innerHTML += str;
				});
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
					dists = addedNode.getElementsByClassName('ng-isolate-scope');
					if (dists.length > 0) {
						thinningSeachPanel();
					}
					dists = addedNode.getElementsByClassName('fio-estate-highlights');
					if (dists.length > 0) {
						injectEstatePanel();
					}
				} catch (x) {
				}
			}
		}
	});
});

var target = document.getElementsByClassName("content").item(0);
var config = { childList: true, subtree: true };
bankObserver.observe(target, config);
