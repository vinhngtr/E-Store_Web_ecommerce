let orders = [];

$(document).ready(async function () {
	orders = await getOrders();
	showOrders();
});

function showOrders() {
	orders.sort((a, b) => {
		return (
			new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
		);
	});

	let newOrders = orders.slice(0, Math.min(8, orders.length));

	newOrders.forEach((order) => {
		console.log(order);
		$("#orders-list").append(
			$(`
        <div class="row border-bottom p-0 pb-2 mt-3">
            <div class="col-2 text-center">
                ${order.id}
            </div>
            <div class="col-2 text-center">
                ${new Date(order.orderTime).toLocaleDateString()}
            </div>
            <div class="col-4 text-center">
                ${order.fullName}
            </div>
            <div class="col-2 text-center">
                ${toCapitalized(order.status)}
            </div>
            <div class="col-2 text-center">
                ${numberWithSeparator(order.total, ",")} VND
            </div>
        </div>
        `)
		);
	});
}
