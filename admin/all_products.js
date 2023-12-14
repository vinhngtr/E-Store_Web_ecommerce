let products = [];

$(document).ready(async function () {
	products = await getProducts();
	showProducts();
});

function showProducts() {
	products.forEach((product) => {
		$("#product-list").append(
			$(`
            <div class="col-4 px-2" onclick="(()=>{location.href='./product_detail.html?id=${
				product.id
			}'})()">
                <div class="card mb-3" style="height: 400px;">
                    <div class="card-body d-flex flex-column"
                    style="">
                        <div class="d-flex">
                            <img src="${
								product.image
							}" alt="Logo" class="ratio ratio-1x1 me-3" style="max-width:80px; max-height:80px;"/>
                            <div>
                                <h5 class="m-0" style="height:100px;">${
									product.name
								}</h5>
                                <h6 class="mb-2 text-secondary">${
									product.categoryName
								}</h6>
                                <h6 class="fw-bold">${numberWithSeparator(
									product.unitPrice,
									","
								)} VND</h6>
                            </div>
                        </div>
                        <h5>Summary</h5>
                        <p class="card-text" style="overflow: hidden; white-space: nowrap;text-overflow:ellipsis;">${
							product.description
						}</p>
                        <div class="d-flex flex-column rounded-3 border-2 border p-2 mt-auto">
                            <div class="d-flex justify-content-between">
                                <span>Đã bán</span>
                                <span>${product.unitSold}</span>
                            </div>
                            <hr class="my-1"/>
                            <div class="d-flex justify-content-between">
                                <span>Số sản phẩm còn lại</span>
                                <span>${product.quantity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
		);
	});
}

function navigate(id) {
	location.href = `./product_detail.html?id=${id}`;
}
