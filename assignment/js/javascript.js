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