function validateForm() {
	// Get form values
	const fullName = document.getElementById("fullName").value;
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const confirmPassword = document.getElementById("confirmPassword").value;
	var acceptTerms = document.getElementById("acceptTerms").checked;

	if (!acceptTerms) {
		alert("Vui lòng chấp nhận điều khoản đăng ký.");
		return false;
	}
	if (password.length < 6) {
		alert("Vui lòng nhập mật khẩu có độ dài từ 6 kí tự trở lên!");
		// document.getElementById('signupForm').reset();
		document.getElementById("password").value = "";
		document.getElementById("confirmPassword").value = "";
		return false;
	}

	if (password !== confirmPassword) {
		alert("Mật khẩu không khớp.");
		document.getElementById("password").value = "";
		document.getElementById("confirmPassword").value = "";
		return false;
	}

	// Pass tất cả điều kiện
	// alert("Đăng ký thành công!");
	return true;
}

$(document).ready(async function () {
	$("#signupForm").submit(register);
});

async function register(e) {
	e.preventDefault();
	if (!validateForm()) return;
	let fullName, email, password;
	fullName = $("#fullName").val();
	email = $("#email").val();
	password = $("#password").val();

	try {
		let res = await $.ajax({
			url: `http://localhost:8080/backend/users/register`,
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify({ fullName, email, password }),
		});
		Cookies.set("token", res.token);
		location.href = "../index.html";
	} catch (error) {
		console.log(error);
	}
}
