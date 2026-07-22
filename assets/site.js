(() => {
            const searchInput = document.getElementById("report-search");
            const categoryFilter = document.getElementById("category-filter");
            const sortOrder = document.getElementById("sort-order");
            const reportList = document.getElementById("report-list");
            const resultCount = document.getElementById("result-count");
            const clearButton = document.getElementById("clear-filters");
            const emptyState = document.getElementById("empty-state");
            const pagination = document.getElementById("pagination");
            const pageNumbers = document.getElementById("page-numbers");
            const prevPage = document.getElementById("prev-page");
            const nextPage = document.getElementById("next-page");
            const rows = Array.from(reportList.querySelectorAll(".report-row"));
            const paginationMedia = window.matchMedia("(max-width: 600px)");
            const PAGE_SIZE = 5;
            let currentPage = 1;
            let filteredRows = [...rows];

            const normalized = (value) => value.trim().toLocaleLowerCase("zh-CN");

            function paginationItems(totalPages) {
                const radius = paginationMedia.matches ? 0 : 1;
                const pages = new Set([1, totalPages, currentPage]);

                for (let offset = 1; offset <= radius; offset += 1) {
                    pages.add(currentPage - offset);
                    pages.add(currentPage + offset);
                }

                const validPages = [...pages]
                    .filter((page) => page >= 1 && page <= totalPages)
                    .sort((left, right) => left - right);
                const items = [];

                validPages.forEach((page, index) => {
                    if (index > 0 && page - validPages[index - 1] > 1) {
                        items.push("ellipsis");
                    }
                    items.push(page);
                });

                return items;
            }

            function renderPagination(totalPages) {
                pageNumbers.replaceChildren();
                pagination.hidden = filteredRows.length === 0;
                prevPage.disabled = currentPage === 1;
                nextPage.disabled = currentPage === totalPages;

                paginationItems(totalPages).forEach((item) => {
                    if (item === "ellipsis") {
                        const ellipsis = document.createElement("span");
                        ellipsis.className = "page-ellipsis";
                        ellipsis.textContent = "…";
                        ellipsis.setAttribute("aria-hidden", "true");
                        pageNumbers.appendChild(ellipsis);
                        return;
                    }

                    const button = document.createElement("button");
                    button.className = "page-number";
                    button.type = "button";
                    button.textContent = item;
                    button.setAttribute("aria-label", `第 ${item} 页`);
                    button.setAttribute("aria-controls", "report-list");
                    if (item === currentPage) {
                        button.setAttribute("aria-current", "page");
                    }
                    button.addEventListener("click", () => {
                        currentPage = item;
                        renderReports();
                    });
                    pageNumbers.appendChild(button);
                });
            }

            function renderReports() {
                const total = filteredRows.length;
                const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
                currentPage = Math.min(currentPage, totalPages);
                const start = (currentPage - 1) * PAGE_SIZE;
                const end = Math.min(start + PAGE_SIZE, total);

                rows.forEach((row) => {
                    row.hidden = true;
                });
                filteredRows.slice(start, end).forEach((row) => {
                    row.hidden = false;
                });

                reportList.hidden = total === 0;
                emptyState.hidden = total !== 0;
                resultCount.textContent = total
                    ? `显示 ${start + 1}–${end} / ${total} 份总结`
                    : "显示 0 份总结";
                renderPagination(totalPages);
            }

            function sortRows() {
                const mode = sortOrder.value;
                filteredRows.sort((left, right) => {
                    if (mode === "oldest") {
                        return Number(left.dataset.start) - Number(right.dataset.start);
                    }
                    if (mode === "messages") {
                        return Number(right.dataset.messages) - Number(left.dataset.messages);
                    }
                    return Number(right.dataset.end) - Number(left.dataset.end);
                });

                filteredRows.forEach((row) => reportList.appendChild(row));
            }

            function applyFilters() {
                const query = normalized(searchInput.value);
                const category = categoryFilter.value;

                filteredRows = rows.filter((row) => {
                    const matchesSearch = !query || row.dataset.search.includes(query);
                    const categories = row.dataset.categories.split("|");
                    return matchesSearch && (!category || categories.includes(category));
                });

                currentPage = 1;
                sortRows();
                renderReports();
                clearButton.hidden = !query && !category;
            }

            function changePage(offset) {
                const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
                currentPage = Math.min(Math.max(1, currentPage + offset), totalPages);
                renderReports();
            }

            searchInput.addEventListener("input", applyFilters);
            categoryFilter.addEventListener("change", applyFilters);
            sortOrder.addEventListener("change", () => {
                sortRows();
                renderReports();
            });
            prevPage.addEventListener("click", () => changePage(-1));
            nextPage.addEventListener("click", () => changePage(1));
            paginationMedia.addEventListener("change", () => {
                renderPagination(Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE)));
            });
            clearButton.addEventListener("click", () => {
                searchInput.value = "";
                categoryFilter.value = "";
                applyFilters();
                searchInput.focus();
            });
            applyFilters();
        })();
