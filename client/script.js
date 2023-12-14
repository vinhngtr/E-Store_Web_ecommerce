
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
		photo:
			'url("https://thuthuatnhanh.com/wp-content/uploads/2018/07/anh-dai-dien-dep-652x580.jpg")',
		name: "Nguyễn Trọng Vinh",
		profession: "Người mua",
		description:
			"Mua trúng đợt shop ưu đãi giảm giá, vải chất lượng đã vậy còn được giảm giá nữa chứ, thích quá thích"
	},

	{
		photo:
			"url('https://cdn.pixabay.com/photo/2019/02/11/20/20/woman-3990680_960_720.jpg')",
		name: "Lê Văn Minh",
		profession: "Giám đốc kinh doanh",
		description:
			"Dịch vụ chăm sóc khách hàng ở shop này rất tốt luôn mọi người ạ, sản phẩm lại còn ổn áp nữa chứ"
	},

	{
		photo:
			"url('https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_960_720.jpg')",
		name: "Branson Cook",
		profession: "Diễn viên",
		description:
			"Mình là người khá kỹ tính trong việc mua hàng, mà shop này lại làm mình vui vẻ khi mua hàng thì là một thành công lớn của shop này rồi đấy"
	},

	{
		photo:
			"url('https://cdn.pixabay.com/photo/2014/10/30/17/32/boy-509488_960_720.jpg')",
		name: "Julius Grohn",
		profession: "Giáo viên",
		description:
			"Lần đầu tiên mua hàng online nên là hơi lo lo, cứ sợ bị lừa. Nhưng đỡ cái là shop này hỗ trợ cho mình rất tận tình luôn nên cũng yên tâm được phần nào"
	}
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
		translateX: `${side1symbol + reviewWrapWidth}`
	});

	tl.to(reviewWrap, {
		duration: 0,
		translateX: `${side2symbol + reviewWrapWidth}`
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
		translateX: 0
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

const listProduct = document.querySelectorAll('.name-item');
const btnSearch = document.querySelector('#btn-search');
btnSearch.addEventListener('click', function () {
	let valSearch = document.getElementById('searchInput');
	
})
for (let i = 0; i < listProduct.length; i++){
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