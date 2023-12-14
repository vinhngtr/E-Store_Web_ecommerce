async function getOrders() {
	try {
		let temp = await $.ajax({
			url: "http://localhost:8080/backend/userOrders",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("token")}`
				);
			},
		});
		return temp.payload;
	} catch (error) {
		console.log(error);
	}
}

async function getOrderDetails(orderId) {
	try {
		let temp = await $.ajax({
			url: `http://localhost:8080/backend/userOrders?id=${orderId}`,
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("token")}`
				);
			},
		});
		return temp.payload;
	} catch (error) {
		console.log(error);
	}
}

async function getCategories() {
	try {
		let temp = await $.ajax({
			url: "http://localhost:8080/backend/categories",
		});
		return temp.payload;
	} catch (error) {
		console.log(error);
	}
}

async function getBrands() {
	try {
		let temp = await $.ajax({
			url: "http://localhost:8080/backend/brands",
		});
		return temp.payload;
	} catch (error) {
		console.log(error);
	}
}

async function getProducts(id = 0) {
	try {
		let temp;
		if (id)
			temp = await $.ajax({
				url: `http://localhost:8080/backend/products?id=${id}`,
			});
		else
			temp = await $.ajax({
				url: "http://localhost:8080/backend/products",
				beforeSend: (req) => {
					req.setRequestHeader(
						"Authorization",
						`Bearer ${Cookies.get("token")}`
					);
				},
			});
		console.log(temp);
		return temp.payload;
	} catch (error) {
		console.log(error);
	}
}

function toCapitalized(s) {
	return s[0].toUpperCase() + s.slice(1);
}

function numberWithSeparator(num, separator) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
}
