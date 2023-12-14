// !START FUNCTION1--------------//
const reviewWrap = document.getElementById("reviewWrap");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const imgDiv = document.getElementById("imgDiv");
const personName = document.getElementById("personName");
const profession = document.getElementById("profession");
const description = document.getElementById("description");

let people = [
	{
		photo: 'url("https://thuthuatnhanh.com/wp-content/uploads/2018/07/anh-dai-dien-dep-652x580.jpg")',
		name: "Nguyễn Trọng Vinh",
		profession: "Người mua",
		description:
			"Mua trúng đợt shop ưu đãi giảm giá, vải chất lượng đã vậy còn được giảm giá nữa chứ, thích quá thích",
	},

	{
		photo: "url('https://cdn.pixabay.com/photo/2019/02/11/20/20/woman-3990680_960_720.jpg')",
		name: "Lê Văn Minh",
		profession: "Giám đốc kinh doanh",
		description:
			"Dịch vụ chăm sóc khách hàng ở shop này rất tốt luôn mọi người ạ, sản phẩm lại còn ổn áp nữa chứ",
	},

	{
		photo: "url('https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_960_720.jpg')",
		name: "Branson Cook",
		profession: "Diễn viên",
		description:
			"Mình là người khá kỹ tính trong việc mua hàng, mà shop này lại làm mình vui vẻ khi mua hàng thì là một thành công lớn của shop này rồi đấy",
	},

	{
		photo: "url('https://cdn.pixabay.com/photo/2014/10/30/17/32/boy-509488_960_720.jpg')",
		name: "Julius Grohn",
		profession: "Giáo viên",
		description:
			"Lần đầu tiên mua hàng online nên là hơi lo lo, cứ sợ bị lừa. Nhưng đỡ cái là shop này hỗ trợ cho mình rất tận tình luôn nên cũng yên tâm được phần nào",
	},
];

imgDiv.style.backgroundImage = people[0].photo;
personName.innerText = people[0].name;
profession.innerText = people[0].profession;
description.innerText = people[0].description;
let currentPerson = 0;

//Select the side where you want to slide
function slide(whichSide, personNumber) {
	let reviewWrapWidth = reviewWrap.offsetWidth + "px";
	let descriptionHeight = description.offsetHeight + "px";
	//(+ or -)
	let side1symbol = whichSide === "left" ? "" : "-";
	let side2symbol = whichSide === "left" ? "-" : "";
	let tl = gsap.timeline();
	tl.to(reviewWrap, {
		duration: 0.4,
		opacity: 0,
		translateX: `${side1symbol + reviewWrapWidth}`,
	});

	tl.to(reviewWrap, {
		duration: 0,
		translateX: `${side2symbol + reviewWrapWidth}`,
	});

	setTimeout(() => {
		imgDiv.style.backgroundImage = people[personNumber].photo;
	}, 400);
	setTimeout(() => {
		description.style.height = descriptionHeight;
	}, 400);
	setTimeout(() => {
		personName.innerText = people[personNumber].name;
	}, 400);
	setTimeout(() => {
		profession.innerText = people[personNumber].profession;
	}, 400);
	setTimeout(() => {
		description.innerText = people[personNumber].description;
	}, 400);

	tl.to(reviewWrap, {
		duration: 0.4,
		opacity: 1,
		translateX: 0,
	});
}

function setNextCardLeft() {
	if (currentPerson === 3) {
		currentPerson = 0;
		slide("left", currentPerson);
	} else {
		currentPerson++;
	}

	slide("left", currentPerson);
}

function setNextCardRight() {
	if (currentPerson === 0) {
		currentPerson = 3;
		slide("right", currentPerson);
	} else {
		currentPerson--;
	}

	slide("right", currentPerson);
}

leftArrow.addEventListener("click", setNextCardLeft);
rightArrow.addEventListener("click", setNextCardRight);

window.addEventListener("resize", () => {
	description.style.height = "100%";
});

// !--------- END FUNCTION1-----------//

