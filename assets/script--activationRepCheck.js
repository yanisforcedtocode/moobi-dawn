"use strict";
class activationRepCheck {
    constructor(pathName, itemKey, payLoad, options) {
        this.itemKey = itemKey;
        this.targetPathName = pathName;
        this.currentDate = new Date(Date.now());
        this.msPerDay = 860400000;
        this.newPayLoadValue = JSON.stringify(payLoad);
        this.storedValue = null;
        this.storedObj = null;
        this.storedPayLoadIntact = false;
        this.newStorageObj = false;
        this.repClearance = false;
        this.matchingUrl = false;
        this.checkoutUrl = false;
        if (options) {
            this.options = options;
        }
        // init
        this.initStorageCheck();
        this.initNewStorageObj();
        this.initClearExpiredStorageObj();
    }
    // init
    initStorageCheck() {
        this.getStorageValue();
        this.readStoredObject();
        this.checkPayLoadIntact();
        this.checkRepClearance();
    }
    initNewStorageObj() {
        this.checkMatchingUrl();
        if (this.storedPayLoadIntact && !this.repClearance) {
            this.createNewStorageObject(this.returnActivationRep() + 1);
        }
        else {
            this.createNewStorageObject(1);
        }
    }
    initClearExpiredStorageObj() {
        if (this.repClearance) {
            this.createNewStorageObject(0);
            this.saveStorageObject(this.itemKey, this.newStorageObj);
        }
    }
    // read stroage object
    getStorageValue() {
        this.storedValue = localStorage.getItem(this.itemKey);
        return this.storedValue;
    }
    readStoredObject() {
        if (this.storedValue) {
            const storedObj = JSON.parse(this.storedValue);
            this.storedObj = storedObj;
            return storedObj;
        }
        else {
            return null;
        }
    }
    // checks
    checkPayLoadIntact() {
        var _a, _b, _c, _d;
        if (((_a = this.storedObj) === null || _a === void 0 ? void 0 : _a.lastActivatedDateMs) && ((_b = this.storedObj) === null || _b === void 0 ? void 0 : _b.loadRepClearanceDays) && ((_c = this.storedObj) === null || _c === void 0 ? void 0 : _c.activationRep) && ((_d = this.storedObj) === null || _d === void 0 ? void 0 : _d.pageUrl)) {
            this.storedPayLoadIntact = true;
            return true;
        }
        else {
            this.storedPayLoadIntact = false;
            return false;
        }
    }
    checkRepClearance() {
        if (this.options && this.options.activationRepClearanceDays && this.storedObj) {
            // this.checkRepClearance(this.options.activationRepClearanceDays, this.returnLastVisitMs(this.storedObj))
            const storedTime = this.returnLastVisitMs(this.storedObj);
            const elapsedTime = this.currentDate.valueOf() - storedTime;
            const clearanceDaysInterval = this.options.activationRepClearanceDays;
            if (elapsedTime > clearanceDaysInterval * this.msPerDay) {
                this.repClearance = true;
                return true;
            }
        }
    }
    checkMatchingUrl() {
        if (typeof this.targetPathName === "string") {
            return this.checkMatchingUrlString();
        }
        if (Array.isArray(this.targetPathName)) {
            return this.checkMatchingUrlArr();
        }
        else {
            return false;
        }
    }
    checkMatchingUrlString() {
        const pathName = window.location.pathname;
        if (pathName === this.targetPathName) {
            this.matchingUrl = true;
            return true;
        }
        else {
            return false;
        }
    }
    checkMatchingUrlArr() {
        const pathName = window.location.pathname;
        let matchAllStrings = [];
        for (let i = 0; i < this.targetPathName.length; i++) {
            if (pathName.includes(this.targetPathName[i])) {
                matchAllStrings.push(true);
            }
            else {
                matchAllStrings.push(false);
            }
        }
        if (matchAllStrings.includes(false) || matchAllStrings.length === 0) {
            return false;
        }
        else {
            this.matchingUrl = true;
            return true;
        }
    }
    checkIfRunRepClearance() {
        if (this.options && this.options.activationRepClearanceDays && this.storedObj) {
            return true;
        }
        else {
            return false;
        }
    }
    // write storage object
    createNewStorageObject(prevActivationRep) {
        const newObject = {
            lastActivatedDateMs: this.currentDate.valueOf(),
            pageUrl: window.location.href,
            activationRep: prevActivationRep,
            payLoad: this.newPayLoadValue,
            loadRepClearanceDays: 1
        };
        if (this.options && this.options.activationRepClearanceDays) {
            newObject.loadRepClearanceDays = this.options.activationRepClearanceDays;
        }
        this.newStorageObj = newObject;
        return newObject;
    }
    saveStorageObject(key, storageObj) {
        if (key && storageObj) {
            const serializedstorageObj = JSON.stringify(storageObj);
            localStorage.setItem(key, serializedstorageObj);
        }
    }
    // return stored object value
    returnActivationRep() {
        if (this.storedObj && this.storedObj.activationRep >= 1) {
            return this.storedObj.activationRep;
        }
        else {
            return 0;
        }
    }
    returnLastVisitMs(payLoad) {
        return payLoad.lastActivatedDateMs;
    }
    returnPageUrl(payLoad) {
        return payLoad.pageUrl;
    }
    // getters
    get validStoredObj() {
        this.initStorageCheck();
        if (this.storedPayLoadIntact) {
            return this.storedObj;
        }
        else {
            return `invalid storedObj`;
        }
    }
    get ifEverActivated() {
        if (this.storedObj) {
            const activationRep = this.storedObj.activationRep;
            if (activationRep >= 1) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
class elmClicksRepCheck extends activationRepCheck {
    constructor(triggerElmSelector, pathName, itemKey, extraTriggerElmHandlers, option) {
        super(pathName, itemKey, undefined, option);
        this.extraTriggerElmHandlers = extraTriggerElmHandlers;
        this.triggerElm = document.querySelector(triggerElmSelector);
        this.initListenToTriggerElm('click');
    }
    // inits
    initListenToTriggerElm(action) {
        const handlersArr = [];
        handlersArr.push(this.triggerElmHandler);
        if (this.extraTriggerElmHandlers) {
            this.extraTriggerElmHandlers.forEach((fn) => {
                handlersArr.push(fn);
            });
        }
        if (this.triggerElm && this.matchingUrl) {
            this.listenElement(this.triggerElm, [...handlersArr], action, [this.triggerElm]);
        }
    }
    // checks
    // handlers
    triggerElmHandler(e, triggerElm) {
        this.saveStorageObject(this.itemKey, this.newStorageObj);
    }
    // helper handlers
    listenElement(elm, handlers, action, arg) {
        elm.addEventListener(action, (e) => {
            handlers.forEach((fn) => {
                if (arg) {
                    fn.apply(this, [e, ...arg]);
                }
                else {
                    fn.apply(this, [e]);
                }
            });
        }, { passive: true });
    }
}
class pageLoadsRepCheck extends activationRepCheck {
    constructor(pathName, itemKey, option) {
        super(pathName, itemKey, undefined, option);
        this.initSaveStorageObjOnMatchingPage();
    }
    // init
    initSaveStorageObjOnMatchingPage() {
        if (this.matchingUrl) {
            this.saveStorageObject(this.itemKey, this.newStorageObj);
        }
    }
}
// const buttonRepCheck = new elmClicksRepCheck('abc', '/', 'test', undefined, {activationRepClearanceDays: 1})
// const homePageLoadCheck = new pageLoadsRepCheck('/', 'homePageLoadingRecord', {activationRepClearanceDays: 1})
