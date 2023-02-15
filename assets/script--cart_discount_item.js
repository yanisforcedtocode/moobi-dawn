"use strict";
// if the line-item name matches => disable quantity input and quantity buttons, 
// plus a color change
// if quantity > 1 => change to 1
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CartDiscountItemController {
    constructor(producdTitle) {
        this.noLineItemMatch = true;
        this.productTitle = producdTitle;
        this.quantity__inputs = this.returnInputsFromDOM();
        this.buttonClass = "quantity__button";
        this.addedToCart = "Discount item redeemed";
        this.initDiscountItem();
    }
    initDiscountItem() {
        if (!this.checkLineItemLength(this.quantity__inputs)) {
            return;
        }
        this.quantity__inputs.forEach((el) => {
            if (this.checkProductTitle(el)) {
                this.matchingProductHandler(el);
                this.noLineItemMatch = false;
            }
        });
        if (this.noLineItemMatch) {
            this.enableAddButton();
        }
    }
    matchingProductHandler(el) {
        console.log('matching');
        this.changeElmBackground(el);
        this.disableSideButtons(el);
        this.disableAddButton();
        if (this.checkProductQtyOne(el)) {
            this.moreThanOneQtyHandler(el);
        }
    }
    moreThanOneQtyHandler(el) {
        return __awaiter(this, void 0, void 0, function* () {
            el.value = '1';
            const elIndex = parseInt(el.dataset.index);
            yield this.updateCartItem(el, elIndex);
            this.updateInputsElm();
            this.disableElement(this.quantity__inputs[elIndex - 1]);
            this.changeElmBackground(this.quantity__inputs[elIndex - 1]);
            this.disableSideButtons(this.quantity__inputs[elIndex - 1]);
        });
    }
    updateCartItem(el, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = document.activeElement ? document.activeElement.getAttribute('name') : null;
            const cartItem = el.closest('cart-items');
            const elIndex = el.dataset.index;
            yield cartItem.updateQuantity(elIndex, 1, name);
        });
    }
    checkLineItemLength(quantity__inputs) {
        if (this.quantity__inputs && this.quantity__inputs.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    checkProductTitle(elem) {
        var _a;
        if ((_a = elem.ariaLabel) === null || _a === void 0 ? void 0 : _a.includes(this.productTitle)) {
            return true;
        }
        else {
            return false;
        }
    }
    checkProductQtyOne(elem) {
        if (parseInt(elem.value) > 1) {
            return true;
        }
        else {
            return false;
        }
    }
    enableAddButton() {
        const addButton = document.querySelector('[name="add"]');
        if (addButton) {
            addButton.disabled = false;
        }
    }
    disableSideButtons(el) {
        const parent = el.parentElement;
        const buttons = parent.querySelectorAll(`.${this.buttonClass}`);
        buttons.forEach((el_1) => {
            this.disableElement(el_1);
            this.changeElmBackground(el_1);
        });
    }
    disableAddButton() {
        const addButton = document.querySelector('[name="add"]');
        if (addButton) {
            this.disableElement(addButton);
            addButton.innerText = this.addedToCart;
        }
    }
    disableElement(elem) {
        elem.disabled = true;
    }
    changeElmBackground(elem, color) {
        elem.style.background = '#f3f3f3';
        if (color) {
            elem.style.background = color;
        }
    }
    returnInputsFromDOM() {
        const inputs = document.querySelectorAll('.quantity__input');
        return inputs;
    }
    updateInputsElm() {
        this.quantity__inputs = this.returnInputsFromDOM();
    }
}
const cartDiscountController = new CartDiscountItemController('雨敵 玻璃清潔噴劑 GLACO Windscreen Glass De Cleaner');
class CartDiscountPromptController {
    // wrap external functions to cartItem.updateQuantity
    // original cartItem.updateQuantity parsedstate
    // use new CartResponseInterface(parsedstate) to get relevant information
    // get all the sections to render
    // get all the strings from data-set
    // calculation
    // render
    // return
    constructor() {
        this.wrapUpdateQuantity();
    }
    wrapUpdateQuantity() {
        let cartItems = document.querySelector('cart-items');
        const handlerCopy = cartItems.updateQuantity;
        const wrapperFn = ([arg]) => __awaiter(this, void 0, void 0, function* () {
            const parsedStates = yield handlerCopy([arg]);
            // externalTriggerInterface.updateQuantity(parsedStates)
            console.log('do sth');
        });
        cartItems.updateQuantity = wrapperFn;
    }
    discountPromptHandler(parsedState) {
        const digestedState = new CartResponseInterface(parsedState);
    }
}
const discountPrompt = new CartDiscountPromptController();
