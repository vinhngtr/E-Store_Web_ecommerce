const productId = new URLSearchParams(location.search).get("id");
let reviews = [];

function imageSlider() {
	// ! CLICK IMG IN IMG-MAIN
	const imgMain = document.querySelector("#itemMain");
	// console.log(imgMain.getAttribute("src"))
	const sliderImg = document.querySelectorAll(".itemImg");
	sliderImg.forEach((item) => {
		item.addEventListener("click", function (e) {
			// console.log(e.target)
			let srcItem = e.target.getAttribute("src");
			// console.log(srcItem);
			if (imgMain.getAttribute("src") != srcItem) {
				imgMain.setAttribute("src", srcItem);
			}
		});
	});
}

const radio = document.querySelectorAll(".pickColor");
// console.log(radio);
radio.forEach((item) => {
	item.addEventListener("change", function (e) {
		//   console.log(item.style.backgroundColor)
		//   console.log(e.target.value);
		let setColor = e.target.value;
		if (e.target.checked) {
			e.target.setAttribute("accent-color", "yellow");
		} else {
			e.target.setAttribute("accent-color", "unset");
		}
	});
});

// ! TAB SITE IN DESC AND REVIEW
document.addEventListener("DOMContentLoaded", function () {
	const listMenu = document.querySelectorAll(".btn-dir");
	const listContent = document.querySelectorAll(".itemDesc");

	listMenu.forEach((item) => {
		item.addEventListener("click", function () {
			resetBTN();
			// co<nav></nav>
			console.log(item.value);
			item.classList.toggle("checked");
			showContent(Number(item.value));
		});
	});
	function resetBTN() {
		listMenu.forEach((item) => {
			item.classList.remove("checked");
			item.classList.remove("default");
		});
		listContent.forEach((item) => {
			item.style.display = "none";
		});
	}
	function showContent(value) {
		if (value === 0) {
			listContent[value].style.display = "grid";
		} else if (value === 1) {
			listContent[value].style.display = "block";
		} else if (value === 2) {
			listContent[value].style.display = "flex";
		}
	}
});

// ! INPUT START TO FORM COMMENT:
document.addEventListener("DOMContentLoaded", function () {
	var stars = document.querySelectorAll(".star");
	var ratingContainer = document.getElementById("ratingContainer");
	var ratingStars = document.getElementById("ratingStars");
	var selectedRating = document.getElementById("selectedRating");

	stars.forEach(function (star) {
		star.addEventListener("click", function () {
			resetStar();
			var ratingValue = star.dataset.value;
			selectedRating.textContent = "Selected rating: " + ratingValue;
			selectedRating.dataset.result = ratingValue;
			highlightStars(ratingValue);
		});
	});
	function resetStar() {
		stars.forEach((item) => {
			item.classList.remove("selected");
		});
	}
	function highlightStars(value) {
		stars.forEach(function (star) {
			if (star.dataset.value <= value) {
				star.classList.add("selected");
			}
		});
	}

	function clearHighlights() {
		stars.forEach(function (star) {
			star.classList.remove("selected");
		});
	}
});
let product = {};

$(document).ready(async function () {
	try {
		product = await $.ajax({
			url: `http://localhost:8080/backend/products?id=${productId}`,
		});
		product = product.payload[0];
	} catch (error) {}
	console.log(product);

	reviews = await getReviews(0, productId);

	console.log(reviews);

	showProduct();
	showReviews();
	imageSlider();
});

function showProduct() {
	$(".nameProduct").text(product.name);
	$("#inStock").text(product.quantity ? "Còn hàng" : "Hết hàng");
	$("#categoryProd").text(product.categoryId + " temp");
	$("#finalPrice").text(
		numberWithSeparator(product.unitPrice * (1 - product.discount), ",") +
			" VND"
	);
	$("#initPrice").text(numberWithSeparator(product.unitPrice, ",") + " VND");
	$("#valDisc").text(product.discount * 100 + "% OFF");
	if (!parseFloat(product.discount)) {
		$("#initPrice").css("display", "none");
		$("#valDisc").css("display", "none");
	}
	$(".listImg").html("");

	$(".imgMain img").attr("src", product.images[0].image);

	product.images.forEach((img) => {
		// console.log(img.image);
		$(".listImg").append(
			$(`
				<button class="itemImg btn-img">
					<img style="width: 100%;height: 100%;object-fit: cover;" class="imgSlider" src="${img.image}" alt="" />
				</button>
			`)
		);
	});

	$(".listColor").html("");
	const colors = [
		...new Set(
			product.colorSizes.map((obj) => `${obj.color}$${obj.colorName}`)
		),
	];
	colors.forEach((color) => {
		color = color.split("$");
		$(".listColor").append(
			$(`
				<div class="colorSelect">
					<input type="radio" value="${color[1]}" name="color" class="pickColor" id="pick${color[1]}">
					<label for="pick${color[1]}">${color[1]}</label>
				</div>
			`)
		);
	});

	$("#pickSize").html("");
	const sizes = [...new Set(product.colorSizes.map((obj) => obj.size))];
	sizes.forEach((size) => {
		$("#pickSize").append($(`<option value="${size}">${size}</option>`));
	});

	$("#rating").text(product.rating);
	$("#user-cmt").text(`(${product.numberOfRatings} đánh giá từ người dùng)`);
}

function showReviews() {
	$(".showCmt").html($("<h3>Phản hồi của người dùng</h3>"));
	reviews.forEach((review) => {
		$(".showCmt").append(
			$(`
			<div class="itemCmt">
				<div class="product-rating" id="productRating">
					<span class="valStar" data-rating="1">&#9733;</span>
					<span class="valStar" data-rating="2">&#9733;</span>
					<span class="valStar" data-rating="3">&#9733;</span>
					<span class="valStar" data-rating="4">&#9733;</span>
					<span class="valStar" data-rating="5">&#9733;</span>
				</div>
				<div id="titleCmt">
					<span id="showName">${review.user[0].fullName}</span>
					<span id="showTime">6h50, 23/5/2023</span>
				</div>
				<div id="showContent">
					${review.content}
				</div>
			</div>
			`)
		);
	});
}

$(".btn-cart").click(async function () {
	// await addCart(1, productId, 1);
	await getCart(1);
});
