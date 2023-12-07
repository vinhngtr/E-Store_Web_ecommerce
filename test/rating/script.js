document.addEventListener("DOMContentLoaded", function () {
  var stars = document.querySelectorAll(".star");
  var ratingContainer = document.getElementById("ratingContainer");
  var ratingStars = document.getElementById("ratingStars");
  var selectedRating = document.getElementById("rating");

  stars.forEach(function (star) {
    star.addEventListener("mouseover", function () {
      highlightStars(star.dataset.value);
    });

    star.addEventListener("mouseout", function () {
      clearHighlights();
    });

    star.addEventListener("click", function () {
      var ratingValue = star.dataset.value;
      selectedRating.dataset.value = ratingValue;
      ratingContainer.classList.add("rated");
      clearHighlights();
    });
  });

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
