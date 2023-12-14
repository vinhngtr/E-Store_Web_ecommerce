let templateCategories = [];

$(document).ready(async () => {
	templateCategories = await getCategories();
	console.log(templateCategories);
	showNavbar();
	showFooter();
	// console.log(temp);
	// await test();
});

async function test() {
	try {
		await $.ajax("http://localhost:8080/backend/categories", {
			success: (data) => {
				console.log(data);
			},
			error: (err) => {
				console.log(err);
			},
		});
	} catch (error) {}
}

function getTopNav() {
	return `
    <div class="top-navi">
        <div class="top-left">
            Chào mừng bạn đến với E-Store - cửa hàng linh kiện đi kèm máy tính
        </div>
        <div class="top-right">
            Follow us:
            <span>
                <a href="https://www.facebook.com/vinh.nguyentrong.1291" style="color: white">
                    <i class="fa-brands fa-facebook"></i>
                </a>
                <a href="#" style="color: white">
                    <i class="fa-brands fa-instagram"></i>
                </a>
                <a href="https://www.youtube.com/" style="color: white">
                    <i class="fa-brands fa-youtube"></i>
                </a>
            </span>
        </div>
    </div>`;
}

function getMidNav() {
	let token = Cookies.get("token");
	return `
    <div class="midd-navi">
        <div class="logo">
            <a href="${
				location.href.indexOf("client/index.html") > -1 ? "" : "."
			}./index.html" style="color: white; text-decoration: none">
                <span style="font-size: 50px; font-weight: bold; padding-right: 3px;">E</span>
                <span style=" font-size: 40px; font-weight: bold; padding-right: 3px;">-</span>
                <span style="font-size: 32px; font-weight: bold">STORE</span>
            </a>
        </div>
        <div class="search">
            <input type="text" id="searchInput" placeholder="Tìm kiếm sản phẩm..."/>
            <button id="btn-search">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
        <div class="info-user" style=" display: grid; grid-template-columns: auto auto auto; column-gap: 24px;">
            <a href="${
				location.href.indexOf("client/index.html") > -1 ? "" : "."
			}./Cart/index.html" style="width: 32px; height: 32px; display: inline-block;" title="Giỏ hàng">
                <i class="fa-solid fa-cart-shopping"></i>
            </a>
            <a href="#" style="width: 32px; height: 32px; display: inline-block;" title="Sản phẩm yêu thích">
                <i class="fa-regular fa-heart"></i>
            </a>
            <a
                href="${
					location.href.indexOf("client/index.html") > -1 ? "" : "."
				}./Register/index.html"
                style="
                    width: 32px;
                    height: 32px;
                    display: inline-block;
                "
                title="${token ? "Đăng xuất" : "Đăng nhập/Đăng kí"}"
            >
                <i class="fa-regular fa-user"></i>
            </a>
        </div>
    </div>`;
}

function getBotNav() {
	return `
    <div class="bottom-navi mx-5 py-4">
        <div class="left-side" style="font-size: 18px">
            <div class="category" style="margin-right: 24px">
                <button style="display: inline-block; padding: 14px 24px; font-family: 'Public Sans', sans-serif; font-size: 18px;">
                    Danh mục sản phẩm
                    <i class="fa-solid fa-caret-down" style="padding-left: 3px"></i>
                </button>
                <ul class="list-btnCate">
                    ${templateCategories
						.map((category) => {
							return `
                            <li>
                                <a href="${
									location.href.indexOf("client/index.html") >
									-1
										? ""
										: "."
								}./Classify/index.html?categoryId=${
								category.id
							}">${category.name}</a>
                            </li>`;
						})
						.join("")}
                </ul>
            </div>
            <div class="home" style="margin-right: 24px">
                <a href="${
					location.href.indexOf("client/index.html") > -1 ? "" : "."
				}./index.html" style="text-decoration: none">
                    <i class="fa-solid fa-house" style="padding-right: 5px"></i>
                    <span>Trang chủ</span>
                </a>
            </div>
            <div class="blogger" style="margin-right: 24px">
                <a href="${
					location.href.indexOf("client/index.html") > -1 ? "" : "."
				}./Error/error.html" style="text-decoration: none">
                    <i class="fa-brands fa-blogger" style="padding-right: 5px"></i>
                    <span>Blog</span>
                </a>
            </div>
            <div class="about" style="margin-right: 24px">
                <a href="${
					location.href.indexOf("client/index.html") > -1 ? "" : "."
				}./About/index.html" style="text-decoration: none">
                    <i class="fa-solid fa-circle-info" style="padding-right: 5px"></i>
                    <span>Giới thiệu</span>
                </a>
            </div>
            <div class="contact">
                <a href="${
					location.href.indexOf("client/index.html") > -1 ? "" : "."
				}./FAQ/index.html" style="text-decoration: none">
                    <i class="fa-solid fa-address-card" style="padding-right: 5px"></i>
                    <span>Liên hệ</span>
                </a>
            </div>
        </div>
        <div class="right-side" style="font-size: 18px">
            <a href="#" style="text-decoration: none" title="Hotline">
                <i class="fa-solid fa-phone" style="padding-right: 3px"></i>
                +84 - 969379924
            </a>
        </div>
    </div>

`;
}

