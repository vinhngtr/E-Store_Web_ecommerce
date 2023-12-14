let colorSizes = [];
let images = [];
let categories = [];
let brands = [];

$(document).ready(async function () {
	$("#colorSize-submit").click(addColorSize);
	$("#imageInput").change(addImage);
	$("#form-submit").click(submit);

	categories = await getCategories();
	brands = await getBrands();
	showForm();
});

function showForm() {
	categories.forEach((category) => {
		$("#category").append(
			$(`
            <option value="${category.id}">${category.name}</option>
            `)
		);
	});

	brands.forEach((brand) => {
		$("#brand").append(
			$(`
            <option value="${brand.id}">${brand.name}</option>
            `)
		);
	});
}

function addColorSize() {
	let colorName = $("#colorInput").val();
	let color = $("#colorCodeInput").val();
	let size = $("#sizeInput").val();
	let quantity = $("#quantityInput").val();
	let unitPrice = $("#priceInput").val();
	colorSizes.push({ color, colorName, size, quantity, unitPrice });
	console.log(colorSizes);
	$("#colorSize-cancel").click();
}

function addImage(e) {
	images.push(e.target.value);
	$("#image-list").append($(`<span>${e.target.value}</span>`));
}

async function submit() {
	console.log($(`#name`).val());
	console.log($(`#description`).val());
	console.log($(`#category`).val());
	console.log($(`#brand`).val());
	console.log($(`#discount`).val());
	console.log($(`#discountStart`).val());
	console.log($(`#discountEnd`).val());
	let product = {
		name: $(`#name`).val(),
		description: $(`#description`).val(),
		categoryId: $(`#category`).val(),
		brandId: $(`#brand`).val(),
		discount: $(`#discount`).val(),
	};
	if ($(`#discountStart`).val())
		product.discountStart = $(`#discountStart`).val();
	if ($(`#discountEnd`).val()) product.discountEnd = $(`#discountEnd`).val();
	try {
		console.log(product);
		let productId = (
			await $.ajax({
				url: "http://localhost:8080/backend/products",
				contentType: "application/json",
				method: "POST",
				beforeSend: (req) => {
					req.setRequestHeader(
						"Authorization",
						`Bearer ${Cookies.get("token")}`
					);
				},
				data: JSON.stringify(product),
			})
		).id;
		console.log(productId, images, colorSizes);
		colorSizes.forEach(async (colorSize) => {
			let temp = await $.ajax({
				url: "http://localhost:8080/backend/productColorSizes",
				contentType: "application/json",
				method: "POST",
				beforeSend: (req) => {
					req.setRequestHeader(
						"Authorization",
						`Bearer ${Cookies.get("token")}`
					);
				},
				data: JSON.stringify({ ...colorSize, productId }),
			});
			console.log("color size", temp);
		});
		images.forEach(async (image) => {
			let temp = await $.ajax({
				url: "http://localhost:8080/backend/productImages",
				contentType: "application/json",
				method: "POST",
				beforeSend: (req) => {
					req.setRequestHeader(
						"Authorization",
						`Bearer ${Cookies.get("token")}`
					);
				},
				data: JSON.stringify({ image, productId }),
			});
			console.log("image", temp);
		});
	} catch (error) {
		console.log(error);
	}
}
