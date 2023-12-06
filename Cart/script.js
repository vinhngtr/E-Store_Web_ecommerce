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
const listPrice = document.querySelectorAll(".cart-price");
let initCost = 0;
listPrice.forEach((item) => {
  if (parseInt(item.innerHTML)) {
    initCost += parseFloat(item.innerHTML.replace(/\./g, ""));
  }
});
cartTotal.innerHTML = formatPriceWithDot(initCost) + "đ";

//! update bill khi thay đổi số lượng sản phẩm
btnUpdate.addEventListener("click", function () {
  // const listPrice = document.querySelectorAll(".cart-price");
  const Prices = document.querySelectorAll(".cart-price");
  let totalCost = 0;
  Prices.forEach((item) => {
    if (parseInt(item.innerHTML)) {
      totalCost += parseFloat(item.innerHTML.replace(/\./g, ""));
    }
  });

  cartTotal.innerHTML = formatPriceWithDot(totalCost) + "đ";
  updateTotalPay();
});

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
      parseFloat(cartTotal.innerHTML.replace(/\./g, "")) + valShip - valDis
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

//! UPDATE content cho khung gio hang khi xoa het san pham:
// remove_cart.forEach((item) => {
//   item.addEventListener("click", updateBodyCart());
// });
function updateBodyCart() {
  const EmtyCart = document.querySelector(".noresult");
  const updateCart = document.querySelectorAll(".cart-price");

  let checkSL = 0;
  for (let i = 0; i < updateCart.length; i++) {
    if (parseInt(updateCart[i].innerHTML)) {
      checkSL++;
      console.log(checkSL);
    }
  }
  if (checkSL === 0) {
    EmtyCart.style.display = "block";
  }
}
