"use strict";
// 28/01/2023 by Yan yancetse@gmail.com refractor the old slider module
class HomePage_HeroBanner {
    constructor() {
        this.bannerElms = {
            sliderLeft: document.querySelector("#rectsliderleft"),
            sliderRight: document.querySelector("#rectsliderright"),
            sliderContainer: document.querySelector(".rectslider-container"),
            sliderImgs: document.querySelectorAll(".rectslider-imgs-container img"),
            sliderDotscontainer: document.querySelector(".rectsliderdots-container"),
            dots: document.querySelectorAll(".fa-circle"),
            rectslidertextboxcontainer: document.querySelector(".rectslidertextboxcontainer"),
            sliderInterval: 4500,
            textBoxContainer: document.querySelector(".rectslidertextboxcontainer")
        };
        this.rollTimeInterval = 4500;
        this.currentSliderPos = 0;
        this.touchDownClientX = 0;
        // create elms
        this.createDots();
        this.bannerElms.dots = document.querySelectorAll(".fa-circle"),
            // init
            this.initDotsClickControl();
        this.autoRollInterval = this.setAutoRollSlider();
        this.initLRClickControl();
        this.initDragControl();
        this.initMouseOverAutoSlidingControll();
    }
    // Transform elements
    // move slider
    moveRectslider(currentSliderPosition) {
        this.bannerElms.sliderImgs.forEach((el) => {
            el.style.transform = `translateX(${-100 * currentSliderPosition}%)`;
        });
    }
    // transform dot colors
    transformDots(currentSliderPosition) {
        this.bannerElms.dots.forEach((el) => {
            if (el.id === `rectsliderdot${currentSliderPosition}`) {
                el.style.color = "#FFF";
            }
            else {
                el.style.color = 'grey';
            }
        });
    }
    // set auto move slider
    setAutoRollSlider() {
        const self = this;
        let autoSliderInterval = setInterval(function () {
            if (self.currentSliderPos < self.bannerElms.sliderImgs.length - 1) {
                self.currentSliderPos += 1;
                self.moveRectslider(self.currentSliderPos);
                self.transformDots(self.currentSliderPos);
            }
            else if (self.currentSliderPos === self.bannerElms.sliderImgs.length - 1) {
                self.currentSliderPos = 0;
                self.moveRectslider(self.currentSliderPos);
                self.transformDots(self.currentSliderPos);
            }
            else {
                console.log("autoslider error");
                return;
            }
        }, self.rollTimeInterval);
        return autoSliderInterval;
    }
    stopAutoRollSlider() {
        clearInterval(this.autoRollInterval);
    }
    resumeAutoRollSlider() {
        this.autoRollInterval = this.setAutoRollSlider();
    }
    // create elements
    // create dots with the first dot to be white
    createDots() {
        for (let i = 0; i < this.bannerElms.sliderImgs.length; i++) {
            const dot = document.createElement('i');
            dot.id = `rectsliderdot${i}`;
            dot.classList.add("fas");
            dot.classList.add("fa-circle");
            this.bannerElms.sliderDotscontainer.insertAdjacentElement('beforeend', dot);
            if (i === 0) {
                dot.style.color = "#FFF";
            }
        }
    }
    // Handers
    leftHandler() {
        if (this.currentSliderPos > 0) {
            this.currentSliderPos -= 1;
        }
        else {
            return;
        }
        this.moveRectslider(this.currentSliderPos);
        this.transformDots(this.currentSliderPos);
        this.stopAutoRollSlider();
    }
    rightHandler() {
        if (this.currentSliderPos + 1 < this.bannerElms.sliderImgs.length) {
            this.currentSliderPos += 1;
        }
        else {
            return;
        }
        this.moveRectslider(this.currentSliderPos);
        this.transformDots(this.currentSliderPos);
        this.stopAutoRollSlider();
    }
    sliderTouchDownHandler(e) {
        this.touchDownClientX = e.touches[0].clientX;
        this.stopAutoRollSlider();
    }
    sliderTouchEndHandler(e) {
        const touchEndClientX = e.changedTouches[0].clientX;
        const touchDownClientX = this.touchDownClientX;
        this.stopAutoRollSlider();
        // resume auto sliding
        this.resumeAutoRollSlider();
        if (touchEndClientX < touchDownClientX &&
            this.currentSliderPos < this.bannerElms.sliderImgs.length - 1) {
            this.currentSliderPos += 1;
            this.moveRectslider(this.currentSliderPos);
            this.transformDots(this.currentSliderPos);
        }
        else if (touchEndClientX > touchDownClientX && this.currentSliderPos > 0) {
            this.currentSliderPos -= 1;
            this.moveRectslider(this.currentSliderPos);
            this.transformDots(this.currentSliderPos);
        }
        else {
            return;
        }
    }
    sliderMouseOverHandler(e) {
        this.stopAutoRollSlider();
        if (e.target && e.target instanceof HTMLElement) {
            if (e.target.dataset.linkto)
                this.currentSliderPos = parseInt(e.target.dataset.linkto);
            this.moveRectslider(this.currentSliderPos);
            this.transformDots(this.currentSliderPos);
        }
    }
    sliderMouseLeaveHandler(e) {
        this.resumeAutoRollSlider();
    }
    dotsClickController(e) {
        if (e.target && e.target instanceof HTMLElement) {
            const ind = e.target.id.slice(-1);
            this.currentSliderPos = Number.parseFloat(ind);
            this.moveRectslider(this.currentSliderPos);
            this.transformDots(this.currentSliderPos);
        }
    }
    // listen to an element
    listenElment(elm, handlers, action, arg) {
        elm.addEventListener(action, (e) => {
            handlers.forEach((fn) => {
                if (arg) {
                    console.log(arg);
                    fn.apply(this, [e, ...arg]);
                }
                else {
                    fn.apply(this, [e]);
                }
            });
        }, { passive: true });
    }
    // init
    initDragControl() {
        this.listenElment(this.bannerElms.sliderContainer, [this.sliderTouchDownHandler], 'touchstart');
        this.listenElment(this.bannerElms.sliderContainer, [this.sliderTouchEndHandler], 'touchend');
    }
    initMouseOverAutoSlidingControll() {
        this.listenElment(this.bannerElms.textBoxContainer, [this.sliderMouseOverHandler], 'mouseover');
        this.listenElment(this.bannerElms.textBoxContainer, [this.sliderMouseLeaveHandler], 'mouseleave');
    }
    initLRClickControl() {
        this.listenElment(this.bannerElms.sliderLeft, [this.leftHandler], 'click');
        this.listenElment(this.bannerElms.sliderRight, [this.rightHandler], 'click');
    }
    initDotsClickControl() {
        this.bannerElms.dots.forEach((el) => {
            this.listenElment(el, [this.dotsClickController], 'click');
        });
    }
}
const heroBannerControllers = new HomePage_HeroBanner();
