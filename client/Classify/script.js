var products = [];
var filteredProducts = [];
var categories = [];
var params = new URLSearchParams(location.search);

var filterCate = (product) => true;
var filterPrice = (product) => true;

$(document).ready(async () => {
	await getProducts();
	showProducts();

	// await getCategories();
	showClassifyCategories();

	$("input[type=radio]").click((e) => {
		switch (e.target.value) {
			case "all":
				filterPrice = (product) => true;
				break;
			case "0-200":
				filterPrice = (product) => product.unitPrice < 200000;
				break;
			case "200-500":
				filterPrice = (product) =>
					product.unitPrice >= 200000 && product.unitPrice < 500000;
				break;
			case "500-1500":
				filterPrice = (product) =>
					product.unitPrice >= 500000 && product.unitPrice < 1500000;
				break;
			case "1500-2500":
				filterPrice = (product) =>
					product.unitPrice >= 1500000 && product.unitPrice < 2500000;
				break;
			case "2500":
				filterPrice = (product) => product.unitPrice >= 2500000;
				break;

			default:
				break;
		}
		$("#criteria-price .criteria-item-text").text(e.target.dataset.text);
		showProducts();
	});
});

async function getProducts() {
	try {
		await $.ajax(
			`http://localhost:8080/Assignment/products?categoryId=${params.get(
				"categoryId"
			)}`,
			{
				success: (data) => {
					products = data.payload;
				},
				error: (err) => {
					console.log(err);
				},
			}
		);
	} catch (error) {}
}

function showProducts() {
	filterProducts();
	let html = "";
	$(".result-num").text(filteredProducts.length);
	filteredProducts.forEach((product) => {
		html += `
            <div class="grid__column-2-5 m-4">
                <div class="product-list-item">
                    <div class="product-list-item__img" style="background-image: url(${
						product.images.length
							? product.images[0].image
							: "../img/1.png"
					});"></div>
                    <div class="product-list-item__overlay">
                        <div class="overlay-content">
                            <div class="overlay-favor">
                                <a href="">
                                    <i class="overlay-favor-icon fa-regular fa-heart"></i>
                                </a>
                            </div>

                            <div class="overlay-add" onclick="addCart(${
								product.id
							}, 1)">
                                <a>
                                    <i class="overlay-add-icon fa-solid fa-cart-shopping"></i>
                                </a>
                            </div>

                            <div class="overlay-detail">
                                <a href="../Detail/index.html?id=${product.id}">
                                    <i class="overlay-detail-icon fa-solid fa-info"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="product-list-item__name" onclick="(()=>{
						location.href='../Detail/index.html?id=${product.id}';
					})()">
                        ${product.name}
                    </div>
                    <div class="product-list-item__price">
                        ${numberWithSeparator(product.unitPrice, ",")} VNĐ
                    </div>
                </div>
            </div>
        `;
	});
	$(".product-list .grid__row").html(html);
}

function showClassifyCategories() {
	$(".classify-list").html("");
	categories.forEach((category) => {
		$(".classify-list").append(`
            <li class="classify-item" onclick="changeQueryCategory(${
				category.id
			})">
                <label class="classify-item-icon">
                    <input
                        type="radio"
                        ${
							category.id == params.get("categoryId")
								? "checked"
								: ""
						}
                        name="classify"
                    />
                    <span
                        class="checkmark-classify"
                    ></span>
                    <div class="classify-item-text">
                        ${category.name}
                    </div>
                </label>
            </li>
        `);
		if (category.id == params.get("categoryId"))
			$("#criteria-category .criteria-item-text").text(category.name);
	});
}

function changeQueryCategory(categoryId) {
	params.set("categoryId", categoryId);
	location.search = params.toString();
}

function filterProducts() {
	filteredProducts = products.filter(
		(product) => filterCate(product) && filterPrice(product)
	);
}
