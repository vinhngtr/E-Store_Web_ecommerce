let params = new URLSearchParams(location.search);

$(document).ready(async function () {
	let product = (await getProducts(params.get("id")))[0];
	console.log(product);
	let categories = await getCategories();
	let brands = await getBrands();

	showProduct(product, categories, brands);
});

function showProduct(product, categories, brands) {
	$("#name").val(product.name);
	$("#description").val(product.description);
	categories.forEach((category) => {
		$("#category").append(
			$(
				`<option ${
					category.id == product.categoryId ? "selected" : ""
				} value="${category.id}">${category.name}</option>`
			)
		);
	});
	brands.forEach((brand) => {
		$("#brand").append(
			$(
				`<option ${
					brand.id == product.brandId ? "selected" : ""
				} value="${brand.id}">${brand.name}</option>`
			)
		);
	});
	$("#discount").val(parseFloat(product.discount) * 100);
	if (product.discountStart) $("#discountStart").val(product.discountStart);
	if (product.discountEnd) $("#discountEnd").val(product.discountEnd);
}
