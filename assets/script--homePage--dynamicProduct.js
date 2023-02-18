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
class GetProductListfromLog {
    constructor() {
        this.initState = {
            key: 'moobiPdtLog',
        };
    }
    initProductListfromLog() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.getTopProductInfo();
                if (this.topProductData) {
                    const suggestedProductList = yield moobiQueries.getPdtLists(this.topProductData.tags);
                    return suggestedProductList;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    // handlers
    getTopProductInfo() {
        const localObj = this.readLocal();
        if (localObj) {
            const topProductKey = this.getTopProductKey(localObj);
            const topProductData = this.getIdHandleTags(topProductKey);
            this.topProductData = topProductData;
            return topProductData;
        }
        else {
            return false;
        }
    }
    // read local storage by key and return the JSON string
    readLocal() {
        const object = localStorage.getItem(this.initState.key);
        if (object) {
            return object;
        }
        else
            return false;
    }
    // sort and return the handle with highest visit time
    getTopProductKey(jsonStr) {
        let object = JSON.parse(jsonStr);
        let entries = Object.entries(object);
        entries.sort(function (a, b) {
            return b[1] - a[1];
        });
        let key = '';
        entries.forEach((el, ind) => {
            if (ind === 0) {
                key = el[0];
            }
        });
        return key;
    }
    // getIdandHandlefromKey
    getIdHandleTags(key) {
        const keyArr = key.split("_");
        return { id: parseInt(keyArr[0]), handle: keyArr[1], tags: keyArr[2].split(',') };
    }
    // sort and return the longest product list and tag name
    sortHotPdtList(lists) {
        //const lists = lists
        lists.sort(function (a, b) {
            return b.length - a.length;
        });
        return lists[0];
    }
}
class DynamicProductnCollection {
    constructor(logBasedSuggestionInstance) {
        this.logSuggestionInstance = logBasedSuggestionInstance;
        this.descriptionLength = 55;
        this.featuredProductA = document.getElementById('dynamic__pdt__grid__pdt__col__A');
        this.featuredProductimg = document.getElementById('featured_product_img');
        this.featuredProductTitle = document.getElementById('featured_product_title');
        this.featuredProductVendor = document.getElementById('featured_product_vendor');
        this.featuredProductPrice = document.getElementById('featured_product_price');
        this.featuredCollectionTitle = document.getElementById('featured_collection_title');
        this.featuredCollectionLink = document.getElementById('featured_collection_link');
        this.productListItemTitle = document.querySelectorAll('#products_list_item_title');
        this.productListItemLink = document.querySelectorAll('#products_list_item_link');
        this.productListItemVendor = document.querySelectorAll('#products_list_item_vendor');
        this.productListItemPrice = document.querySelectorAll('#products_list_item_price');
        this.productListItemImg = document.querySelectorAll('#products_list_item_img');
        this.initDynamicSection();
    }
    // Handler
    initDynamicSection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const smartCollection = yield this.logSuggestionInstance.initProductListfromLog();
                if (smartCollection) {
                    this.formatedResponse = this.formatAPIResponse(smartCollection);
                    this.renderDynamicCollection();
                    this.renderDynamicProduct();
                    this.renderDynamicProductList();
                }
                setTimeout(() => {
                    this.removeHideClasses(this.returnElmForClassesChanges());
                    this.removeSkeletonClass(this.returnElmForClassesChanges());
                }, 1500);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    formatAPIResponse(data) {
        const stateObj = {
            collection: {
                title: data.title,
                description: data.description.slice(0, this.descriptionLength) + "...",
                url: `/collections/${data.handle}`,
            },
            featuredpdt: {
                id: data.products[0].id,
                handle: data.products[0].handle,
                imgUrl: data.products[0].image.src,
                price: data.products[0].price,
                title: data.products[0].title,
                url: `products/${data.products[0].handle}`,
                vendor: data.products[0].vendor,
            },
            pdtlist: data.products.map((el) => {
                return {
                    id: el.id,
                    handle: el.handle,
                    imgUrl: el.image.src,
                    price: el.price,
                    title: el.title,
                    url: `products/${el.handle}`,
                    vendor: el.vendor,
                };
            }).filter((el, ind) => {
                return ind > 0;
            })
        };
        return stateObj;
    }
    changeJpgRes(url, res) {
        const ind = url.indexOf('.jpg');
        const newUrl = url.slice(0, ind) + `_${res}x` + url.slice(ind);
        return newUrl;
    }
    renderMoney(strOrNumber) {
        // return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'HKD', currencyDisplay:'symbol'}).format(Number(strOrNumber))
        return '$' + Number(strOrNumber).toFixed(2);
    }
    returnElmForClassesChanges() {
        const elmsArray = [this.featuredCollectionTitle,
            this.featuredProductimg,
            this.featuredProductTitle,
            this.featuredProductVendor,
            this.featuredProductPrice,];
        const nodeListsArray = [
            this.productListItemTitle,
            this.productListItemVendor,
            this.productListItemPrice,
            this.productListItemImg
        ];
        return { elmsArray, nodeListsArray };
    }
    // DOM manipulation
    removeHideClasses(elmsBundle) {
        elmsBundle.elmsArray.forEach((elm) => {
            elm.classList.remove('hideText');
            elm.classList.remove('hideImage');
        });
        elmsBundle.nodeListsArray.forEach((elm_01) => {
            elm_01.forEach((elm_02) => {
                elm_02.classList.remove('hideText');
                elm_02.classList.remove('hideImage');
            });
        });
    }
    removeSkeletonClass(elmsBundle) {
        elmsBundle.elmsArray.forEach((elm) => {
            elm.classList.remove('textSkeleton');
        });
        elmsBundle.nodeListsArray.forEach((elm_01) => {
            elm_01.forEach((elm_02) => {
                elm_02.classList.remove('textSkeleton');
            });
        });
    }
    renderDynamicCollection() {
        if (this.formatedResponse) {
            this.featuredCollectionTitle.innerText = this.formatedResponse.collection.title;
            this.featuredCollectionLink.href = this.formatedResponse.collection.url;
        }
    }
    renderDynamicProduct() {
        if (this.formatedResponse) {
            this.featuredProductimg.src = this.changeJpgRes(this.formatedResponse.featuredpdt.imgUrl, 500);
            this.featuredProductTitle.innerText = this.formatedResponse.featuredpdt.title;
            this.featuredProductVendor.innerText = this.formatedResponse.featuredpdt.vendor;
            this.featuredProductPrice.innerText = this.renderMoney(this.formatedResponse.featuredpdt.price);
            this.featuredProductA.href = `/products/${this.formatedResponse.featuredpdt.handle}`;
        }
    }
    renderDynamicProductList() {
        this.productListItemTitle.forEach((el, ind) => {
            if (this.formatedResponse) {
                el.innerText = this.formatedResponse.pdtlist[ind].title;
            }
        });
        this.productListItemLink.forEach((el, ind) => {
            if (this.formatedResponse) {
                el.href = `/products/${this.formatedResponse.pdtlist[ind].handle}`;
            }
        });
        this.productListItemVendor.forEach((el, ind) => {
            if (this.formatedResponse) {
                el.innerText = this.formatedResponse.pdtlist[ind].vendor;
            }
        });
        this.productListItemPrice.forEach((el, ind) => {
            if (this.formatedResponse) {
                el.innerText = this.renderMoney(this.formatedResponse.pdtlist[ind].price);
            }
        });
        this.productListItemImg.forEach((el, ind) => {
            if (this.formatedResponse) {
                el.src = this.changeJpgRes(this.formatedResponse.pdtlist[ind].imgUrl, 250);
            }
        });
    }
}
const getProductListFromLog = new GetProductListfromLog();
const dynamicProductnCollection = new DynamicProductnCollection(getProductListFromLog);
