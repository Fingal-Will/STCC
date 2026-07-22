(() => {
    const container = document.getElementById("word-cloud");
    const dataNode = document.getElementById("word-cloud-data");
    if (!container || !dataNode) return;

    const palette = [
        "#07C160",
        "#576B95",
        "#FA9D3B",
        "#FA5151",
        "#07C160",
        "#576B95",
        "#078F49",
        "#9C6F12"
    ];
    const words = JSON.parse(dataNode.textContent || "[]");
    let resizeTimer = null;

    function renderWordCloud() {
        const containerWidth = Math.floor(container.clientWidth);
        const containerHeight = Math.floor(container.clientHeight);
        if (!containerWidth || !containerHeight) return;

        container.replaceChildren();
        const edgePadding = containerWidth < 480 ? 14 : 10;
        const fontScale = containerWidth < 520
            ? Math.max(0.68, containerWidth / 520)
            : 1;
        const maxWords = containerWidth < 360
            ? 36
            : containerWidth < 480
                ? 42
                : words.length;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const placedRects = [];
        const sortedWords = [...words]
            .sort((left, right) => right.size - left.size)
            .slice(0, maxWords);

        sortedWords.forEach((word, index) => {
            const element = document.createElement("span");
            const fontSize = Math.max(14, Math.round(word.size * fontScale));
            const rotation = `${word.rotate}deg`;

            element.textContent = word.text;
            element.className = "cloud-word";
            element.style.fontSize = `${fontSize}px`;
            element.style.color = palette[index % palette.length];
            element.style.fontWeight = word.weight;
            element.style.transform = `rotate(${rotation})`;
            element.style.transformOrigin = "center center";
            element.style.setProperty("--word-rotate", rotation);
            element.style.visibility = "hidden";
            container.appendChild(element);

            const width = element.offsetWidth;
            const height = element.offsetHeight;
            const radians = Math.abs(word.rotate * Math.PI / 180);
            const boundingWidth = width * Math.cos(radians) + height * Math.sin(radians);
            const boundingHeight = width * Math.sin(radians) + height * Math.cos(radians);
            let angle = 0;
            let radius = 0;
            let placed = false;

            for (let attempt = 0; attempt < 1500; attempt += 1) {
                const x = centerX + radius * Math.cos(angle) - boundingWidth / 2;
                const y = centerY + radius * Math.sin(angle) - boundingHeight / 2;
                const rectangle = {
                    left: x,
                    top: y,
                    right: x + boundingWidth,
                    bottom: y + boundingHeight
                };
                const inside = rectangle.left >= edgePadding
                    && rectangle.right <= containerWidth - edgePadding
                    && rectangle.top >= edgePadding
                    && rectangle.bottom <= containerHeight - edgePadding;
                const collision = placedRects.some((other) => !(
                    rectangle.right + 2 < other.left
                    || rectangle.left - 2 > other.right
                    || rectangle.bottom + 2 < other.top
                    || rectangle.top - 2 > other.bottom
                ));

                if (inside && !collision) {
                    element.style.left = `${x + boundingWidth / 2 - width / 2}px`;
                    element.style.top = `${y + boundingHeight / 2 - height / 2}px`;
                    element.style.visibility = "visible";
                    placedRects.push(rectangle);
                    placed = true;
                    break;
                }
                radius += inside ? 1 : 2;
                angle += 0.2;
            }
            if (!placed) element.remove();
        });
    }

    function scheduleRender() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(renderWordCloud, 80);
    }

    window.requestAnimationFrame(renderWordCloud);
    window.addEventListener("resize", scheduleRender, { passive: true });
    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(scheduleRender);
        observer.observe(container);
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(renderWordCloud);
    }
})();
