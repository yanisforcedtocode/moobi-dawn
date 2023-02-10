"use strict";
class WorkOnFirstPurchaseCloseRepCheck {
    constructor() {
        // checks
        this.checkIfEverActivated = () => {
            const activationState = this.elmClickCheckInstance.ifEverActivated;
            this.ifEverActivated = activationState;
            return activationState;
        };
        // check banner style
        this.showfirstPurchaseSection = () => {
            const banner = this.firstPurchaseBanner;
            if (banner) {
                setTimeout(() => {
                    banner.style.display = 'block';
                    banner.classList.add('firstPurchaseBannerAppears');
                }, 1200);
            }
        };
        this.closefirstPurchaseSection = () => {
            const banner = this.firstPurchaseBanner;
            if (banner) {
                banner.classList.remove('firstPurchaseBannerAppears');
            }
        };
        this.displayNonefirstPurchaseSection = () => {
            if (this.firstPurchaseBanner) {
                // this.firstPurchaseBanner.style.opacity = '0%'
                this.firstPurchaseBanner.style.display = 'none';
            }
        };
        const firstPurchaseCloseRepCheck = new elmClicksRepCheck('#firstPurchasePromptBanner__section__closeBtn', ['/'], 'firstPurchaseCloseRep', [this.closefirstPurchaseSection], { activationRepClearanceDays: 1 });
        this.elmClickCheckInstance = firstPurchaseCloseRepCheck;
        this.firstPurchaseBanner = document.querySelector('.firstPurchasePromptBanner__section');
        this.ifEverActivated = true;
        this.initWorkOnFirstPurchaseCloseRepCheck();
    }
    initWorkOnFirstPurchaseCloseRepCheck() {
        // get ifEverActivated
        this.ifEverActivated = this.checkIfEverActivated();
        // if true => turn banner off
        if (this.ifEverActivated) {
            this.displayNonefirstPurchaseSection();
        }
        // if false => turn banner on
        if (!this.ifEverActivated) {
            this.showfirstPurchaseSection();
        }
    }
}
const workOnFirstPurchaseCloseRepCheck = new WorkOnFirstPurchaseCloseRepCheck();
