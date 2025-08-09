document.getElementById("year").textContent = new Date().getFullYear();

// Navigation
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const wrapper = document.getElementById("nav-overlay-wrapper");
    const navItems = document.querySelectorAll(".nav-item");

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

    navItems.forEach((btn) => {
        btn.addEventListener("click", () => {
            closeDrawer();
        });
    });
});

// Live chat
document.addEventListener("DOMContentLoaded", () => {
    const chatOpenButtons = document.querySelectorAll(".live-chat-open");
    const chatWrapper = document.querySelector(".live-chat-wrapper");
    const closeChatBtn = document.querySelector(".chat-close");

    chatOpenButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            chatWrapper.classList.add("active");
        });
    });

    if (closeChatBtn) {
        closeChatBtn.addEventListener("click", () => {
            chatWrapper.classList.remove("active");
        });
    }
});

// Drawer
document.addEventListener("DOMContentLoaded", () => {
    const loginButtons = document.querySelectorAll(".btn.login");
    const inRoll = document.querySelectorAll(".btn-in-roll");
    const wrapper = document.getElementById("login-wrapper");
    const drawer = document.getElementById("overlay-container");
    const closeBtn = document.querySelector(".drawer-close");

    const accountTitle = document.querySelector(".account-header-title");
    // const bookingTitle = document.querySelector(".booking-header-title");
    const accountContainer = document.querySelector(".login-step");
    const nameLabel = document.querySelector(".profile-name-label");
    const profileContainer = document.querySelector(".profile-info-update");
    const imageContainer = document.querySelector(".image-uploader");
    // const hideForBooking = document.querySelectorAll(".hide-for-booking");

    function closeDrawer() {
        wrapper.classList.remove("active");
        accountTitle.style.display = "";
        nameLabel.style.display = "";
        // bookingTitle.style.display = "none";
        accountContainer.classList.add("active");
        profileContainer.classList.remove("active");
        imageContainer.style.display = "";
        // hideForBooking.forEach(el => el.style.display = "");
    }

    loginButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (wrapper.classList.contains("active")) {
                closeDrawer();
            } else {
                // hideForBooking.style.display="";
                accountTitle.style.display = "";
                // bookingTitle.style.display = "none";
                accountContainer.classList.add("active");
                wrapper.classList.add("active");
            }
        });
    });
    inRoll.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (wrapper.classList.contains("active")) {
                closeDrawer();
            } else {
                // hideForBooking.forEach(el => el.style.display = "none");
                // bookingTitle.style.display = "";
                imageContainer.style.display = "none";
                profileContainer.classList.add("active");
                accountContainer.classList.remove("active");
                accountTitle.style.display = "none";
                wrapper.classList.add("active");
                nameLabel.style.display = "none";
            }
        });
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDrawer();
    });

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
// popup close
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.getElementById("popup-wrapper");
    const drawer = document.getElementById("popup-container");
    const bookImg = document.querySelector(".book-img");
    const readBtn = document.querySelector(".btn-read");

    function openDrawer() {
        wrapper.classList.add("active");
    }

    function closeDrawer() {
        wrapper.classList.remove("active");
    }

    bookImg?.addEventListener("click", (e) => {
        e.stopPropagation();
        openDrawer();
    });

    readBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        openDrawer();
    });

    // Unified event handler: close on icon OR outside
    document.addEventListener("click", (e) => {
        if (e.target.closest(".drawer-close")) {
            e.stopPropagation();
            closeDrawer();
            return;
        }
        const shouldCloseOnOutside =
            wrapper.getAttribute("data-close-outside") !== "false";
        if (
            wrapper.classList.contains("active") &&
            shouldCloseOnOutside &&
            !drawer.contains(e.target) &&
            !e.target.closest(".book-img") &&
            !e.target.closest(".btn-read")
        ) {
            closeDrawer();
        }
    });
});
// open book close
document.addEventListener("DOMContentLoaded", () => {
  const readBtns = document.querySelectorAll(".btn-read-book");

  readBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const bookWrapper = btn.closest(".book-wrapper");
      if (!bookWrapper) return;

      const readingPanel = bookWrapper.querySelector(".book-reading-panel");
      const bookContainer = bookWrapper.querySelector(".book-container");

      const isActive = readingPanel.classList.contains("active");

      if (isActive) {
        // Panel is open, so close it
        readingPanel.classList.remove("active");
        bookContainer.classList.remove("active");
        btn.textContent = "Read";
      } else {
        // Panel is closed, so open it and close others

        // Close all other panels and containers
        document.querySelectorAll(".book-reading-panel.active").forEach(panel => {
          panel.classList.remove("active");
        });
        document.querySelectorAll(".book-container.active").forEach(container => {
          container.classList.remove("active");
        });

        // Reset all buttons text
        readBtns.forEach(button => {
          button.textContent = "Read";
        });

        // Open this one
        readingPanel.classList.add("active");
        bookContainer.classList.add("active");
        btn.textContent = "Close";
      }
    });
  });
});


