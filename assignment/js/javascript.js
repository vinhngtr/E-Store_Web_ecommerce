"use strict"

// Tabs

function openContent(evt, content) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("product__detail-tabs-content");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(content).style.display = "flex";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

function openPayment(evt, PaymentMethod) {
  var i, PaymentContent, paymentlinks;
  PaymentContent = document.getElementsByClassName("PaymentContent");
  for (i = 0; i < PaymentContent.length; i++) {
    PaymentContent[i].style.display = "none";
  }
  paymentlinks = document.getElementsByClassName("paymentlinks");
  for (i = 0; i < paymentlinks.length; i++) {
    paymentlinks[i].className = paymentlinks[i].className.replace(" active", "");
  }
  document.getElementById(PaymentMethod).style.display = "block";
  evt.currentTarget.className += " active";
}

// Color custom btn

const colorMenu = document.querySelector(".product__detail-custom-color-drop"),
      colorSelectBtn = colorMenu.querySelector(".color_select-btn"),
      ColorOptions = colorMenu.querySelectorAll(".product__detail_color_option"),
      ColorBtn_text = colorMenu.querySelector(".product__detail_custom_color_text");

colorSelectBtn.addEventListener("click", () => colorMenu.classList.toggle("active"));

ColorOptions.forEach(product__detail_color_option => {
  product__detail_color_option.addEventListener("click", () => {
    let ColorSelectedOption = product__detail_color_option.querySelector(".product__detail_color_options_text").innerText;
    console.log(ColorSelectedOption);
    ColorBtn_text.innerText = ColorSelectedOption;

    colorMenu.classList.remove("active");
  })
})

// Size custom btn

const optionMenu = document.querySelector(".product__detail-custom-size-drop"),
      selectBtn = optionMenu.querySelector(".size_select-btn"),
      options = optionMenu.querySelectorAll(".product__detail_size_option"),
      sBtn_text = optionMenu.querySelector(".product__detail_custom_size_text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(product__detail_size_option => {
  product__detail_size_option.addEventListener("click", () => {
    let SizeSelectedOption = product__detail_size_option.querySelector(".product__detail_size_options_text").innerText;
    console.log(SizeSelectedOption);
    sBtn_text.innerText = SizeSelectedOption;

    optionMenu.classList.remove("active");
  })
})