function showNavbar() {
	let token = Cookies.get("token");
	$(".navigation").html(`
    <div id="navBar">
        ${getTopNav()}
        ${getMidNav()}
    </div>
    ${getBotNav()}
    <div class="hr1" style="width: 100vw; background-color: #e4e7e9; height: 1px"></div>
`);
}

function showFooter() {
	$(".footer").html(`
    <div class="top-footer">
        <div class="info-shop">
            <div class="name-shop">
                <a href="${
					location.href.indexOf("client/index.html") > -1 ? "" : "."
				}./index.html" style="color: white; text-decoration: none">
                    <span style="font-size: 50px; font-weight: bold; padding-right: 3px;">E</span>
                    <span style="font-size: 40px; font-weight: bold; padding-right: 3px;">-</span>
                    <span style="font-size: 32px; font-weight: bold">STORE</span>
                </a>
            </div>
            <div class="detailInfoShop">
                <div class="hotline">
                    <span style="display: inline-block; color: #77878f; font-size: 16px; margin-bottom: 5px;">Hotline hỗ trợ trực tuyến:</span>
                    <p style="color: #fff; font-size: 18px">(84) 0969379924</p>
                </div>
                <div class="address">
                    <span style="color: #adb7bc; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px;">
                        ĐH BK HCM, TP. Thủ Đức, Hồ Chí Minh
                    </span>
                </div>
                <div class="gmail">
                    <a style="color: #fff; font-style: normal; font-weight: 500; line-height: 24px;" href="mailto:vinhtrong782002@gmail.com">
                        vinhtrong782002@gmail.com
                    </a>
                </div>
            </div>
        </div>

        <div class="cate-shop">
            <div class="title-cate">
                <h2 style="font-size: 23px; font-style: normal; font-weight: 500; line-height: 24px; text-transform: uppercase; color: #fff;">
                    TOP SẢN PHẨM
                </h2>
            </div>
            <div class="body-cate" style=" display: grid; grid-template-rows: 1fr 1fr 1fr 1fr 1fr;">
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Màn hình PC</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Tai nghe</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Chuột</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Bàn phím</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a style="color: #ebc80c" href="#">
                        Xem tất cả sản phẩm
                        <i class="fa-solid fa-arrow-right" style="padding-left: 5px" ></i>
                    </a>
                </p>
            </div>
        </div>

        <div class="menu-shop">
            <div class="title-menu">
                <h2 style="font-size: 23px; font-style: normal; font-weight: 500; line-height: 24px; text-transform: uppercase; color: #fff;">
                    Menu
                </h2>
            </div>
            <div class="body-menu" style="display: grid; grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;">
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Trang chủ</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Tất cả sản phẩm</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Tài khoản của bạn</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Đơn hàng của bạn</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Bảng tin</a>
                </p>
                <p style="padding: 8px 0" class="itemOfFooter">
                    <a href="#">Về chúng tôi</a>
                </p>
            </div>
        </div>

        <div class="research-shop">
            <div class="title-research">
                <h2 style="font-size: 23px; display: inline-block; font-style: normal; font-weight: 500; line-height: 24px; text-transform: uppercase; color: #fff;">
                    Tìm kiếm phổ biến
                </h2>
            </div>
            <div class="body-research" style=" display: flex; width: 270px; flex-wrap: wrap; gap: 8px;">
                <a href="#"><span>Headphone</span></a>
                <a href="#"><span>Chuột</span></a>
                <a href="#"><span>Asus</span></a>
                <a href="#"><span>Bàn phím</span></a>
                <a href="#"><span>SSD</span></a>
                <a href="#"><span>Graphics card</span></a>
                <a href="#"><span>RAM</span></a>
                <a href="#"><span>ROM</span></a>
                <a href="#"><span>Màn hình PC</span></a>
            </div>
        </div>
    </div>
    <div class="coppyright">
        <p style="color: white; text-align: center">E-STORE &#169; 2023. Design by GROUP-WEB-HCMUT</p>
    </div>
    `);
}
