$(document).ready(async function () {
	await showSidebar();
	showNavbar();
	showFooter();
});

async function showSidebar() {
	let categories = await getCategories();
	console.log(categories);
	$("#sidebar").html(`

    <div class="row m-0 p-0 mb-4">
        <a href="./dashboard.html" class="text-center">
            <img
                src="../img/store-svgrepo-com.svg"
                width="70"
                height="70"
                style="width: 100"
            />
        </a>
    </div>

    <button
        class="btn btn-light d-flex w-100 m-0 my-3 align-items-center"
        onclick="(()=>{location.href='./dashboard.html'})()"
    >
        <div class="col-2 p-0">
            <img
                src="../img/dashboard-1-svgrepo-com.svg"
                width="20"
                height="30"
            />
        </div>
        <div class="col-10 p-0 text-center">TRANG CHỦ</div>
    </button>

    <button
        class="btn btn-light d-flex w-100 m-0 my-3 align-items-center"
        onclick="(()=>{location.href='./all_products.html'})()"
    >
        <div class="col-2 p-0">
            <img
                src="../img/product-svgrepo-com.svg"
                width="20"
                height="30"
            />
        </div>
        <div class="col-10 p-0 text-center">TẤT CẢ SẢN PHẨM</div>
    </button>

    <button
        class="btn btn-light d-flex w-100 m-0 my-3 align-items-center"
        onclick="(()=>{location.href='./order_list.html'})()"
    >
        <div class="col-2 p-0">
            <img
                src="../img/order-svgrepo-com.svg"
                width="20"
                height="30"
            />
        </div>
        <div class="col-10 p-0 text-center">DANH SÁCH ĐƠN HÀNG</div>
    </button>

    <div class="row m-0 p-0">
        <button class="btn btn-light w-100" onclick="(()=>{$('#sidebar-category').toggleClass('d-none')})()">Phân loại</button>
        <div class="m-0 p-0 d-none" id="sidebar-category">
            ${categories
				.map((category) => {
					return `<button class="btn btn-light w-100 text-start">${category.name}</button>`;
				})
				.join("")}
        </div>
        
    </div>
    `);

	$("#sidebar").addClass(
		"col-2 px-4 pt-3 border-end border-1 border-dark sticky-top vh-100"
	);
}

function showNavbar() {
	$("#navbar").html(`
    <div class="col-1">
        <button class="btn btn-outline-light">
            <img
                src="../img/search-alt-2-svgrepo-com.svg"
                alt="Logo"
                width="30"
                height="30"
            />
        </button>
    </div>
    <div class="col-1">
        <button class="btn btn-outline-light">
            <img
                src="../img/notification-11-svgrepo-com.svg"
                alt="Logo"
                width="30"
                height="30"
            />
        </button>
    </div>
    <div class="col-2">
        <button class="btn btn-outline-secondary" onclick="logout()">
            Quản trị viên
        </button>
    </div>
    `);
	$("#navbar").addClass(
		"row justify-content-end bg-white pt-2 border-dark border-1 border-bottom m-0 p-0"
	);
}

function logout() {
	Cookies.remove("token");
	location.href = "./login.html";
}

function showFooter() {
	$("#footer").html(`
    <div class="d-flex justify-content-between pb-4 pt-3 px-4 border-top border-dark">
        <h6>2023 - Dashboard</h6>
        <div class="d-flex align-items-end">
            <h6 class="ms-3">Về chúng tôi</h6>
            <h6 class="ms-3">Hệ thống cửa hàng</h6>
            <h6 class="ms-3">Chính sách</h6>
            <h6 class="ms-3">Liên hệ</h6>
        </div>
    </div>
    `);

	$("#footer").addClass("px-4");
}
