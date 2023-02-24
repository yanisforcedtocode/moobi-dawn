"use strict";
class WrapperAccordion {
    constructor(selector, openedWidth, closedWidth) {
        this.warpperElmList = document.querySelectorAll(selector);
        this.maxWidthOpened = openedWidth;
        this.maxWidthClosed = closedWidth;
        this.iniWrapperAccordion();
    }
    static logRun() {
        console.log('running');
    }
    iniWrapperAccordion() {
        if (this.warpperElmList && this.warpperElmList.length > 0) {
            this.warpperElmList.forEach((el) => {
                this.listenToElement(el, this.wrapperAccordionController.bind(this));
            });
        }
    }
    wrapperAccordionController(evt, elm) {
        const isOpened = elm.dataset.isOpened;
        if (isOpened === 'true') {
            this.closeAccordion(elm, this.maxWidthClosed);
        }
        else {
            console.log(elm);
            this.openAccordion(elm, this.maxWidthOpened);
        }
    }
    listenToElement(elm, handler) {
        elm.addEventListener('click', (evt) => {
            handler(evt, elm);
        });
    }
    openAccordion(elm, maxHeight) {
        elm.style.maxHeight = maxHeight.toString() + 'px';
        this.markOpened(elm);
    }
    closeAccordion(elm, maxHeight) {
        elm.style.maxHeight = maxHeight.toString() + 'px';
        this.markClosed(elm);
    }
    markOpened(elm) {
        elm.dataset.isOpened = "true";
    }
    markClosed(elm) {
        delete elm.dataset.isOpened;
    }
}
const descriptionWrapper = new WrapperAccordion('.product_description_wrapper', 1500, 55);
