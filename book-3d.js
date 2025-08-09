class ResponsiveFlipbook {
    constructor() {
        this.pages = document.querySelectorAll(".page");
        this.totalPages = this.pages.length;

        this.isDragging = false;
        this.dragStartX = 0;
        this.dragThreshold = 50;

        // Only phones are mobile, tablets and desktop use dragging
        this.isMobile = window.innerWidth <= 480;

        // Detect if device supports touch
        this.isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        // Mobile state
        this.mobileCurrentPageIndex = 0;
        this.mobileShowingBack = false;
        this.totalMobileViews = this.totalPages * 2; // front and back of each page

        // Desktop state
        this.currentPage = 0;

        this.prevBtn = document.getElementById("prevBtn");
        this.nextBtn = document.getElementById("nextBtn");
        this.resetBtn = document.getElementById("resetBtn");

        // Bind handlers for removeEventListener use
        this.boundOnDrag = (e) => this.drag(e);
        this.boundEndDrag = () => this.endDrag();

        // === NEW: Bind touch move and end handlers for desktop dragging ===
        this.boundTouchMove = (e) => {
            if (this.currentDragPage !== undefined) {
                e.preventDefault(); // Prevent scrolling while dragging
                this.drag(e.touches[0]);
            }
        };
        this.boundTouchEnd = this.boundEndDrag;
        // ===================================================================

        // Store desktop page click handlers for removal
        this.desktopClickHandlers = [];

        this.init();
        this.updateResponsiveDisplay();

        window.addEventListener("resize", () => this.handleResize());
    }

    handleResize() {
        const wasMobile = this.isMobile;
        // Mobile breakpoint includes tablets
        this.isMobile = window.innerWidth <= 650;

        if (wasMobile !== this.isMobile) {
            this.reset();
            this.updateResponsiveDisplay();
        }
    }

    updateResponsiveDisplay() {
        const desktopText = document.querySelector(".desktop-text");
        const mobileText = document.querySelector(".mobile-text");

        if (this.isMobile) {
            if (desktopText) desktopText.style.display = "none";
            if (mobileText) mobileText.style.display = "inline";
            this.setupMobileView();
        } else {
            if (desktopText) desktopText.style.display = "inline";
            if (mobileText) mobileText.style.display = "none";
            this.setupDesktopView();
            this.removeMobileEvents(); // remove mobile events if any
        }
    }

    init() {
        this.setupEventListeners();
        this.updateControls();
    }

    setupMobileView() {
        // Reset all pages
        this.pages.forEach((page, index) => {
            page.classList.remove(
                "mobile-active",
                "mobile-left",
                "mobile-right",
                "flipped",
                "mobile-flip-front",
                "mobile-flip-back"
            );

            if (index === 0) {
                page.classList.add("mobile-active", "mobile-flip-front");
            } else {
                page.classList.add("mobile-right");
            }
        });

        this.mobileCurrentPageIndex = 0;
        this.mobileShowingBack = false;
        this.updateMobileIndicator();

        this.removeDesktopEvents(); // remove desktop events if any
        this.setupMobileEvents(); // add mobile events
    }

    setupDesktopView() {
        // Reset all pages for desktop
        this.pages.forEach((page, index) => {
            page.classList.remove(
                "mobile-active",
                "mobile-left",
                "mobile-right",
                "mobile-flip-front",
                "mobile-flip-back",
                "flipped",
                "dragging"
            );
            page.style.transform = "";
            page.style.zIndex = "";
        });

        this.currentPage = 0;
        this.updateZIndices();

        this.removeMobileEvents();
        this.setupDesktopEvents();
    }

    updateMobileIndicator() {
        const currentPageNum = document.getElementById("currentPageNum");
        const totalPageNum = document.getElementById("totalPageNum");

        if (currentPageNum && totalPageNum) {
            const visualPage =
                this.mobileCurrentPageIndex * 2 +
                (this.mobileShowingBack ? 2 : 1);
            currentPageNum.textContent = visualPage;
            totalPageNum.textContent = this.totalMobileViews;
        }
    }

    setupEventListeners() {
        // Mobile and desktop page click handled separately now

        // Control buttons
        this.prevBtn.addEventListener("click", () => this.previousPage());
        this.nextBtn.addEventListener("click", () => this.nextPage());
        this.resetBtn.addEventListener("click", () => this.reset());

        // Prevent context menu on pages
        document.addEventListener("contextmenu", (e) => {
            if (e.target.closest(".page")) {
                e.preventDefault();
            }
        });
    }

    setupDesktopEvents() {
        this.removeDesktopEvents();

        this.pages.forEach((page, index) => {
            page.style.cursor = "grab";

            // Mouse events for desktop
            const mouseDownHandler = (e) => this.startDrag(e, index);
            page.addEventListener("mousedown", mouseDownHandler);

            if (this.isTouchDevice) {
                const touchStartHandler = (e) => {
                    e.preventDefault(); // Prevent scrolling while dragging
                    this.startDrag(e.touches[0], index);
                };
                page.addEventListener("touchstart", touchStartHandler, {
                    passive: false,
                });

                page._mouseDownHandler = mouseDownHandler;
                page._touchStartHandler = touchStartHandler;
            } else {
                page._mouseDownHandler = mouseDownHandler;
            }
        });

        document.addEventListener("mousemove", this.boundOnDrag);
        document.addEventListener("mouseup", this.boundEndDrag);

        if (this.isTouchDevice) {
            // Bind touchmove handler to a named function so we can remove it later
            this.boundTouchMoveHandler = (e) => {
                if (this.isDragging) {
                    e.preventDefault(); // Prevent page scrolling while dragging
                    this.drag(e.touches[0]);
                }
            };

            document.addEventListener("touchmove", this.boundTouchMoveHandler, {
                passive: false,
            });
            document.addEventListener("touchend", this.boundEndDrag);
        }

        this.setupDesktopPageClicks();
    }

    removeDesktopEvents() {
        this.pages.forEach((page, index) => {
            page.style.cursor = "";

            if (page._mouseDownHandler) {
                page.removeEventListener("mousedown", page._mouseDownHandler);
                delete page._mouseDownHandler;
            }
            if (page._touchStartHandler) {
                page.removeEventListener("touchstart", page._touchStartHandler);
                delete page._touchStartHandler;
            }
        });

        document.removeEventListener("mousemove", this.boundOnDrag);
        document.removeEventListener("mouseup", this.boundEndDrag);

        if (this.isTouchDevice) {
            if (this.boundTouchMoveHandler) {
                document.removeEventListener(
                    "touchmove",
                    this.boundTouchMoveHandler
                );
                delete this.boundTouchMoveHandler;
            }
            document.removeEventListener("touchend", this.boundEndDrag);
        }

        this.removeDesktopPageClicks();
    }

    setupMobileEvents() {
        this.removeMobileEvents();

        // Add touch and click events for mobile pages
        this.pages.forEach((page, index) => {
            const mobileClickHandler = (e) => {
                e.preventDefault();
                if (index === this.mobileCurrentPageIndex) {
                    // Only respond to clicks on the active page
                    this.nextPage();
                }
            };

            const mobileTouchHandler = (e) => {
                e.preventDefault();
                if (index === this.mobileCurrentPageIndex) {
                    // Only respond to touches on the active page
                    this.nextPage();
                }
            };

            page.addEventListener("click", mobileClickHandler);
            if (this.isTouchDevice) {
                page.addEventListener("touchend", mobileTouchHandler, {
                    passive: false,
                });
            }

            // Store handlers for cleanup
            page._mobileClickHandler = mobileClickHandler;
            page._mobileTouchHandler = mobileTouchHandler;
        });
    }

    removeMobileEvents() {
        this.pages.forEach((page) => {
            if (page._mobileClickHandler) {
                page.removeEventListener("click", page._mobileClickHandler);
                delete page._mobileClickHandler;
            }
            if (page._mobileTouchHandler) {
                page.removeEventListener("touchend", page._mobileTouchHandler);
                delete page._mobileTouchHandler;
            }
        });
    }

    setupDesktopPageClicks() {
        this.removeDesktopPageClicks();
        this.pages.forEach((page, index) => {
            const clickHandler = () => {
                if (!this.isDragging && !this.justFinishedDrag) {
                    this.flipPage(index);
                }
            };

            const touchHandler = (e) => {
                e.preventDefault();
                if (!this.isDragging && !this.justFinishedDrag) {
                    this.flipPage(index);
                }
            };

            // Add both click and touch handlers
            page.addEventListener("click", clickHandler);
            if (this.isTouchDevice) {
                page.addEventListener("touchend", touchHandler, {
                    passive: false,
                });
            }

            // Store handlers for cleanup
            this.desktopClickHandlers[index] = {
                click: clickHandler,
                touch: touchHandler,
            };
        });
    }

    removeDesktopPageClicks() {
        this.pages.forEach((page, index) => {
            const handlers = this.desktopClickHandlers[index];
            if (handlers) {
                page.removeEventListener("click", handlers.click);
                if (handlers.touch) {
                    page.removeEventListener("touchend", handlers.touch);
                }
            }
        });
        this.desktopClickHandlers = [];
    }

    nextPage() {
        if (this.isMobile) {
            this.nextMobilePage();
        } else {
            this.nextDesktopPage();
        }
    }

    previousPage() {
        if (this.isMobile) {
            this.prevMobilePage();
        } else {
            this.prevDesktopPage();
        }
    }

    nextMobilePage() {
        const currentPage = this.pages[this.mobileCurrentPageIndex];

        if (!this.mobileShowingBack) {
            // First click: flip to show back of current page
            this.mobileShowingBack = true;
            currentPage.classList.remove("mobile-flip-front");
            currentPage.classList.add("mobile-flip-back");
        } else {
            // Second click: slide to next page
            if (this.mobileCurrentPageIndex < this.totalPages - 1) {
                const nextPage = this.pages[this.mobileCurrentPageIndex + 1];

                // Slide current page left
                currentPage.classList.remove("mobile-active");
                currentPage.classList.add("mobile-left");

                // Bring next page from right
                nextPage.classList.remove("mobile-right");
                nextPage.classList.add("mobile-active", "mobile-flip-front");

                this.mobileCurrentPageIndex++;
                this.mobileShowingBack = false;
            }
        }

        this.updateMobileIndicator();
        this.updateMobileZIndices();
        this.updateControls();
    }

    prevMobilePage() {
        const currentPage = this.pages[this.mobileCurrentPageIndex];

        if (this.mobileShowingBack) {
            // Flip back to front of current page
            this.mobileShowingBack = false;
            currentPage.classList.remove("mobile-flip-back");
            currentPage.classList.add("mobile-flip-front");
        } else {
            // Go to previous page
            if (this.mobileCurrentPageIndex > 0) {
                const prevPage = this.pages[this.mobileCurrentPageIndex - 1];

                // Slide current page right
                currentPage.classList.remove("mobile-active");
                currentPage.classList.add("mobile-right");

                // Bring previous page from left, show its back
                prevPage.classList.remove("mobile-left");
                prevPage.classList.add("mobile-active", "mobile-flip-back");

                this.mobileCurrentPageIndex--;
                this.mobileShowingBack = true;
            }
        }

        this.updateMobileIndicator();
        this.updateMobileZIndices();
        this.updateControls();
    }

    // Desktop dragging methods
    startDrag(event, pageIndex) {
        if (this.isMobile || pageIndex >= this.totalPages) return;

        const page = this.pages[pageIndex];
        this.isDragging = false;
        this.justFinishedDrag = false;
        this.dragStartX = event.clientX || event.pageX;
        this.currentDragPage = pageIndex;
        this.dragPage = page;
        this.dragDirection = null;

        page.style.cursor = "grabbing";
    }

    drag(event) {
        if (this.isMobile || this.currentDragPage === undefined) return;

        const currentX = event.clientX || event.pageX;
        const deltaX = currentX - this.dragStartX;

        if (Math.abs(deltaX) > 10 && !this.isDragging) {
            this.isDragging = true;
            this.dragPage.classList.add("dragging");
            this.dragDirection = deltaX > 0 ? "right" : "left";
            this.updateZIndices();
        }

        if (this.isDragging) {
            const page = this.dragPage;
            const isFlipped = page.classList.contains("flipped");

            if (this.dragDirection === "left" && !isFlipped) {
                const angle = Math.max(-180, (deltaX / 200) * 180);
                page.style.transform = `rotateY(${angle}deg)`;
            } else if (this.dragDirection === "right" && isFlipped) {
                const angle = Math.min(0, -180 + (deltaX / 200) * 180);
                page.style.transform = `rotateY(${angle}deg)`;
            }
        }
    }

    endDrag() {
        if (this.isMobile || this.currentDragPage === undefined) return;

        const page = this.dragPage;
        page.style.cursor = "grab";

        if (this.isDragging) {
            this.justFinishedDrag = true;
            setTimeout(() => (this.justFinishedDrag = false), 100);

            const currentTransform = page.style.transform;
            const angle = this.extractAngle(currentTransform);
            const isFlipped = page.classList.contains("flipped");

            if (
                this.dragDirection === "left" &&
                !isFlipped &&
                angle < -this.dragThreshold
            ) {
                this.flipPageForward(this.currentDragPage);
            } else if (
                this.dragDirection === "right" &&
                isFlipped &&
                angle > -180 + this.dragThreshold
            ) {
                this.flipPageBackward(this.currentDragPage);
            } else {
                // Snap back
                page.classList.remove("dragging");
                page.style.transform = isFlipped
                    ? "rotateY(-180deg)"
                    : "rotateY(0deg)";
                setTimeout(() => {
                    if (
                        (isFlipped && page.classList.contains("flipped")) ||
                        (!isFlipped && !page.classList.contains("flipped"))
                    ) {
                        page.style.transform = "";
                    }
                }, 600);
            }
        }

        this.isDragging = false;
        this.currentDragPage = undefined;
        this.dragPage = null;
        this.updateZIndices();
    }

    extractAngle(transform) {
        const match = transform.match(/rotateY\(([^)]+)deg\)/);
        return match ? parseFloat(match[1]) : 0;
    }

    flipPage(pageIndex) {
        if (pageIndex >= this.totalPages) return;

        const page = this.pages[pageIndex];
        if (!page.classList.contains("flipped")) {
            this.flipPageForward(pageIndex);
        } else {
            this.flipPageBackward(pageIndex);
        }
    }

    flipPageForward(pageIndex) {
        const page = this.pages[pageIndex];
        page.classList.remove("dragging");
        page.style.transform = "";
        page.classList.add("flipped");
        this.updateDesktopState();
        this.playFlipSound();
    }

    flipPageBackward(pageIndex) {
        const page = this.pages[pageIndex];
        page.classList.remove("flipped", "dragging");
        page.style.transform = "";
        this.updateDesktopState();
        this.playFlipSound();
    }

    playFlipSound() {
        const audio = document.getElementById("pageFlipSound");
        if (audio) {
            try {
                audio.currentTime = 0;
                audio.play();
            } catch (error) {
                console.error("Audio play error:", error);
            }
        }
    }

    nextDesktopPage() {
        for (let i = 0; i < this.totalPages; i++) {
            if (!this.pages[i].classList.contains("flipped")) {
                this.flipPageForward(i);
                break;
            }
        }
    }

    prevDesktopPage() {
        for (let i = this.totalPages - 1; i >= 0; i--) {
            if (this.pages[i].classList.contains("flipped")) {
                this.flipPageBackward(i);
                break;
            }
        }
    }

    updateDesktopState() {
        this.currentPage = Array.from(this.pages).filter((p) =>
            p.classList.contains("flipped")
        ).length;
        this.updateControls();
        setTimeout(() => this.updateZIndices(), 50);
    }

    updateZIndices() {
        if (this.isMobile) return;

        if (this.isDragging && this.dragPage) {
            this.dragPage.style.zIndex = this.totalPages + 10;
        }

        let z = this.totalPages;
        for (let i = 0; i < this.totalPages; i++) {
            if (this.pages[i] === this.dragPage && this.isDragging) continue;

            if (this.pages[i].classList.contains("flipped")) {
                this.pages[i].style.zIndex = i + 1;
            } else {
                this.pages[i].style.zIndex = z;
                z--;
            }
        }
    }

    updateMobileZIndices() {
        // For mobile, the currently active page should be on top
        // Pages to the left go behind, pages to the right also behind in order

        const activeIndex = this.mobileCurrentPageIndex;

        this.pages.forEach((page, index) => {
            if (index === activeIndex) {
                // Active page on top
                page.style.zIndex = 1000;
            } else if (index < activeIndex) {
                // Pages to the left - lower z-index
                page.style.zIndex = index;
            } else {
                // Pages to the right - higher than left pages but below active
                page.style.zIndex = activeIndex;
            }
        });
    }

    reset() {
        if (this.isMobile) {
            this.setupMobileView();
        } else {
            const audio = document.getElementById("bookCloseSound");
            if (audio) {
                try {
                    audio.currentTime = 0;
                    audio.play();
                } catch (error) {
                    console.error("Audio play error:", error);
                }
            }
            this.setupDesktopView();
        }
        this.updateControls();
    }

    updateControls() {
        if (this.isMobile) {
            // Mobile button logic
            const isFirstView =
                this.mobileCurrentPageIndex === 0 && !this.mobileShowingBack;
            const isLastView =
                this.mobileCurrentPageIndex === this.totalPages - 1 &&
                this.mobileShowingBack;

            this.prevBtn.disabled = isFirstView;
            this.nextBtn.disabled = isLastView;
            this.resetBtn.disabled = isFirstView;
        } else {
            // Desktop button logic
            this.prevBtn.disabled = this.currentPage === 0;
            this.resetBtn.disabled = this.currentPage === 0;
            this.nextBtn.disabled = this.currentPage === this.totalPages;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new ResponsiveFlipbook();
});
