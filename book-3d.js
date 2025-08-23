class ResponsiveFlipBook {
    constructor(container) {
        this.container = container; // Store the specific flip-book-container
        this.pages = container.querySelectorAll(".page");
        this.totalPages = this.pages.length;

        this.isDragging = false;
        this.dragStartX = 0;
        this.dragThreshold = 50;

        // Zoom state
        this.isZoomMode = false;
        this.zoomScale = 1;
        this.panX = 0;
        this.panY = 0;
        this.minZoom = 1;
        this.maxZoom = 3;
        this.zoomStep = 0.2;
        this.isPanning = false;
        this.panStartX = 0;
        this.panStartY = 0;

        // Only phones are mobile, tablets and desktop use dragging
        this.isMobile = window.innerWidth <= 960;

        // Detect if device supports touch
        this.isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        // Mobile state
        this.mobileCurrentPageIndex = 0;
        this.mobileShowingBack = false;
        this.totalMobileViews = this.totalPages * 2; // front and back of each page

        // Desktop state
        this.currentPage = 0;
        this.isAnimating = false; // Prevent dragging during button animations

        // Control buttons within the specific container
        this.prevBtns = container.querySelectorAll("#bookPrevBtn");
        this.nextBtns = container.querySelectorAll("#bookNextBtn");
        this.resetBtns = container.querySelectorAll("#bookResetBtn");
        this.zoomBtn = container.querySelector("#bookZoomBtn");
        this.zoomControls = container.querySelectorAll("#zoomControls");
        this.zoomInBtns = container.querySelectorAll("#zoomInBtn");
        this.zoomOutBtns = container.querySelectorAll("#zoomOutBtn");
        this.resetZoomBtns = container.querySelectorAll("#resetZoomBtn");
        this.zoomLevels = container.querySelectorAll("#zoomLevel");

        // Bind handlers
        this.boundOnPan = (e) => this.pan(e);
        this.boundEndPan = () => this.endPan();
        this.boundOnDrag = (e) => this.drag(e);
        this.boundEndDrag = () => this.endDrag();
        this.boundTouchMove = (e) => {
            if (this.isZoomMode && this.isPanning) {
                e.preventDefault();
                this.pan(e.touches[0]);
            } else if (this.currentDragPage !== undefined) {
                e.preventDefault();
                this.drag(e.touches[0]);
            }
        };
        this.boundTouchEnd = () => {
            if (this.isZoomMode && this.isPanning) {
                this.endPan();
            } else {
                this.boundEndDrag();
            }
        };
        this.desktopClickHandlers = [];

        this.init();
        this.updateResponsiveDisplay();

        window.addEventListener("resize", () => this.handleResize());
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 960;

        if (wasMobile !== this.isMobile) {
            this.reset();
            this.updateResponsiveDisplay();
        }
    }

    updateResponsiveDisplay() {
        const desktopTexts = this.container.querySelectorAll(".desktop-text");
        const mobileTexts = this.container.querySelectorAll(".mobile-text");

        if (this.isMobile) {
            desktopTexts.forEach((el) => (el.style.display = "none"));
            mobileTexts.forEach((el) => (el.style.display = "inline"));
            this.setupMobileView();
        } else {
            desktopTexts.forEach((el) => (el.style.display = "inline"));
            mobileTexts.forEach((el) => (el.style.display = "none"));
            this.setupDesktopView();
            this.removeMobileEvents();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupZoomEventListeners();
        this.updateControls();
    }

    setupMobileView() {
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
        this.updateMobileZIndices();

        this.removeDesktopEvents();
        if (!this.isZoomMode) {
            this.setupMobileEvents();
        }
    }

    setupDesktopView() {
        this.pages.forEach((page, index) => {
            page.classList.remove(
                "mobile-active",
                "mobile-left",
                "mobile-right",
                "mobile-flip-front",
                "mobile-flip-back",
                "flipped"
            );
            page.style.transform = "";
            page.style.zIndex = "";
        });

        this.currentPage = 0;
        this.updateZIndices();
        this.removeMobileEvents();
        if (!this.isZoomMode) {
            this.setupDesktopEvents();
        }
        this.updateDesktopIndicator();
    }

    updateDesktopIndicator() {
        const currentPageNum = this.container.querySelector("#currentPageNum");
        const totalPageNum = this.container.querySelector("#totalPageNum");

        if (currentPageNum && totalPageNum) {
            let visualPageText;
            let totalVisualPages;

            if (this.currentPage === 0) {
                visualPageText = "1";
            } else if (this.currentPage === this.totalPages) {
                visualPageText = this.totalPages * 2;
            } else {
                const leftPage = this.currentPage * 2;
                const rightPage = leftPage + 1;
                visualPageText = `${leftPage}-${rightPage}`;
            }

            totalVisualPages = this.totalPages * 2;
            currentPageNum.textContent = visualPageText;
            totalPageNum.textContent = totalVisualPages;
        }
    }

    updateMobileIndicator() {
        const currentPageNum = this.container.querySelector("#currentPageNum");
        const totalPageNum = this.container.querySelector("#totalPageNum");

        if (currentPageNum && totalPageNum) {
            const visualPage =
                this.mobileCurrentPageIndex * 2 +
                (this.mobileShowingBack ? 2 : 1);
            currentPageNum.textContent = visualPage;
            totalPageNum.textContent = this.totalMobileViews;
        }
    }

    setupEventListeners() {
        this.prevBtns.forEach((btn) =>
            btn.addEventListener("click", () => this.previousPage())
        );
        this.nextBtns.forEach((btn) =>
            btn.addEventListener("click", () => this.nextPage())
        );
        this.resetBtns.forEach((btn) =>
            btn.addEventListener("click", () => this.reset())
        );

        // Prevent context menu on pages within this container
        this.container.addEventListener("contextmenu", (e) => {
            if (e.target.closest(".page")) {
                e.preventDefault();
            }
        });
    }

    setupDesktopEvents() {
        this.removeDesktopEvents();

        this.pages.forEach((page, index) => {
            page.style.cursor = "grab";

            const mouseDownHandler = (e) => this.startDrag(e, index);
            page.addEventListener("mousedown", mouseDownHandler);

            if (this.isTouchDevice) {
                const touchStartHandler = (e) => {
                    e.preventDefault();
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

        this.container.addEventListener("mousemove", this.boundOnDrag);
        this.container.addEventListener("mouseup", this.boundEndDrag);

        if (this.isTouchDevice) {
            this.boundTouchMoveHandler = (e) => {
                if (this.isDragging) {
                    e.preventDefault();
                    this.drag(e.touches[0]);
                }
            };

            this.container.addEventListener("touchmove", this.boundTouchMoveHandler, {
                passive: false,
            });
            this.container.addEventListener("touchend", this.boundEndDrag);
        }

        this.setupDesktopPageClicks();
    }

    removeDesktopEvents() {
        this.pages.forEach((page) => {
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

        this.container.removeEventListener("mousemove", this.boundOnDrag);
        this.container.removeEventListener("mouseup", this.boundEndDrag);

        if (this.isTouchDevice) {
            if (this.boundTouchMoveHandler) {
                this.container.removeEventListener(
                    "touchmove",
                    this.boundTouchMoveHandler
                );
                delete this.boundTouchMoveHandler;
            }
            this.container.removeEventListener("touchend", this.boundEndDrag);
        }

        this.removeDesktopPageClicks();
    }

    setupMobileEvents() {
        this.removeMobileEvents();

        this.pages.forEach((page, index) => {
            const mobileClickHandler = (e) => {
                e.preventDefault();
                if (index === this.mobileCurrentPageIndex) {
                    this.nextPage();
                }
            };

            const mobileTouchHandler = (e) => {
                e.preventDefault();
                if (index === this.mobileCurrentPageIndex) {
                    this.nextPage();
                }
            };

            page.addEventListener("click", mobileClickHandler);
            if (this.isTouchDevice) {
                page.addEventListener("touchend", mobileTouchHandler, {
                    passive: false,
                });
            }

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

            page.addEventListener("click", clickHandler);
            if (this.isTouchDevice) {
                page.addEventListener("touchend", touchHandler, {
                    passive: false,
                });
            }

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
            this.mobileShowingBack = true;
            currentPage.classList.remove("mobile-flip-front");
            currentPage.classList.add("mobile-flip-back");
            this.playFlipSound();
        } else {
            if (this.mobileCurrentPageIndex < this.totalPages - 1) {
                const nextPage = this.pages[this.mobileCurrentPageIndex + 1];
                currentPage.classList.remove(
                    "mobile-active",
                    "mobile-flip-back"
                );
                currentPage.classList.add("mobile-left");
                nextPage.classList.remove("mobile-right");
                nextPage.classList.add("mobile-active", "mobile-flip-front");
                this.mobileCurrentPageIndex++;
                this.mobileShowingBack = false;
                this.playFlipSound();
            }
        }

        this.updateMobileIndicator();
        this.updateMobileZIndices();
        this.updateControls();
    }

    prevMobilePage() {
        const currentPage = this.pages[this.mobileCurrentPageIndex];

        if (this.mobileShowingBack) {
            this.mobileShowingBack = false;
            currentPage.classList.remove("mobile-flip-back");
            currentPage.classList.add("mobile-flip-front");
            this.playFlipSound();
        } else {
            if (this.mobileCurrentPageIndex > 0) {
                const prevPage = this.pages[this.mobileCurrentPageIndex - 1];
                currentPage.classList.remove(
                    "mobile-active",
                    "mobile-flip-front"
                );
                currentPage.classList.add("mobile-right");
                prevPage.classList.remove("mobile-left");
                prevPage.classList.add("mobile-active", "mobile-flip-back");
                this.mobileCurrentPageIndex--;
                this.mobileShowingBack = true;
                this.playFlipSound();
            }
        }

        this.updateMobileIndicator();
        this.updateMobileZIndices();
        this.updateControls();
    }

    startDrag(event, pageIndex) {
        if (this.isMobile || pageIndex >= this.totalPages || this.isAnimating)
            return;

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
        if (
            this.isMobile ||
            this.currentDragPage === undefined ||
            this.isAnimating
        )
            return;

        const currentX = event.clientX || event.pageX;
        const deltaX = currentX - this.dragStartX;

        if (Math.abs(deltaX) > 10 && !this.isDragging) {
            this.isDragging = true;
            this.dragDirection = deltaX > 0 ? "right" : "left";
            this.updateZIndices();
        }

        if (this.isDragging) {
            const page = this.dragPage;
            const isFlipped = page.classList.contains("flipped");

            if (this.dragDirection === "left" && !isFlipped) {
                const angle = Math.max(-180, (deltaX / 200) * 180);
                this.applyBendingTransform(page, angle);
            } else if (this.dragDirection === "right" && isFlipped) {
                const angle = Math.min(0, -180 + (deltaX / 200) * 180);
                this.applyBendingTransform(page, angle);
            }
        }
    }

    applyBendingTransform(page, rotationAngle) {
        const normalizedAngle = Math.abs(rotationAngle) / 180;
        const bendAmount = Math.sin(normalizedAngle * Math.PI) * 30;

        if (Math.abs(rotationAngle) > 10 && Math.abs(rotationAngle) < 170) {
            if (rotationAngle < -90) {
                page.style.borderRadius = `0 ${bendAmount}px ${bendAmount}px 0`;
            } else {
                page.style.borderRadius = `${bendAmount}px 0 0 ${bendAmount}px`;
            }
        } else {
            page.style.borderRadius = "";
        }

        page.style.transform = `perspective(1000px) rotateY(${rotationAngle}deg)`;
    }

    endDrag() {
        if (
            this.isMobile ||
            this.currentDragPage === undefined ||
            this.isAnimating
        )
            return;

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
                this.flipPageForwardDrag(this.currentDragPage);
            } else if (
                this.dragDirection === "right" &&
                isFlipped &&
                angle > -180 + this.dragThreshold
            ) {
                this.flipPageBackwardDrag(this.currentDragPage);
            } else {
                this.snapBackWithBending(page, isFlipped);
            }
        }

        this.isDragging = false;
        this.currentDragPage = undefined;
        this.dragPage = null;
        this.updateZIndices();
    }

    setupZoomEventListeners() {
        // Scope button listeners to the specific container
        this.container.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;

            if (btn.id === "bookZoomBtn") {
                this.toggleZoomMode();
            } else if (btn.id === "zoomInBtn") {
                this.zoomIn();
            } else if (btn.id === "zoomOutBtn") {
                this.zoomOut();
            } else if (btn.id === "resetZoomBtn") {
                this.resetZoom();
            }
        });
    }

    toggleZoomMode() {
        this.isZoomMode = !this.isZoomMode;

        const zoomBtns = this.container.querySelectorAll("#bookZoomBtn");
        const controlBlocks = this.container.querySelectorAll("#zoomControls");

        if (this.isZoomMode) {
            zoomBtns.forEach((b) => {
                b.textContent = "Exit Zoom";
                b.classList.add("zoom-active");
            });
            controlBlocks.forEach((c) => c.classList.add("active"));
            this.enableZoomMode();
        } else {
            zoomBtns.forEach((b) => {
                b.textContent = "Zoom";
                b.classList.remove("zoom-active");
            });
            controlBlocks.forEach((c) => c.classList.remove("active"));
            this.disableZoomMode();
        }
    }

    enableZoomMode() {
        this.removeDesktopEvents();
        this.removeMobileEvents();

        this.pages.forEach((page) => {
            page.classList.add("zoom-mode");
        });

        this.setupZoomInteractions();
        this.updateZoomTransform();
    }

    disableZoomMode() {
        this.resetZoom();
        this.pages.forEach((page) => {
            page.classList.remove("zoom-mode");
        });

        const zoomWrappers = this.container.querySelectorAll(".zoom-wrapper");
        zoomWrappers.forEach((wrapper) => {
            wrapper.style.setProperty("--zoom-scale", "1");
            wrapper.style.setProperty("--pan-x", "0px");
            wrapper.style.setProperty("--pan-y", "0px");
        });

        if (this.isMobile) {
            this.setupMobileEvents();
        } else {
            this.setupDesktopEvents();
        }

        this.removeZoomInteractions();
    }

    setupZoomInteractions() {
        this.pages.forEach((page) => {
            const mouseDownHandler = (e) => {
                if (!this.isZoomMode) return;
                this.startPan(e);
            };
            page.addEventListener("mousedown", mouseDownHandler);

            if (this.isTouchDevice) {
                const touchStartHandler = (e) => {
                    if (!this.isZoomMode) return;
                    e.preventDefault();
                    this.startPan(e.touches[0]);
                };
                page.addEventListener("touchstart", touchStartHandler, {
                    passive: false,
                });
                page._zoomTouchStartHandler = touchStartHandler;
            }

            page._zoomMouseDownHandler = mouseDownHandler;
        });

        this.container.addEventListener("mousemove", this.boundOnPan);
        this.container.addEventListener("mouseup", this.boundEndPan);

        if (this.isTouchDevice) {
            this.container.addEventListener("touchmove", this.boundTouchMove, {
                passive: false,
            });
            this.container.addEventListener("touchend", this.boundTouchEnd);
        }
    }

    removeZoomInteractions() {
        this.pages.forEach((page) => {
            if (page._zoomMouseDownHandler) {
                page.removeEventListener(
                    "mousedown",
                    page._zoomMouseDownHandler
                );
                delete page._zoomMouseDownHandler;
            }
            if (page._zoomTouchStartHandler) {
                page.removeEventListener(
                    "touchstart",
                    page._zoomTouchStartHandler
                );
                delete page._zoomTouchStartHandler;
            }
        });

        this.container.removeEventListener("mousemove", this.boundOnPan);
        this.container.removeEventListener("mouseup", this.boundEndPan);

        if (this.isTouchDevice) {
            this.container.removeEventListener("touchmove", this.boundTouchMove);
            this.container.removeEventListener("touchend", this.boundTouchEnd);
        }
    }

    startPan(event) {
        if (!this.isZoomMode) return;

        this.isPanning = true;
        this.panStartX = (event.clientX || event.pageX) - this.panX;
        this.panStartY = (event.clientY || event.pageY) - this.panY;

        this.pages.forEach((page) => {
            page.style.cursor = "grabbing";
        });
    }

    pan(event) {
        if (!this.isZoomMode || !this.isPanning) return;

        const currentX = event.clientX || event.pageX;
        const currentY = event.clientY || event.pageY;

        const newPanX = currentX - this.panStartX;
        const newPanY = currentY - this.panStartY;

        const container = this.container.querySelector(".flip-book-container");
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const maxPanX = (containerWidth * (this.zoomScale - 1)) / 2;
        const maxPanY = (containerHeight * (this.zoomScale - 1)) / 2;

        this.panX = Math.max(-maxPanX, Math.min(maxPanX, newPanX));
        this.panY = Math.max(-maxPanY, Math.min(maxPanY, newPanY));

        this.updateZoomTransform();
    }

    endPan() {
        if (!this.isZoomMode) return;

        this.isPanning = false;
        this.pages.forEach((page) => {
            page.style.cursor = "move";
        });
    }

    zoomIn() {
        if (this.zoomScale < this.maxZoom) {
            this.zoomScale = Math.min(
                this.maxZoom,
                this.zoomScale + this.zoomStep
            );
            this.updateZoomTransform();
            this.updateZoomLevel();
        }
    }

    zoomOut() {
        if (this.zoomScale > this.minZoom) {
            this.zoomScale = Math.max(
                this.minZoom,
                this.zoomScale - this.zoomStep
            );

            const container = this.container.querySelector(".flip-book-container");
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            const maxPanX = (containerWidth * (this.zoomScale - 1)) / 2;
            const maxPanY = (containerHeight * (this.zoomScale - 1)) / 2;

            this.panX = Math.max(-maxPanX, Math.min(maxPanX, this.panX));
            this.panY = Math.max(-maxPanY, Math.min(maxPanY, this.panY));

            this.updateZoomTransform();
            this.updateZoomLevel();
        }
    }

    resetZoom() {
        this.zoomScale = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateZoomTransform();
        this.updateZoomLevel();
    }

    updateZoomTransform() {
        const zoomWrappers = this.container.querySelectorAll(".zoom-wrapper");
        zoomWrappers.forEach((wrapper) => {
            wrapper.style.setProperty("--zoom-scale", this.zoomScale);
            wrapper.style.setProperty("--pan-x", `${this.panX}px`);
            wrapper.style.setProperty("--pan-y", `${this.panY}px`);
        });
    }

    updateZoomLevel() {
        const pct = `${Math.round(this.zoomScale * 100)}%`;
        this.zoomLevels.forEach((el) => {
            el.textContent = pct;
        });
    }

    snapBackWithBending(page, isFlipped) {
        page.style.borderRadius = "";
        page.style.transition = "transform 0.3s ease";
        page.style.transform = isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)";

        setTimeout(() => {
            page.style.transition = "";
            if (
                (isFlipped && page.classList.contains("flipped")) ||
                (!isFlipped && !page.classList.contains("flipped"))
            ) {
                page.style.transform = "";
            }
        }, 300);
    }

    extractAngle(transform) {
        const match = transform.match(/rotateY\(([^)]+)deg\)/);
        return match ? parseFloat(match[1]) : 0;
    }

    flipPage(pageIndex) {
        if (pageIndex >= this.totalPages || this.isAnimating) return;

        const page = this.pages[pageIndex];
        if (!page.classList.contains("flipped")) {
            this.flipPageForward(pageIndex);
        } else {
            this.flipPageBackward(pageIndex);
        }
    }

    flipPageForward(pageIndex) {
        const page = this.pages[pageIndex];
        this.animatePageFlipWithBending(page, 0, -180, () => {
            page.classList.add("flipped");
            this.updateDesktopState();
            this.playFlipSound();
        });
    }

    flipPageBackward(pageIndex) {
        const page = this.pages[pageIndex];
        this.animatePageFlipWithBending(page, -180, 0, () => {
            page.classList.remove("flipped");
            this.updateDesktopState();
            this.playFlipSound();
        });
    }

    flipPageForwardDrag(pageIndex) {
        const page = this.pages[pageIndex];
        page.style.borderRadius = "";
        page.style.transform = "";
        page.style.transition = "";
        page.classList.add("flipped");
        this.updateDesktopState();
        this.playFlipSound();
    }

    flipPageBackwardDrag(pageIndex) {
        const page = this.pages[pageIndex];
        page.style.borderRadius = "";
        page.style.transform = "";
        page.style.transition = "";
        page.classList.remove("flipped");
        this.updateDesktopState();
        this.playFlipSound();
    }

    animatePageFlipWithBending(page, startAngle, endAngle, onComplete) {
        const duration = 600;
        const startTime = performance.now();
        this.isAnimating = true;
        const originalTransition = page.style.transition;
        page.style.transition = "none";
        this.applyBendingTransform(page, startAngle);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress =
                progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;
            const currentAngle =
                startAngle + (endAngle - startAngle) * easeProgress;
            this.applyBendingTransform(page, currentAngle);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                page.style.borderRadius = "";
                page.style.transform = "";
                page.style.transition = originalTransition;
                this.isAnimating = false;
                if (onComplete) {
                    onComplete();
                }
            }
        };

        requestAnimationFrame(animate);
    }

    playFlipSound() {
        const audio = document.getElementById("pageFlipSound");
        if (audio) {
            try {
                setTimeout(() => {
                    audio.currentTime = 0;
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch((error) => {
                            console.error("Audio play error:", error);
                        });
                    }
                }, 10);
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
        this.updateDesktopIndicator();
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
        const activeIndex = this.mobileCurrentPageIndex;

        this.pages.forEach((page, index) => {
            if (index === activeIndex) {
                page.style.zIndex = 1000;
            } else if (index < activeIndex) {
                page.style.zIndex = 100 + index;
            } else {
                page.style.zIndex = 200 + index;
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
            const isFirstView =
                this.mobileCurrentPageIndex === 0 && !this.mobileShowingBack;
            const isLastView =
                this.mobileCurrentPageIndex === this.totalPages - 1 &&
                this.mobileShowingBack;

            this.prevBtns.forEach((b) => (b.disabled = isFirstView));
            this.nextBtns.forEach((b) => (b.disabled = isLastView));
            this.resetBtns.forEach((b) => (b.disabled = isFirstView));
        } else {
            this.prevBtns.forEach((b) => (b.disabled = this.currentPage === 0));
            this.resetBtns.forEach(
                (b) => (b.disabled = this.currentPage === 0)
            );
            this.nextBtns.forEach(
                (b) => (b.disabled = this.currentPage === this.totalPages)
            );
        }
    }
}

// Initialize for each flip-book-container
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".book-container-3d").forEach((container) => {
        new ResponsiveFlipBook(container);
    });
});