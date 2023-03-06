"use strict";
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
    constructor(producdTitle, discountItemThreshold) {
        this.noLineItemMatch = true;
        this.productTitle = producdTitle;
        this.discountItemThreshold = discountItemThreshold;
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
                this.noLineItemMatch = false;
            }
        });
    }
    matchingProductHandler(el) {
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
        if (this.productTitle && ((_a = elem.ariaLabel) === null || _a === void 0 ? void 0 : _a.includes(this.productTitle))) {
            return true;
        }
        else {
            return false;
        }
    }
    checkCartItemTitles(parsedState) {
        let mapped = parsedState.items.map((el) => {
            if (el.product_title === this.productTitle) {
                return el.key;
            }
            else {
                return false;
            }
        }).filter((el) => {
            return el !== false;
        });
        return mapped[0];
    }
    checkProductQtyOne(elem) {
        if (parseInt(elem.value) > 1) {
            return true;
        }
        else {
            return false;
        }
    }
    checkCartPriceThreshold(totalPrice) {
        if (totalPrice > this.discountItemThreshold) {
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
    static cartPageAddButtonFinallyExtHandler(_this) {
        const button = _this.submitButton;
        if (button) {
            _this.submitButton.disabled = true;
            // _this.submitButton.innerText = "added to cart"
            if (window.location.pathname.includes('/cart')) {
                window.location.reload();
            }
        }
    }
    removeDiscountItem(parsedState) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metThreshold = this.checkCartPriceThreshold(parsedState.total_price);
                const keyMap = this.checkCartItemTitles(parsedState);
                if (!metThreshold && keyMap) {
                    const res = yield moobiQueries.changeCartItem(keyMap, 0);
                    window.location.reload();
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const discountItemTitle = document.getElementById('discount_item_title').innerText;
const discountItemThreshold = parseInt(document.getElementById('discount_item_threshold').innerText);
const cartDiscount = new CartDiscountItemController(discountItemTitle, discountItemThreshold);
externalTriggerInterface.addToCartFinally = CartDiscountItemController.cartPageAddButtonFinallyExtHandler;
externalTriggerInterface.updateCartQuantity = cartDiscount.removeDiscountItem.bind(cartDiscount);
class CartDiscountPromptController {
    constructor() {
        this.promptSection = document.getElementById('custom_discount_and_shipping_policies');
        this.cartItems = document.querySelector('cart-items');
        this.wrapUpdateQuantity();
    }
    wrapUpdateQuantity() {
        const handlerCopy = this.cartItems.updateQuantity;
        const wrapperFn = (index, value, elm) => __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedStates = yield handlerCopy.apply(this.cartItems, [index, value, elm]);
                if (parsedStates) {
                    this.discountPromptHandler(parsedStates);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        this.cartItems.updateQuantity = wrapperFn;
    }
    discountPromptHandler(parsedStates) {
        this.parsedState = parsedStates;
        this.digestParsedState();
        this.getSectionInfo();
        this.freeShipHandler();
        this.specialDiscountHandler();
        this.systemDiscountHandler();
        this.totalDiscountHandler();
    }
    freeShipHandler() {
        const elm = this.getPromptBlock('[type="freeshipping_prompt_block"]');
        if (this.checkFreeShipping()) {
            if (this.checkFreeShipping() && this.promptData) {
                const message = this.promptData.free_shippingPrompt;
                this.renderMoney(elm, 0);
                if (message) {
                    this.renderPrompt(elm, message);
                }
            }
        }
        if (!this.checkFreeShipping() && this.promptData) {
            const message = this.promptData.no_free_shippingPrompt;
            this.renderMoney(elm, this.promptData.default_shippingFee / 100);
            if (message) {
                this.renderPrompt(elm, message);
            }
        }
    }
    specialDiscountHandler() {
        const elm = this.getPromptBlock('[type="specialdiscount_prompt_block"]');
        if (this.checkSave10() && this.promptData) {
            const price = this.checkSave10();
            const message = this.promptData.special_discount_Prompt;
            if (price) {
                this.renderMoney(elm, price);
            }
            if (message) {
                this.renderPrompt(elm, message);
            }
        }
        if (!this.checkSave10() && this.promptData) {
            const message = this.promptData.no_special_discount_Prompt;
            this.renderMoney(elm, 0);
            if (message) {
                this.renderPrompt(elm, message);
            }
        }
    }
    systemDiscountHandler() {
        var _a;
        const elm = this.getPromptBlock('[type="systemdiscount_prompt_block"]');
        if (this.checkSystemDiscount()) {
            const price = (_a = this.cartData) === null || _a === void 0 ? void 0 : _a.totalDiscount;
            const message = this.checkSystemDiscount();
            if (price) {
                this.renderMoney(elm, price);
            }
            if (message) {
                const string = message.join(', ');
                this.renderPrompt(elm, string);
            }
        }
        if (!this.checkSystemDiscount() && this.promptData) {
            const price = 0;
            const message = "";
            if (price) {
                this.renderMoney(elm, price);
            }
            if (message) {
                this.renderPrompt(elm, message);
            }
        }
    }
    totalDiscountHandler() {
        var _a;
        const totalDiscountP = document.getElementById('total_discount');
        let shippingDisc = 0;
        let specialDisc = 0;
        if (this.checkFreeShipping() && this.promptData) {
            shippingDisc = this.promptData.default_shippingFee / 100;
        }
        const disc = this.checkSave10();
        if (disc && this.promptData) {
            specialDisc = disc;
        }
        let systemDisc = ((_a = this.cartData) === null || _a === void 0 ? void 0 : _a.totalDiscount) || 0;
        const totalDisc = this.moneyFormater(shippingDisc + specialDisc + (systemDisc / 100));
        if (totalDiscountP) {
            totalDiscountP.innerText = totalDisc;
        }
    }
    digestParsedState() {
        if (this.parsedState) {
            const digestedState = new CartResponseInterface(this.parsedState);
            const cartData = {
                originalTotalPrice: digestedState.originalTotalPrice,
                totalPrice: digestedState.totalPrice,
                totalDiscount: digestedState.totalDiscount,
                itemCount: digestedState.itemCount,
                items: digestedState.items,
                itemSubtotalPrice: digestedState.itemSubtotalPrice,
                cart_level_discount_applications: digestedState.cart_level_discount_applications
            };
            this.cartData = cartData;
        }
    }
    getSectionInfo() {
        if (this.promptSection) {
            const promptDataSet = this.promptSection.dataset;
            const promptData = {
                save10: promptDataSet.save10,
                freeShip: promptDataSet.freeship,
                free_shippingPrompt: promptDataSet.free_shippingprompt,
                no_free_shippingPrompt: promptDataSet.no_free_shippingprompt,
                special_discount_Prompt: promptDataSet.special_discount_prompt,
                no_special_discount_Prompt: promptDataSet.no_special_discount_prompt,
                default_shippingFee: promptDataSet.default_shippingfee ? parseInt(promptDataSet.default_shippingfee) : 49,
                freeShipPrice: promptDataSet.freeshipprice ? parseInt(promptDataSet.freeshipprice) : 149,
                save10Price: promptDataSet.save10price ? parseInt(promptDataSet.save10price) : 349
            };
            this.promptData = promptData;
        }
    }
    checkFreeShipping() {
        var _a, _b, _c, _d, _e;
        if (((_a = this.promptData) === null || _a === void 0 ? void 0 : _a.freeShip) === 'true' && ((_b = this.cartData) === null || _b === void 0 ? void 0 : _b.totalPrice) && ((_c = this.promptData) === null || _c === void 0 ? void 0 : _c.default_shippingFee) && ((_d = this.cartData) === null || _d === void 0 ? void 0 : _d.totalPrice) >= ((_e = this.promptData) === null || _e === void 0 ? void 0 : _e.freeShipPrice)) {
            return (this.promptData.default_shippingFee / 100);
        }
        else {
            return false;
        }
    }
    checkSave10() {
        var _a, _b, _c, _d, _e;
        if (((_a = this.promptData) === null || _a === void 0 ? void 0 : _a.save10) === 'true' && ((_b = this.cartData) === null || _b === void 0 ? void 0 : _b.totalPrice) && ((_c = this.promptData) === null || _c === void 0 ? void 0 : _c.save10Price) && ((_d = this.cartData) === null || _d === void 0 ? void 0 : _d.totalPrice) >= ((_e = this.promptData) === null || _e === void 0 ? void 0 : _e.save10Price)) {
            return (this.cartData.totalPrice * 0.1 / 100);
        }
        else {
            return false;
        }
    }
    checkSystemDiscount() {
        var _a;
        if ((_a = this.cartData) === null || _a === void 0 ? void 0 : _a.totalDiscount) {
            return this.cartData.cart_level_discount_applications;
        }
        else {
            return false;
        }
    }
    getPromptBlock(identifier) {
        const promptBlock = document.querySelector(identifier);
        return promptBlock;
    }
    renderMoney(promptBlock, price) {
        const moneyP = promptBlock.querySelector('[type="money"]');
        moneyP.innerText = this.moneyFormater(price);
    }
    renderPrompt(promptBlock, prompt) {
        const promptP = promptBlock.querySelector('[type="discount_prompt"]');
        promptP.innerText = prompt;
    }
    moneyFormater(price) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(price);
    }
}
const discountPrompt = new CartDiscountPromptController();