// Tab Selection
document.addEventListener("DOMContentLoaded", () => {
    const tabContainer = document.querySelectorAll(".tab-selection");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const newBtn = document.querySelector(".new-btn");
    const outsideBtn = document.querySelector(".btn.outside");
    const forgetButtons = document.querySelectorAll(".forget-password");
    const loginBtn = document.querySelector(".login-btn");
    const otpBtn = document.getElementById("otp-btn");
    const editNumber = document.getElementById("number-edit");
    const registrationBtn = document.getElementById("registration-btn");

    const accountTitle = document.querySelector(".account-header-title");
    const profileTitle = document.querySelector(".profile-header-title");
    const otpTitle = document.querySelector(".otp-header-title");
    const accountContainer = document.querySelector(".login-step");
    const profileContainer = document.querySelector(".profile-info-update");
    const otpContainer = document.querySelector(".otp-verification-container");
    const titles = document.querySelectorAll(".account-title");

    function activateTab(tabType) {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));
        tabContainer.forEach((tab) => tab.classList.remove("remove"));
        outsideBtn.classList.remove("remove");

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
        e.preventDefault();
        activateTab("create");
    });

    forgetButtons.forEach((forgetBtn) =>
        forgetBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            accountTitle.textContent = "Recover your password";
            titles.forEach((title) => title.classList.remove("active"));
            tabContainer.forEach((tab) => tab.classList.add("remove"));
            outsideBtn.classList.add("remove");
        })
    );

    loginBtn?.addEventListener("click", () => {
        activateTab("login");
    });

    registrationBtn?.addEventListener("click", (e) => {
        e.preventDefault();

        if (accountTitle && profileTitle) {
            accountTitle.classList.remove("active");
            profileTitle.classList.add("active");
            accountContainer.classList.remove("active");
            profileContainer.classList.add("active");
        }
    });
    otpBtn?.addEventListener("click", (e) => {
        e.preventDefault();

        if (accountTitle && otpTitle) {
            accountTitle.classList.remove("active");
            otpTitle.classList.add("active");
            accountContainer.classList.remove("active");
            profileContainer.classList.remove("active");
            otpContainer.classList.add("active");
        }
    });
    editNumber?.addEventListener("click", (e) => {
        e.preventDefault();

        console.log("first");

        if (accountTitle && otpTitle) {
            accountTitle.classList.add("active");
            otpTitle.classList.remove("active");
            otpContainer.classList.remove("active");
            accountContainer.classList.add("active");
        }
    });
});

// Timer
document.addEventListener("DOMContentLoaded", () => {
    const timerEl = document.getElementById("timer");
    let duration = 2 * 60; // 2 minutes in seconds

    const countdown = setInterval(() => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;

        if (duration <= 0) {
            clearInterval(countdown);
            timerEl.textContent = "00:00";
        } else {
            duration--;
        }
    }, 1000);
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

    const dotsContainer = wrapper.querySelector(".dots");

    // Create dots
    const dots = [];
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            index = i;
            updateSlide();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
    }

    function updateSlide() {
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
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

// Image uploader
document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const uploadArea = document.getElementById("uploadArea");
    const previewArea = document.getElementById("previewArea");

    uploadArea.addEventListener("click", () => {
        imageInput.click();
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("hover");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("hover");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("hover");
        const file = e.dataTransfer.files[0];
        if (file) showPreview(file);
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) showPreview(file);
    });

    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = () => {
            previewArea.innerHTML = `<img class="profile-image" src="${reader.result}" alt="Preview" />`;
        };
        reader.readAsDataURL(file);
    }
});

