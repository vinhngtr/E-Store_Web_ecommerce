const search = document.getElementById("btn-search");
const inputSearch = document.getElementById("search");
const Products = document.querySelector(".showProduct");
const forBack = document.querySelector(".searchWith");

//! truy xuất toàn bộ sản phẩm và tên sản phẩm từ #ITEM LẤY TỪ BACKEND
const nameProducts = document.querySelectorAll(".name-item");
const listItem = document.querySelectorAll("#item");

// ! Display các lỗi hay kết quả search
const error1 = document.querySelector(".Error1");
const error2 = document.querySelector(".Error2");
const TextResult = document.querySelector(".resultSearch");

// ? Feature1: tìm kiếm sản phẩm
function displayError1() {
  Products.style.display = "none";
  error1.style.display = "block";
  error2.style.display = "none";
  TextResult.innerHTML = "0 kết quả tìm được";
  forBack.innerHTML = `<a href="./index.html">Quay lại cửa hàng</a>`;
}
function displayError2() {
  Products.style.display = "none";
  error1.style.display = "none";
  error2.style.display = "block";
  TextResult.innerHTML = "0 kết quả tìm được";
  forBack.innerHTML = `<a href="./index.html">Quay lại cửa hàng</a>`;
}
function displayResult(arr) {
  error1.style.display = "none";
  error2.style.display = "none";
  Products.style.display = "grid";
  let numberProduct = arr.length;
  TextResult.innerHTML = numberProduct + " kết quả tìm được";
  forBack.innerHTML = `<a href="./index.html">Quay lại cửa hàng</a>`;
  for (let i = 0; i < listItem.length; i++) {
    listItem[i].style.display = "none";
  }
  for (let i = 0; i < arr.length; i++) {
    arr[i].style.display = "block";
  }
}

search.addEventListener("click", function () {
  let valueSearch = document.getElementById("search").value.toLowerCase();
  let resultSearch = [];
  // console.log(valueSearch.length);
  if (!valueSearch) {
    // console.log("Không được để trống ô tìm kiếm!");
    displayError1();
  } else {
    for (let i = 0; i < nameProducts.length; i++) {
      let nameProduct = nameProducts[i].innerHTML.toLowerCase();
      let arrNameProduct = nameProduct.split(" ");
      if (arrNameProduct.includes(valueSearch)) {
        resultSearch.push(nameProducts[i].parentElement);
      }
    }
    if (resultSearch.length === 0) {
      // console.log("Không tìm thấy sản phẩm này");
      displayError2();
    } else {
      //   console.log(resultSearch);
      displayResult(resultSearch);
    }
  }
});

// ! THÊM EVENT: KEYUP VỚI ENTER CHO INPUT searchProduct:
inputSearch.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    let valueSearch = document.getElementById("search").value.toLowerCase();
    let resultSearch = [];
    // console.log(valueSearch.length);
    if (!valueSearch) {
      // console.log("Không được để trống ô tìm kiếm!");
      displayError1();
    } else {
      for (let i = 0; i < nameProducts.length; i++) {
        let nameProduct = nameProducts[i].innerHTML.toLowerCase();
        let arrNameProduct = nameProduct.split(" ");
        if (arrNameProduct.includes(valueSearch)) {
          resultSearch.push(nameProducts[i].parentElement);
        }
      }
      if (resultSearch.length === 0) {
        // console.log("Không tìm thấy sản phẩm này");
        displayError2();
      } else {
        //   console.log(resultSearch);
        displayResult(resultSearch);
      }
    }
  }
});

//! LỌC VỚI CHECKBOX
const containerCheckbox = document.querySelector(".listCategory");
const listCheckbox = containerCheckbox.querySelectorAll(
  'input[type="checkbox"]'
);
console.log(listCheckbox);

// ! add event to container for checkbox:
containerCheckbox.addEventListener("change", function (e) {
  // ! lấy danh sách các checkbox được chọn
  let checkedBoxes = containerCheckbox.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  // !  lấy danh sách giá trị các checkboxKed ở trên
  let valChecked = Array.from(checkedBoxes).map((checkbox) => {
    return checkbox.value;
  });

  let numberProduct = 0;
  // Validate với danh sách sản phẩm
  if (valChecked.length === 0) {
    for (let i = 0; i < listItem.length; i++) {
      listItem[i].style.display = "block";
    }
    TextResult.innerHTML = "";
    forBack.innerHTML = "";
  } else {
    let numberProduct = 0;
    //   console.log(valChecked);
    for (let i = 0; i < listItem.length; i++) {
      // listItem[i].style.display = "none";
      if (valChecked.includes(listItem[i].dataset.category)) {
        listItem[i].style.display = "block";
        numberProduct++;
      } else {
        listItem[i].style.display = "none";
      }
    }
    TextResult.innerHTML = numberProduct + " kết quả với phân loại này";
    forBack.innerHTML = `<a href="./index.html">Quay lại cửa hàng</a>`;
  }
});
