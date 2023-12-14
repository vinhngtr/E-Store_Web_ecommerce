// !tạo định dạng tiền đúng chuẩn sau mỗi lần change SL:
function formatPriceWithDot(price) {
	let n = price.toLocaleString("en-US");
	let result = n.replace(/\,/g, ".");
	return result;
}
//! xóa cart
var remove_cart = document.getElementsByClassName("btn-danger");
for (var i = 0; i < remove_cart.length; i++) {
	var button = remove_cart[i];
	button.addEventListener("click", function (e) {
		var button_remove = e.target;
		button_remove.parentElement.parentElement.remove();
		updateBodyCart();
	});
}

//! thay đổi giá tiền khi thay đổi số lượng sản phẩm
const numbers = document.querySelectorAll(".cart-quantity-input");
// console.log(numbers);
numbers.forEach((number) => {
	const costStr = number.parentElement.previousElementSibling.innerHTML;
	number.addEventListener("change", function (e) {
		let count = parseInt(number.value);
		if (count <= 0) {
			count = 0;
			e.target.value = 0;
		}
		let cost = parseFloat(costStr.replace(/\./g, ""));
		cost *= count;
		number.parentElement.previousElementSibling.innerHTML =
			formatPriceWithDot(cost) + "đ";
	});
});

// ! CẬP NHẬT CÁC PHÍ CẦN THANH TOÁN VÀ BILL CUỐI CÙNG
const btnUpdate = document.querySelector(".btn-upcost");
const cartTotal = document.querySelector(".cart-total-price");

//! update bill khi thay đổi số lượng sản phẩm
btnUpdate.addEventListener("click", function () {
	// const listPrice = document.querySelectorAll(".cart-price");
	const Prices = $(".cart-items .cart-price");

	let totalCost = 0;
	$.each(Prices, (index, item) => {
		updateCart(
			$(".cart-quantity-input")[index].dataset.color,
			$(".cart-quantity-input")[index].dataset.size,
			$(".cart-quantity-input")[index].dataset.id,
			$(".cart-quantity-input")[index].value
		);
		let price =
			parseInt(item.innerHTML.replace(/[^0-9]/g, "")) *
			$(".cart-quantity-input")[index].value;
		totalCost += price;
	});
	console.log(totalCost);

	cartTotal.innerHTML = formatPriceWithDot(totalCost) + "đ";
	updateTotalPay();
});

function updateBodyCart() {
	const EmtyCart = document.querySelector(".noresult");
	const updateCart = document.querySelectorAll(".cart-items .cart-price");

	if (updateCart.length === 0) {
		EmtyCart.style.display = "block";
	}
}

// tính tổng thanh toán
const totalPay = document.querySelector(".total-pay");
const inpShip = document.querySelector("#title-ship");
const inpDis = document.querySelector("#title-dis");

function updateTotalPay() {
	const valShip = inpShip.value ? parseFloat(inpShip.value) : 0;
	const valDis = inpDis.value
		? parseFloat(
				(parseFloat(inpDis.value) / 100) *
					parseInt(cartTotal.innerHTML.replace(/\./g, ""))
		  )
		: 0;
	totalPay.innerHTML =
		formatPriceWithDot(
			parseFloat(cartTotal.innerHTML.replace(/\./g, "")) +
				valShip -
				valDis
		) + "đ";
}

inpDis.addEventListener("keyup", function (e) {
	if (e.key === "Enter") {
		updateTotalPay();
	}
});
inpShip.addEventListener("keyup", function (e) {
	if (e.key === "Enter") {
		updateTotalPay();
	}
});

let carts = [];

$(document).ready(async function () {
	if (!Cookies.get("userId")) Cookies.set("userId", 1);
	carts = await getCart();
	await showCart();
	// console.log(carts);

	$(".btn-pay").click(order);
});

async function showCart() {
	$(".cart-items").html(
		`<div class="noresult">Không tìm thấy sản phẩm nào !</div>`
	);
	if (!carts.length) {
		$(".noresult").css("display", "block");
		return;
	}
	carts.forEach(async (item) => {
		const product = await getProductById(item.productId);
		const color = product.colorSizes.filter(
			(element) => element.color == item.color
		)[0].colorName;
		console.log(product, color);
		$(".cart-items").append(
			$(`
			<div class="cart-row">
				<div class="cart-item cart-column">
					<img class="cart-item-image" src="${
						product.images[0].image
					}" width="100" height="100">
					<div class="cart-info">
						<span class="cart-item-title">${product.name}</span>
						<span class="cart-item-color">${color}</span>
						<span class="cart-item-size">${item.size}</span>
					</div>
				</div>
				<span class="cart-price cart-column">${numberWithSeparator(
					product.unitPrice,
					","
				)} VND</span>
				<div class="cart-quantity cart-column">
					<input
						class="cart-quantity-input"
						type="number"
						min="1"
						value="${item.quantity}"
						data-id="${item.productId}"
						data-color="${item.color}"
						data-size="${item.size}"
					>
					<button class="btn btn-danger" type="button">Xóa</button>
				</div>
			</div>
			`)
		);
	});
}
// productId, quantity, discount, price
async function order() {
	let rows = $(".cart-items .cart-row");
	if (!rows.length) return;

	let products = [];
	$.each(rows, (index, product) => {
		let color = $(product).children().eq(2).children().eq(0).data("color");
		let size = $(product).children().eq(2).children().eq(0).data("size");
		let productId = $(product).children().eq(2).children().eq(0).data("id");
		let quantity = $(product).children().eq(2).children().eq(0).val();
		products.push({ color, size, productId, quantity });
	});
	let res = await addOrder(products);
	location.reload();
}

async function updateCart(color, size, productId, quantity) {
	let token = Cookies.get("token");

	if (!token) location.href = "../Signin/index.html";

	try {
		let temp = await $.ajax("http://localhost:8080/backend/carts", {
			method: "PUT",
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
