async function getProducts() {
	try {
		let res = await $.ajax({
			url: "http://localhost:8080/backend/products",
		});
		return res.payload;
	} catch (error) {
		console.log(error);
	}
	return [];
}

async function getReviews(userId = 0, productId = 0) {
	let params = [];
	if (userId) params.push(`userId=${userId}`);
	if (productId) params.push(`productId=${productId}`);
	try {
		let res = await $.ajax({
			url: `http://localhost:8080/backend/reviews${
				params.length ? "?" + params.join("&") : ""
			}`,
		});
		return res.payload;
	} catch (error) {
		console.log(error);
	}
	return [];
}

async function getCart(userId) {
	try {
		let temp = await $.ajax({
			url: "http://localhost:8080/backend/carts",
			beforeSend: (req) => {
				// console.log(req);
				req.setRequestHeader(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Im50dkBoY211dC5lZHUudm4iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJyb2xlIjoidXNlciJ9.jh0O-DILQc9FJF9Kc3RxP9JeqvUzZDVqK3zDpIBnuRY"
				);
			},
		});
		console.log(temp);
	} catch (error) {
		console.log(error);
	}
}

async function addCart(userId, productId, quantity) {
	try {
		let temp = await $.ajax("http://localhost:8080/backend/carts", {
			method: "POST",
			contentType: "application/json",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Im50dkBoY211dC5lZHUudm4iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJyb2xlIjoidXNlciJ9.jh0O-DILQc9FJF9Kc3RxP9JeqvUzZDVqK3zDpIBnuRY"
				);
			},
			data: { userId, productId, quantity },
		});

		// let temp = await fetch("http://localhost:8080/backend/carts", {
		// 	method: "POST", // *GET, POST, PUT, DELETE, etc.
		// 	mode: "cors", // no-cors, *cors, same-origin
		// 	cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		// 	credentials: "same-origin", // include, *same-origin, omit
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		// 'Content-Type': 'application/x-www-form-urlencoded',
		// 		Authorization:
		// 			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Im50dkBoY211dC5lZHUudm4iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJyb2xlIjoidXNlciJ9.jh0O-DILQc9FJF9Kc3RxP9JeqvUzZDVqK3zDpIBnuRY",
		// 	},
		// 	redirect: "follow", // manual, *follow, error
		// 	referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		// 	body: JSON.stringify({ userId, productId, quantity }), // body data type must match "Content-Type" header
		// });
		console.log(temp);
	} catch (error) {
		console.log(error);
	}
}

function numberWithSeparator(num, separator) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
}

$(document).ready(async function () {});
