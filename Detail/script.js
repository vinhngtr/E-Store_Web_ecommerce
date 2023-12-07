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
  item.addEventListener("change", function(e){
    //   console.log(item.style.backgroundColor)
    //   console.log(e.target.value);
      let setColor = e.target.value
    if (e.target.checked) {
      e.target.setAttribute("accent-color", "yellow");
    } else {
      e.target.setAttribute("accent-color", "unset");
    }
  });
});
