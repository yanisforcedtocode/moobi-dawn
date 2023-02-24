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
class Collection_list_controller {
    constructor() {
        this.collectionCardNode = document.querySelectorAll('.collection_brand_card');
        this.collectionTitle = document.getElementById('collection_card_title');
        this.collectionDescription = document.getElementById('collection_card_description');
        this.collectionButton = document.getElementById('collection_button');
        this.collectionImage = document.getElementById('collection_card_image');
        this.productCardNode = document.querySelectorAll('.product_card');
        this.brandCardNode = document.querySelectorAll('.collection_brand_card_content');
        this.widthTheshold = 780;
        this.initCollectionControl();
    }
    // init
    initCollectionControl() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.checkScreenWidth(this.widthTheshold)) {
                return;
            }
            this.ListenToBrandCards(this.brandCardHandler.bind(this));
        });
    }
    // Set EventListener
    ListenToBrandCards(brandCardHandler) {
        this.brandCardNode.forEach((el) => {
            el.addEventListener('click', (event) => {
                event.preventDefault();
                if (event.target && event.target instanceof HTMLElement) {
                    const brandCard = event.target.closest('.collection_brand_card');
                    if (brandCard && brandCard instanceof HTMLElement) {
                        this.brandCardHandler(event, brandCard);
                    }
                }
            });
        });
    }
    // Handler
    brandCardHandler(event, brandCard) {
        const collectionId = this.getCollectionId(brandCard);
        const cardDataArray = this.getProductMetaInfo(collectionId);
        const brandData = this.getBrandMetaInfo(collectionId);
        this.renderProductCard(cardDataArray);
        this.renderCollectionCard(brandData);
    }
    // checks
    checkScreenWidth(threshold) {
        if (window.screen.width >= threshold) {
            return true;
        }
        else {
            return false;
        }
    }
    // DOM manipulation
    getCollectionId(brandCard) {
        const collectionId = brandCard.dataset.collectionid;
        return collectionId;
    }
    getProductMetaInfo(collectionId) {
        const metaElm = document.querySelector(`[collectionid="${collectionId}"]`);
        const metaData = metaElm.innerHTML;
        return JSON.parse(metaData);
    }
    getBrandMetaInfo(collectionId) {
        const metaElm = document.querySelector(`[collectionid="${collectionId}"]`);
        const title = metaElm.dataset.title;
        const image = metaElm.dataset.image;
        const handle = metaElm.dataset.handle;
        const description = metaElm.dataset.description;
        return { title, image, handle, description };
    }
    getProductCardElementObject(product_card) {
        const titleElm = product_card.querySelector('.product_card_title');
        const priceElm = product_card.querySelector('.product_card_price');
        const compared_at_priceElm = product_card.querySelector('.product_card_comparedAtPrice');
        const linkElm = product_card.querySelector('a');
        const imageElm = product_card.querySelector('img');
        const productCard = titleElm.closest('.product_card');
        const elementArray = { productCard, titleElm, priceElm, compared_at_priceElm, linkElm, imageElm };
        return elementArray;
    }
    loadingImage(elm) {
        if (Array.isArray(elm)) {
            elm.forEach((el) => {
                el.src = "";
                el.classList.add('imageSkeleton');
            });
        }
        else {
            elm.src = "";
            elm.classList.add('imageSkeleton');
        }
    }
    renderProductCard(productDataArray) {
        this.productCardNode.forEach((elm, ind) => {
            const elementObj = this.getProductCardElementObject(elm);
            if (productDataArray[ind]) {
                elementObj.productCard.style.display = "block";
                elementObj.titleElm.innerText = productDataArray[ind].title;
                elementObj.priceElm.innerText = productDataArray[ind].price;
                elementObj.compared_at_priceElm.innerText = "";
                const compared_at_price = productDataArray[ind].compared_at_price;
                if (compared_at_price) {
                    elementObj.compared_at_priceElm.innerText = compared_at_price;
                }
                elementObj.linkElm.href = `/products/${productDataArray[ind].handle}`;
                this.loadingImage(elementObj.imageElm);
                elementObj.imageElm.src = productDataArray[ind].img;
            }
            else {
                elementObj.titleElm.innerText = "";
                elementObj.priceElm.innerText = "";
                elementObj.compared_at_priceElm.innerText = "";
                elementObj.compared_at_priceElm.innerText = "";
                elementObj.linkElm.href = "";
                elementObj.imageElm.src = "";
                elementObj.productCard.style.display = "none";
            }
        });
    }
    renderCollectionCard(brandData) {
        this.loadingImage(this.collectionImage);
        this.collectionTitle.innerText = brandData.title;
        this.collectionDescription.innerText = brandData.description;
        this.collectionButton.href = `/collections/${brandData.handle}`;
        this.collectionButton.innerText = `進入${brandData.title}總目錄`;
        this.collectionTitle.innerText = brandData.title;
        this.collectionImage.src = brandData.image;
    }
}
const collection_list_controller = new Collection_list_controller();
