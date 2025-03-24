document.addEventListener("DOMContentLoaded", function () {
    const index = localStorage.getItem("selectedShirt");
    if (index === null) {
        document.body.innerHTML = "<h2>Футболка не выбрана</h2>";
        return;
    }

    const shirt = shirts[index];
    let currentColor = Object.keys(shirt.colors)[0] || "default";
    let isFront = true;

    const shirtName = document.getElementById("shirt-name");
    const shirtDescription = document.getElementById("shirt-description");
    const shirtPrice = document.getElementById("shirt-price");
    const shirtImage = document.getElementById("shirt-image");
    const frontBtn = document.getElementById("front-btn");
    const backBtn = document.getElementById("back-btn");
    const colorButtonsContainer = document.getElementById("color-buttons");
    const backToMainBtn = document.getElementById("back-to-main");

    shirtName.textContent = shirt.name;
    shirtDescription.textContent = shirt.description;
    shirtPrice.textContent = `Цена: ${shirt.price}`;

    function updateImage() {
        const imgSrc = isFront ? shirt.colors[currentColor].front : shirt.colors[currentColor].back;
        shirtImage.src = imgSrc;
    }

    frontBtn.addEventListener("click", function () {
        isFront = true;
        updateImage();
    });

    backBtn.addEventListener("click", function () {
        isFront = false;
        updateImage();
    });

    Object.keys(shirt.colors).forEach(color => {
        const btn = document.createElement("button");
        btn.textContent = color;
        btn.style.backgroundColor = color;
        btn.classList.add("color-btn");
        btn.addEventListener("click", function () {
            currentColor = color;
            updateImage();
        });
        colorButtonsContainer.appendChild(btn);
    });

    backToMainBtn.addEventListener("click", function () {
        window.location.href = "lab_3.html";
    });

    updateImage();
});
