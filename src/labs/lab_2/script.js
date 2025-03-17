document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("shirt-container");

    shirts.forEach(shirt => {
        const colorKeys = Object.keys(shirt.colors);
        const firstColor = colorKeys.length > 0 ? colorKeys[0] : null;
        const frontImage = firstColor ? shirt.colors[firstColor].front : shirt.default.front;

        const card = document.createElement("div");//создаем новую карточку
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