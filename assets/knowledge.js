(() => {
            const search = document.getElementById("knowledge-search");
            const filters = Array.from(document.querySelectorAll(".filter"));
            const items = Array.from(document.querySelectorAll(".knowledge-item"));
            const empty = document.getElementById("knowledge-empty");
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
        })();
