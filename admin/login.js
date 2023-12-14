// login.js

$(document).ready(async function () {
	// Event listener for the login form submission
	$("form").submit(async function (e) {
		e.preventDefault();

		var email = $("#email").val();
		var password = $("#password").val();

		try {
			let res = await $.ajax({
				type: "POST",
				url: "http://localhost:8080/backend/users/login",
				contentType: "application/json",
				data: JSON.stringify({
					email,
					password,
				}),
			});
			Cookies.set("token", res.token);
			location.href = "./dashboard.html";
		} catch (error) {}
	});
});
