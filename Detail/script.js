// ! CLICK IMG IN IMG-MAIN
const imgMain = document.querySelector("#itemMain");
// console.log(imgMain.getAttribute("src"))
const sliderImg = document.querySelectorAll(".itemImg");
sliderImg.forEach((item) => {
  item.addEventListener("click", function (e) {
    // console.log(e.target)
    let srcItem = e.target.getAttribute("src");
    console.log(srcItem);
    if (imgMain.getAttribute("src") != srcItem) {
      imgMain.setAttribute("src", srcItem);
    }
  });
});

const radio = document.querySelectorAll("#pickColor");
// console.log(radio)
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
