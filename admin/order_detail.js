let order = [];
let params = new URLSearchParams(location.search);

$(document).ready(async function () {
	order = await getOrderDetails(params.get("id"));
	$("#general-orderId").text(`Mã đơn hàng: ${params.get("id")}`);
	showOrderDetails();
	console.log(order);
});

function showOrderDetails() {
	let total = 0;
	order.forEach((product) => {
		total += parseInt(product.price);
		$("#detail-list").append(
			$(`
            <div class="row border-bottom p-0 pb-2">
                <div class="col-4">
                    ${product.name}
                </div>
                <div class="col-2 text-center">${product.colorName}</div>
                <div class="col-2 text-center">
                    ${product.size}
                </div>
                <div class="col-2 text-center">
                    ${product.quantity}
                </div>
                <div class="col-2 text-center">
                    ${numberWithSeparator(product.price, ",")} VND
                </div>
            </div>
            `)
		);
	});
	$("#detail-list").append(
		$(`
        <div class="row p-0 py-2 mt-4">
            <span class="col"></span>
            <h5 class="col-2">Tổng cộng</h5>
            <h5 class="col-3 text-end">${numberWithSeparator(
				total,
				","
			)} VND</h5>
        </div>
    `)
	);
	console.log(total);
}