// Scroll and selection
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".info-tab");
    const detailsSection = document.getElementById("details-container");
    const syllabusSection = document.getElementById("syllabus-container");
    const syllabusBtn = document.getElementById("view-syllabus");
    const infoTabContainer = document.querySelector(".info-tab-container");

    const OFFSET = 150;
    let isAutoScrolling = false;
    let scrollTimeout;

    function getOffsetTop(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top + window.scrollY - infoTabContainer.offsetHeight - OFFSET
        );
    }

    function setActiveTab(index) {
        tabs.forEach((t) => t.classList.remove("active"));
        tabs[index].classList.add("active");
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            setActiveTab(index);

            const targetSection =
                index === 0 ? detailsSection : syllabusSection;
            const scrollTo = getOffsetTop(targetSection);

            isAutoScrolling = true;
            window.scrollTo({
                top: scrollTo,
                behavior: "smooth",
            });

            // Disable scroll updates temporarily
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isAutoScrolling = false;
            }, 500); // adjust duration to match smooth scroll
        });
    });

    syllabusBtn.addEventListener("click", () => {
        setActiveTab(1);

        const targetSection = syllabusSection;
        const scrollTo = getOffsetTop(targetSection);

        isAutoScrolling = true;
        window.scrollTo({
            top: scrollTo,
            behavior: "smooth",
        });

        // Disable scroll updates temporarily
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isAutoScrolling = false;
        }, 500); // adjust duration to match smooth scroll
    });

    window.addEventListener("scroll", () => {
        if (isAutoScrolling) return;

        const currentScroll =
            window.scrollY + infoTabContainer.offsetHeight + OFFSET;
        const detailsTop = detailsSection.offsetTop;
        const syllabusTop = syllabusSection.offsetTop;

        if (currentScroll >= syllabusTop) {
            setActiveTab(1); // Syllabus
        } else {
            setActiveTab(0); // Details
        }
    });
});

// Only Tabs
document.addEventListener("DOMContentLoaded", () => {
    // Scoped tab switching
    document.querySelectorAll(".tabs").forEach((tabContainer) => {
        const tabs = tabContainer.querySelectorAll(".tab");

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const groupWrapper =
                    tabContainer.nextElementSibling ||
                    tabContainer.parentElement;

                // Remove active in this group
                tabs.forEach((t) => t.classList.remove("active"));
                const groupContents = groupWrapper.querySelectorAll(
                    ":scope > .tab-content"
                );
                groupContents.forEach((c) => c.classList.remove("active"));

                // Activate clicked tab and its content
                tab.classList.add("active");
                const target = groupWrapper.querySelector(
                    `#${tab.dataset.tab}`
                );
                if (target) target.classList.add("active");

                // If the clicked tab is "joining", reset its nested tabs
                if (tab.dataset.tab === "joining") {
                    const nestedTabs = target.querySelectorAll(".tabs .tab");
                    if (nestedTabs.length) {
                        nestedTabs[0].click(); // Click the first inner tab
                    }
                }
                // When clicking the e-book tab, close all ebook reading panels
                if (tab.dataset.tab === "e-book") {
                    document
                        .querySelectorAll(".book-container.active")
                        .forEach((el) => el.classList.remove("active"));
                    document
                        .querySelectorAll(".book-reading-panel.active")
                        .forEach((el) => el.classList.remove("active"));
                }
            });
        });
    });

    // Clicking a course-action should open joining in outer tabs
    document.querySelectorAll(".course-action").forEach((course) => {
        course.addEventListener("click", () => {
            const joiningTab = document.querySelector(
                '.tabs .tab[data-tab="joining"]'
            );
            if (joiningTab) joiningTab.click();
        });
    });
});
