let orders = [];

$(document).ready(async function () {
	orders = await getOrders();
	showOrders();
});

function showOrders() {
	console.log(orders);
	orders.sort((a, b) => {
		return (
			new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
		);
	});

	let newOrders = orders.slice(0, Math.min(8, orders.length));

	newOrders.forEach((order) => {
		console.log(order);
		console.log(new Date().toLocaleDateString());
		$("#recent-orders-list").append(
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

	let totalAmount = orders.reduce(
		(curSum, order) => curSum + parseInt(order.total),
		0
	);
	let activeAmount = orders
		.filter((order) =>
			["pending", "processing", "delivering"].includes(order.status)
		)
		.reduce((curSum, order) => curSum + parseInt(order.total), 0);
	let completeAmount = orders
		.filter((order) => order.status == "delivered")
		.reduce((curSum, order) => curSum + parseInt(order.total), 0);
	let returnAmount = orders
		.filter((order) => order.status == "canceled")
		.reduce((curSum, order) => curSum + parseInt(order.total), 0);

	console.log(totalAmount, activeAmount, completeAmount, returnAmount);
	$("#total-order .amount").text(
		numberWithSeparator(totalAmount, ",") + " VND"
	);
	$("#active-order .amount").text(
		numberWithSeparator(activeAmount, ",") + " VND"
	);
	$("#complete-order .amount").text(
		numberWithSeparator(completeAmount, ",") + " VND"
	);
	$("#return-order .amount").text(
		numberWithSeparator(returnAmount, ",") + " VND"
	);
}
// "pending",
// "processing",
// "delivering",
// "canceled",
// "delivered"
