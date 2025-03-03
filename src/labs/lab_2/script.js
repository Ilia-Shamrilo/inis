document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("shirt-container");

    shirts.forEach(shirt => {
        // Получаем первый доступный цвет
        const colorKeys = Object.keys(shirt.colors);
        const firstColor = colorKeys.length > 0 ? colorKeys[0] : null;
        const frontImage = firstColor ? shirt.colors[firstColor].front : shirt.default.front;

        // Создаём карточку футболки
        const card = document.createElement("div");
        card.classList.add("shirt-card");

        card.innerHTML = `
            <img src="${frontImage}" alt="${shirt.name}" class="shirt-image">
            <h2>${shirt.name}</h2>
            <p>Доступно цветов: ${colorKeys.length}</p>
            <button class="quick-view">Quick View</button>
            <button class="see-page">See Page</button>
        `;

        container.appendChild(card);
    });
});