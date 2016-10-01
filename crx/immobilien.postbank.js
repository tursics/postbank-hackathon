function injectSeachPanel() {
	'use strict';
	var dists, elem;

	dists = document.getElementsByClassName('fio-hacked');
	if (dists.length === 0) {
		elem = document.getElementsByClassName('fio-search-panel')[0];
		elem.innerHTML += '<div class="fio-hacked" style="background:#fecb00; color:#000060;">x</div>';
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
