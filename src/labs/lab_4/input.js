document.addEventListener('DOMContentLoaded', function() {
    const targets = document.querySelectorAll('.target');
    let activeTarget = null;
    let isDragging = false;
    let isSticky = false;
    let offsetX, offsetY;
    let originalPos = { x: 0, y: 0 };

    function startDrag(e) {
        if (e.type === 'mousedown' && e.button !== 0) return; //нажатие лкм
        if (e.type === 'dblclick') {
            if (isSticky && activeTarget === e.target) {//2ной клик
                endDrag();
                return;
            }
            isSticky = true;
            activeTarget = e.target;
            activeTarget.style.backgroundColor = 'blue';
            originalPos.x = parseInt(activeTarget.style.left) || 0;
            originalPos.y = parseInt(activeTarget.style.top) || 0;
            updatePosition(e);
            document.addEventListener('mousemove', updatePosition);
            document.addEventListener('click', endDragOnClick);
            return;
        }

        if (isSticky) return;

        isDragging = true;
        activeTarget = e.target;
        originalPos.x = parseInt(activeTarget.style.left) || 0;
        originalPos.y = parseInt(activeTarget.style.top) || 0;
        offsetX = e.clientX - originalPos.x;
        offsetY = e.clientY - originalPos.y;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }

    function drag(e) {//перетаскивание для 1
        if (!isDragging) return;
        activeTarget.style.left = (e.clientX - offsetX) + 'px';
        activeTarget.style.top = (e.clientY - offsetY) + 'px';
    }

    function updatePosition(e) {//перетаскивание для 2
        if (!isSticky || !activeTarget) return;
        activeTarget.style.left = e.clientX + 'px';
        activeTarget.style.top = e.clientY + 'px';
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
        }
        activeTarget = null;
    }

    function endDragOnClick(e) {
        if (isSticky && e.button === 0) { // Проверяем, что нажата ЛКМ
            isSticky = false;
            activeTarget.style.backgroundColor = 'red';
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('click', endDragOnClick);
            activeTarget = null;
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            if (isDragging || isSticky) {
                if (activeTarget) {
                    activeTarget.style.left = originalPos.x + 'px';
                    activeTarget.style.top = originalPos.y + 'px';
                    if (isSticky) {
                        activeTarget.style.backgroundColor = 'red';
                        document.removeEventListener('mousemove', updatePosition);
                        document.removeEventListener('click', endDragOnClick);
                    }
                }
                isDragging = false;
                isSticky = false;
                activeTarget = null;
            }
        }
    }

    targets.forEach(target => {
        target.addEventListener('mousedown', startDrag);
        target.addEventListener('dblclick', startDrag);
    });

    document.addEventListener('keydown', handleKeyDown);
});