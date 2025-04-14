document.addEventListener('DOMContentLoaded', function() {
    const targets = document.querySelectorAll('.target');
    let activeTarget = null;
    let isDragging = false;
    let isSticky = false;
    let offsetX, offsetY;
    let originalPos = { x: 0, y: 0 };
    let lastTouchTime = 0;
    let touchTimeout;
    let touchCount = 0;

    function startDrag(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;

        //касание
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        //2ное касание
        if (e.type === 'touchstart') {
            touchCount = e.touches.length;

            if (touchCount > 1) {
                cancelDrag();
                return;
            }

            //проверка двойного нажатия
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTouchTime;
            if (tapLength < 300 && tapLength > 0) {
                clearTimeout(touchTimeout);
                handleDoubleTap(e);
                return;
            }
            lastTouchTime = currentTime;
            touchTimeout = setTimeout(() => {
                if (!isSticky) {
                    isDragging = true;
                    activeTarget = e.target;
                    originalPos.x = parseInt(activeTarget.style.left) || 0;
                    originalPos.y = parseInt(activeTarget.style.top) || 0;
                    offsetX = clientX - originalPos.x;
                    offsetY = clientY - originalPos.y;

                    document.addEventListener('touchmove', touchDrag, { passive: false });
                    document.addEventListener('touchend', touchEndDrag);
                }
            }, 300);
            return;
        }

        if (e.type === 'dblclick') {
            if (isSticky && activeTarget === e.target) {
                endDrag();
                return;
            }
            handleDoubleTap(e);
            return;
        }

        if (isSticky) return;

        isDragging = true;
        activeTarget = e.target;
        originalPos.x = parseInt(activeTarget.style.left) || 0;
        originalPos.y = parseInt(activeTarget.style.top) || 0;
        offsetX = clientX - originalPos.x;
        offsetY = clientY - originalPos.y;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }

    function handleDoubleTap(e) {
        isSticky = true;
        activeTarget = e.target;
        activeTarget.style.backgroundColor = 'blue';
        originalPos.x = parseInt(activeTarget.style.left) || 0;
        originalPos.y = parseInt(activeTarget.style.top) || 0;

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        updatePosition({ clientX, clientY });

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('touchmove', touchUpdatePosition, { passive: false });
        document.addEventListener('click', endDragOnClick);
        document.addEventListener('touchend', handleTouchEnd);
    }

    function drag(e) {
        if (!isDragging) return;
        activeTarget.style.left = (e.clientX - offsetX) + 'px';
        activeTarget.style.top = (e.clientY - offsetY) + 'px';
    }

    function touchDrag(e) {
        if (!isDragging || e.touches.length > 1) {
            cancelDrag();
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        activeTarget.style.left = (touch.clientX - offsetX) + 'px';
        activeTarget.style.top = (touch.clientY - offsetY) + 'px';
    }

    function updatePosition(e) {
        if (!isSticky || !activeTarget) return;
        activeTarget.style.left = e.clientX + 'px';
        activeTarget.style.top = e.clientY + 'px';
    }

    function touchUpdatePosition(e) {
        if (!isSticky || !activeTarget || e.touches.length > 1) {
            cancelDrag();
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        activeTarget.style.left = touch.clientX + 'px';
        activeTarget.style.top = touch.clientY + 'px';
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
        }
        activeTarget = null;
    }

    function touchEndDrag(e) {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('touchmove', touchDrag);
            document.removeEventListener('touchend', touchEndDrag);
        }
        activeTarget = null;
    }

    function endDragOnClick(e) {
        if (isSticky && (e.button === 0 || e.type === 'touchend')) {
            isSticky = false;
            activeTarget.style.backgroundColor = 'red';
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('touchmove', touchUpdatePosition);
            document.removeEventListener('click', endDragOnClick);
            document.removeEventListener('touchend', handleTouchEnd);
            activeTarget = null;
        }
    }

    function handleTouchEnd(e) {
        //проверка на быстрый тап
        if (e.changedTouches.length === 1 && !isDragging) {
            endDragOnClick(e);
        }
    }

    function cancelDrag() {
        if (activeTarget) {
            activeTarget.style.left = originalPos.x + 'px';
            activeTarget.style.top = originalPos.y + 'px';
            if (isSticky) {
                activeTarget.style.backgroundColor = 'red';
                document.removeEventListener('mousemove', updatePosition);
                document.removeEventListener('touchmove', touchUpdatePosition);
                document.removeEventListener('click', endDragOnClick);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        }
        isDragging = false;
        isSticky = false;
        activeTarget = null;

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', touchDrag);
        document.removeEventListener('touchend', touchEndDrag);
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            cancelDrag();
        }
    }

    targets.forEach(target => {
        target.addEventListener('mousedown', startDrag);
        target.addEventListener('dblclick', startDrag);
        target.addEventListener('touchstart', startDrag, { passive: false });
    });

    document.addEventListener('keydown', handleKeyDown);
});