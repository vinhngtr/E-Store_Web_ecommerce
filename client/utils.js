async function getProducts() {
	try {
		let res = await $.ajax({
			url: "http://localhost:8080/backend/products",
		});
		console.log(res);
		return res.payload;
	} catch (error) {
		console.log(error);
	}
	return [];
}

async function getProductById(productId) {
	try {
		let res = await $.ajax({
			url: `http://localhost:8080/backend/products?id=${productId}`,
		});
		return res.payload[0];
	} catch (error) {
		console.log(error);
	}
	return [];
}

async function getCategories() {
	try {
		let res = await $.ajax({
			url: "http://localhost:8080/backend/categories",
		});
		console.log(res);
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

async function getCart() {
	let token = Cookies.get("token");

	if (!token) location.href = "../Signin/index.html";

	try {
		let res = await $.ajax({
			url: "http://localhost:8080/backend/carts",
			beforeSend: (req) => {
				req.setRequestHeader("Authorization", `Bearer ${token}`);
			},
		});
		return res.payload;
	} catch (error) {
		console.log(error);
	}
}

async function addCart(color, size, productId, quantity) {
	let token = Cookies.get("token");

	if (!token) location.href = "../Signin/index.html";

	try {
		let temp = await $.ajax("http://localhost:8080/backend/carts", {
			method: "POST",
			contentType: "application/json",
			beforeSend: (req) => {
				req.setRequestHeader("Authorization", `Bearer ${token}`);
			},
			data: JSON.stringify({ color, size, productId, quantity }),
		});
		console.log(temp);
	} catch (error) {
		console.log(error);
	}
}

async function addOrder(products) {
	let token = Cookies.get("token");
	if (!token) location.href = "../Signin/index.html";

	console.log(JSON.stringify({ products }));

	try {
		let temp = await $.ajax("http://localhost:8080/backend/userOrders", {
			method: "POST",
			contentType: "application/json",
			beforeSend: (req) => {
				req.setRequestHeader("Authorization", `Bearer ${token}`);
			},
			data: JSON.stringify({ products }),
		});
		console.log(temp);
	} catch (error) {
		console.log(error);
	}
}

function numberWithSeparator(num, separator) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
}
