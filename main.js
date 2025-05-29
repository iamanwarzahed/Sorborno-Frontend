document.getElementById("year").textContent = new Date().getFullYear();

// Navigation Logic
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const drawer = document.getElementById("nav-drawer");

    hamburger.addEventListener("click", () => {
        if (drawer.classList.contains("active")) {
            drawer.classList.remove("active");
            hamburger.textContent = "☰";
        } else {
            drawer.classList.add("active");
            hamburger.textContent = "✕";
        }
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

    // Auto slide
    let interval = setInterval(goToNextSlide, 3000);

    // Pause on hover, resume on leave
    wrapper.addEventListener("mouseenter", () => {
        clearInterval(interval);
    });

    wrapper.addEventListener("mouseleave", () => {
        interval = setInterval(goToNextSlide, 3000);
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
