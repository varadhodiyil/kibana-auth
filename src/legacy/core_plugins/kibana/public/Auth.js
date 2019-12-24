
import chrome from 'ui/chrome';


export function getCookie(cname='custom-login-username') {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	// window.location.href = chrome.addBasePath()
	return null;
  }

export function getAvailableListing(_type) {
	var data = {"username": getCookie() };
	const url = chrome.addBasePath(`/getUserGroup/${_type}`);
	  return fetch(url, {
		  method: 'POST', 
		  cache: 'no-cache', 
		  credentials: 'include', 
		  headers: {
			  'Content-Type': 'application/json',
			  'kbn-xsrf': undefined
		  },
		  redirect: 'follow', 
		  referrer: 'no-referrer', 
		  body: JSON.stringify(data), 
	  })
	  .then(response => response.json());
	// var avl = '20c4d3f0-cb3b-11e9-8a24-f9cd236ae7c4';
	// if(_type === 'dashboard') {
	// 	avl = 'fd3b86b0-cb5b-11e9-b125-e9e2697da748';
	// }
	// return new Promise(resolve => {
	// 	setTimeout(() => {
	// 		const data = {"data" : {
	// 			"took": 0,
	// 			"timed_out": false,
	// 			"_shards": {
	// 			  "total": 1,
	// 			  "successful": 1,
	// 			  "skipped": 0,
	// 			  "failed": 0
	// 			},
	// 			"hits": {
	// 			  "total": {
	// 				"value": 0,
	// 				"relation": "eq"
	// 			  },
	// 			  "max_score": null,
	// 			  "hits": [{
	// 				  "id": avl
	// 			  }]
	// 			}
	// 		  }
	// 		};
	// 		resolve(data);
	// 	}, 300);
	// });

}
export function isAdmin() {
	var user = getCookie();
  if(user !== 'tuser1'){
	// $(".euiNavDrawer").css('visibility','hidden');
	return false;
  } else{
	// window.location.href = chrome.addBasePath('/app/kibana#/dashboard');
	return true;
  }
}
