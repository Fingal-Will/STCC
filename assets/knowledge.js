(() => {
            const search = document.getElementById("knowledge-search");
            const filters = Array.from(document.querySelectorAll(".filter"));
            const items = Array.from(document.querySelectorAll(".knowledge-item"));
            const empty = document.getElementById("knowledge-empty");
            const resultCount = document.getElementById("knowledge-result-count");
            const clearButton = document.getElementById("knowledge-clear");
            let category = "";

            function applyFilters() {
                const query = search.value.trim().toLocaleLowerCase("zh-CN");
                let visible = 0;
                items.forEach((item) => {
                    const matches = (!category || item.dataset.category === category)
                        && (!query || item.dataset.search.includes(query));
                    item.hidden = !matches;
                    if (matches) visible += 1;
                });
                empty.hidden = visible !== 0;
                resultCount.textContent = visible ? `显示 ${visible} 条知识` : "显示 0 条知识";
                clearButton.hidden = !category && !query;
            }

            search.addEventListener("input", applyFilters);
            filters.forEach((button) => {
                button.addEventListener("click", () => {
                    category = button.dataset.category;
                    filters.forEach((item) => {
                        item.setAttribute("aria-pressed", String(item === button));
                    });
                    applyFilters();
                });
            });
            clearButton.addEventListener("click", () => {
                category = "";
                search.value = "";
                filters.forEach((item, index) => {
                    item.setAttribute("aria-pressed", String(index === 0));
                });
                applyFilters();
                search.focus();
            });
            applyFilters();
        })();
