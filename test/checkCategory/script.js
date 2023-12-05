document.addEventListener('DOMContentLoaded', function () {
    const categoriesList = [
        'RAM & ROM',
        'SSD & HDD',
        'Headphone',
        'Bàn phím máy tính',
        'Màn hình PC',
        'Chuột gaming',
        'Card màn hình',
        'Tản nhiệt laptop'
    ];

    const productsList = [
        { name: 'Product 1', category: 'RAM & ROM' },
        { name: 'Product 2', category: 'SSD & HDD' },
        { name: 'Product 3', category: 'Headphone' },
        // Thêm các sản phẩm khác với các loại sản phẩm tương ứng
    ];

    const categoriesContainer = document.getElementById('categories');
    const productsContainer = document.getElementById('products');

    categoriesList.forEach(function (category) {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('checkbox-label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = category;
        checkbox.addEventListener('change', function () {
            // Xử lý sự kiện khi checkbox thay đổi trạng thái
            updateProductsDisplay();
        });

        const labelText = document.createTextNode(category);

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(labelText);

        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.appendChild(checkboxLabel);

        categoriesContainer.appendChild(categoryDiv);
    });

    function updateProductsDisplay() {
        const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(function (checkbox) {
            return checkbox.value;
        });

        productsContainer.innerHTML = ''; // Xóa nội dung hiện tại

        productsList.forEach(function (product) {
            if (selectedCategories.includes(product.category)) {
                // Hiển thị sản phẩm nếu nó thuộc loại được chọn
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.textContent = `Name: ${product.name}, Category: ${product.category}`;
                productsContainer.appendChild(productDiv);
            }
        });
    }
});
