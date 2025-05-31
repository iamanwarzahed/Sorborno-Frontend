document.getElementById("year").textContent = new Date().getFullYear();

// Navigation
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const wrapper = document.getElementById("nav-drawer-wrapper");

    function closeDrawer() {
        wrapper.classList.remove("active");
        hamburger.textContent = "☰";
    }

    hamburger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (wrapper.classList.contains("active")) {
            closeDrawer();
        } else {
            wrapper.classList.add("active");
            hamburger.textContent = "✕";
        }
    });

    // Close on outside click (overlay or anywhere outside drawer)
    document.addEventListener("click", (event) => {
        if (
            wrapper.classList.contains("active") &&
            !document.getElementById("nav-drawer").contains(event.target) &&
            !hamburger.contains(event.target)
        ) {
            closeDrawer();
        }
    });
});

// Drawer
document.addEventListener("DOMContentLoaded", () => {
    const loginButtons = document.querySelectorAll(".btn.login");
    const wrapper = document.getElementById("login-drawer-wrapper");
    const drawer = document.getElementById("login-drawer");
    const closeBtn = document.querySelector(".drawer-close");

    function closeDrawer() {
        wrapper.classList.remove("active");
    }

    loginButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (wrapper.classList.contains("active")) {
                closeDrawer();
            } else {
                wrapper.classList.add("active");
            }
        });
    });

    closeBtn.addEventListener("click", closeDrawer);

    // Close on outside click (overlay or anywhere outside drawer)
    document.addEventListener("click", (event) => {
        if (
            wrapper.classList.contains("active") &&
            !drawer.contains(event.target) &&
            !event.target.closest(".btn.login")
        ) {
            closeDrawer();
        }
    });
});

// Tab Selection
document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const newBtn = document.querySelector(".new-btn, .help-btn a");
    const loginBtn = document.querySelector(".login-btn");

    function activateTab(tabType) {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        document
            .querySelectorAll(".login-title, .create-title")
            .forEach((title) => {
                title.classList.remove("active");
            });

        document.querySelector(`.tab-${tabType}`)?.classList.add("active");
        document
            .querySelector(`.tab-${tabType}-content`)
            ?.classList.add("active");
        document.querySelector(`.${tabType}-title`)?.classList.add("active");
    }

    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const isLogin = btn.classList.contains("tab-login");
            activateTab(isLogin ? "login" : "create");
        });
    });

    newBtn?.addEventListener("click", (e) => {
        e.preventDefault(); // for anchor tags
        activateTab("create");
    });

    loginBtn?.addEventListener("click", () => {
        activateTab("login");
    });
});

// Search
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".search-input-wrapper").forEach((wrapper) => {
        const input = wrapper.querySelector(".search-input");
        const resultBox = wrapper.querySelector(".search-result-wrapper");

        wrapper.addEventListener("click", () => {
            wrapper.classList.add("active");
            resultBox.style.display = "block";
            input.focus();
        });

        // Handle outside click
        document.addEventListener("click", (event) => {
            if (!wrapper.contains(event.target)) {
                wrapper.classList.remove("active");
                resultBox.style.display = "none";
            }
        });

        resultBox.addEventListener("mousedown", (e) => {
            e.preventDefault();
        });
    });
});