const listProduct = document.querySelectorAll(".name-item");
const btnSearch = document.querySelector("#btn-search");
btnSearch.addEventListener("click", function () {
	let valSearch = document.getElementById("searchInput");
});
for (let i = 0; i < listProduct.length; i++) {
	// console.log(listProduct[i].innerHTML);
}

// FETCH API SP VỀ FRONTEND
// fetch('getAPI.php')
// 	.then(res => res.json())
// 	.then(data => {
// 		generateListSP(data);
// 	})
// 	.catch(err => {
// 		console.log("Error")
// 	})

let products = [];
let filteredProducts = [];
let categories = [];

$(document).ready(async function () {
	products = await getProducts();
	filteredProducts = products.filter((product, index) => true);
	console.log(products);

	categories = await getCategories();
	console.log(categories);

	showPromotions();
	showProducts();
	showCategories();
});

function showPromotions() {
	$(`.col1 img`).attr("src", filteredProducts[0].images[0].image);
	$(`.col1 .title`).text(filteredProducts[0].name);
	$(`.col1 .price`)
		.children()
		.eq(0)
		.text(numberWithSeparator(filteredProducts[0].unitPrice, ",") + " VND");
	$(`.col1 .price`)
		.children()
		.eq(1)
		.text(
			numberWithSeparator(
				filteredProducts[0].unitPrice *
					(1 - filteredProducts[0].discount),
				","
			) + " VND"
		);
	$(`.col1 .detail`).text(filteredProducts[0].description);
	$(`.col1 .btn-view a`).attr(
		"href",
		`./Detail/index.html?id=${filteredProducts[0].id}`
	);

	$(`.col2`).html("");
	for (let i = 1; i < Math.min(9, filteredProducts.length); i++) {
		const product = filteredProducts[i];
		$(`.col2`).append(
			$(`
			<div class="item">
				<div class="image-item" style="width: 100%">
					<img src="${
						product.images[0].image
					}" style=" width: 100%; height: 100%; object-fit: cover;" alt="" />
					<div class="overlay">
						<div class="addFavou">
							<i class="fa-regular fa-heart"></i>
						</div>
						<div class="addCart">
							<i class="fa-solid fa-cart-shopping"></i>
						</div>
					</div>
				</div>
				<a href="./Detail/index.html?id=${
					product.id
				}" style="display: inline-block" class="name-item">
					${product.name}
				</a>
				<p class="price-item" style="align-self: flex-start">
					<span style=" color: #adb7bc; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; text-decoration-line: line-through; padding-right: 8px;">
						${numberWithSeparator(product.unitPrice, ",") + " VND"}
					</span>
					<span
						style=" color: #2da5f3; font-size: 16px; font-style: normal; font-weight: 600; line-height: 24px;">
						${numberWithSeparator(product.unitPrice * (1 - product.discount), ",") + " VND"}
					</span>
				</p>
			</div>
		`)
		);
	}
}

function showProducts() {
	$(`.listShow`).html("");
	for (let i = 0; i < Math.min(8, filteredProducts.length); i++) {
		const product = filteredProducts[i];
		$(`.listShow`).append(`
			<div class="item">
				<div class="image-item" style="width: 100%">
					<img src="${
						product.images[0].image
					}" style=" width: 100%; height: 100%; object-fit: cover;" alt="" />
					<div class="overlay">
						<div class="addFavou">
							<i class="fa-regular fa-heart"></i>
						</div>
						<div class="addCart">
							<i class="fa-solid fa-cart-shopping"></i>
						</div>
					</div>
				</div>
				<a href="./Detail/index.html?id=${
					product.id
				}" style="display: inline-block" class="name-item">${
			product.name
		}</a>
				<div class="price-item">${
					numberWithSeparator(product.unitPrice, ",") + " VND"
				}</div>
			</div>
	`);
	}
}

function showCategories() {
	$(".list-btnCate").html("");
	categories.forEach((category) => {
		$(".list-btnCate").append(
			$(
				`<li><a href="./Classify/index.html?categoryId=${category.id}">${category.name}</a></li>`
			)
		);
	});
}
