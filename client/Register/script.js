function validateForm(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    var acceptTerms = document.getElementById('acceptTerms').checked;

    if (!acceptTerms) {
        alert('Vui lòng chấp nhận điều khoản đăng ký.');
        return;
    }
    if (password.length < 6) {
        alert('Vui lòng nhập mật khẩu có độ dài từ 6 kí tự trở lên!');
        // document.getElementById('signupForm').reset();
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp.');
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        return;
    }

    // Pass tất cả điều kiện
    alert('Đăng ký thành công!');
}