// Slider Logic
document.querySelectorAll(".slider-wrapper").forEach((wrapper) => {
    const slidesContainer = wrapper.querySelector(".slides");
    const slides = slidesContainer.children;
    const totalSlides = slides.length;
    let index = 0;

    const prevBtn = wrapper.querySelector(".controls.prev");
    const nextBtn = wrapper.querySelector(".controls.next");

    function updateSlide() {
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    function goToNextSlide() {
        index = (index + 1) % totalSlides;
        updateSlide();
    }

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + totalSlides) % totalSlides;
        updateSlide();
    });

    nextBtn.addEventListener("click", goToNextSlide);

    let interval = setInterval(goToNextSlide, 3000);

    wrapper.addEventListener("mouseenter", () => {
        clearInterval(interval);
    });
    wrapper.addEventListener("mouseleave", () => {
        interval = setInterval(goToNextSlide, 3000);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".multi-slider").forEach((slider) => {
        const container = slider.querySelector(".multi-container");
        const items = container.querySelectorAll(".multi-item");
        const nextBtn = slider.querySelector(".next");
        const prevBtn = slider.querySelector(".prev");

        let index = 0;
        const itemCount = items.length;
        const itemWidth =
            items[0].offsetWidth +
            parseInt(getComputedStyle(items[0]).marginRight);

        // Clone items to loop seamlessly
        items.forEach((item) => {
            const clone = item.cloneNode(true);
            container.appendChild(clone);
        });

        function updateSlide() {
            container.style.transition = "transform 0.4s ease";
            container.style.transform = `translateX(-${index * itemWidth}px)`;
        }

        function goToNext() {
            index++;
            updateSlide();

            if (index >= itemCount) {
                setTimeout(() => {
                    container.style.transition = "none";
                    index = 0;
                    container.style.transform = `translateX(0px)`;
                }, 400);
            }
        }

        nextBtn.addEventListener("click", goToNext);

        prevBtn.addEventListener("click", () => {
            if (index <= 0) {
                index = itemCount;
                container.style.transition = "none";
                container.style.transform = `translateX(-${
                    index * itemWidth
                }px)`;
            }

            setTimeout(() => {
                index--;
                updateSlide();
            }, 10);
        });

        let autoSlide = setInterval(goToNext, 3000);

        slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
        slider.addEventListener("mouseleave", () => {
            autoSlide = setInterval(goToNext, 3000);
        });
    });
});

// Custom Select Dropdown
document.querySelectorAll(".custom-select").forEach((select) => {
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");

    selected.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdownsExcept(select);
        if (selected.classList.contains("active")) {
            selected.classList.remove("active");
            options.classList.remove("active");
        } else {
            selected.classList.add("active");
            options.classList.add("active");
        }
        options.style.display =
            options.style.display === "block" ? "none" : "block";
    });

    options.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", () => {
            selected.textContent = option.textContent;
            selected.setAttribute("data-value", option.dataset.value);
            options.style.display = "none";
        });
    });
});

// Language Select Dropdown
document.querySelectorAll(".language-select").forEach((select) => {
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");

    selected.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdownsExcept(select);
        options.style.display =
            options.style.display === "block" ? "none" : "block";
    });

    options.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", () => {
            selected.innerHTML = option.innerHTML;
            selected.setAttribute("data-lang", option.dataset.lang);
            options.style.display = "none";
        });
    });
});

// Close dropdowns on outside click
document.addEventListener("click", () => {
    document.querySelectorAll(".options").forEach((opt) => {
        opt.style.display = "none";
    });
});

// Utility function to close all other dropdowns
function closeAllDropdownsExcept(current) {
    document
        .querySelectorAll(".custom-select, .language-select")
        .forEach((select) => {
            if (select !== current) {
                const options = select.querySelector(".options");
                if (options) options.style.display = "none";
            }
        });
}

// Counter number
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");

    const startCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        let current = 0;
        const increment = Math.ceil(target / 100); // Adjust for speed

        const updateCount = () => {
            current += increment;
            if (current < target) {
                counter.innerText = current;
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };

        updateCount();
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    startCounter(counter);
                    obs.unobserve(counter); // Only run once
                }
            });
        },
        {
            threshold: 0.5, // Trigger when at least 50% visible
        }
    );

    counters.forEach((counter) => {
        observer.observe(counter);
    });
});

// Accordion
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".accordion-item").forEach((item) => {
        const header = item.querySelector(".accordion-header");
        let hovered = false;

        // Toggle on click
        header.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            document
                .querySelectorAll(".accordion-item")
                .forEach((i) => i.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });

        // Add active on hover
        // item.addEventListener("mouseenter", () => {
        //   hovered = true;
        //   item.classList.add("active");
        // });

        // // Remove active on mouse leave (only if it was from hover)
        // item.addEventListener("mouseleave", () => {
        //   if (hovered) {
        //     item.classList.remove("active");
        //     hovered = false;
        //   }
        // });
    });
});
