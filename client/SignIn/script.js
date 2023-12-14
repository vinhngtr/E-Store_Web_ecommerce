$(document).ready(async function () {
	$("#loginForm").submit(login);
});

async function login(e) {
	e.preventDefault();

	email = $("#email").val();
	password = $("#password").val();

	try {
		let res = await $.ajax({
			url: `http://localhost:8080/backend/users/login`,
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify({ email, password }),
		});
		console.log(res);
		Cookies.set("token", res.token);
		location.href = "../index.html";
	} catch (error) {
		console.log(error);
	}
}
