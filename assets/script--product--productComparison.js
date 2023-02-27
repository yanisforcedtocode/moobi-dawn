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
// comparison module variables
const comparisonModuleParams = {
    hostName: "https://moobinavi.df.r.appspot.com",
    nonScoringParams: ["productHandle", "productName", "規格", "產地", "類型", "鍍膜類型", "成份", "附贈品", "可施工數"],
    shownNonScoringParams: ["規格", "產地", "類型", "附贈品"],
    greenKeys: ["研磨劑", "需稀釋"],
    blueKeys: ["中性pH", "雨刷水", "倒鏡可用", "頭盔可用", "頭燈可用", "濕車可用", "無水洗車", "含車蠟", "無需拋光", "玻璃適用", "鍍膜車用", "柴油適用", "潤滑機油"],
    purpleKeys: ["需打蠟機", ""],
    whiteKeys: ["呔鈴鍍膜", "容易使用", "去鐵粉", "呔鈴清潔", "輪胎清潔", "增強動力", "潤滑組件", "清理油路", "除積碳", "防止積碳", "節省燃油", "去水漬", "去油膜", "容易施工", "鍍膜耐力", "去污", "光澤", "驅水", "去小花痕", "強化漆色"],
    yellowKeys: ["使用頻次"],
    filterParams: [7505839390970]
};
/* input targetClass, insert HTML according to recommended products */
class ProductionComparison {
    constructor() {
        const idHolder = document.querySelector('[data-productid]');
        this.productId = parseInt(idHolder.dataset.productid);
        this.productHandle = window.location.href.split('/products/')[1];
        this.renderTarget = document.querySelector("[data-productPage_engagement_type = 'productPage_engagement_comparison']");
        this.renderProductComparison();
    }
    // init
    renderProductComparison() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield moobiQueries.getPdtCpr(this.productHandle);
                if (typeof data.results === "number") {
                    this.findOneData = data.data.oneData;
                    this.findDocData = data.data.docData;
                    this.formatTableData();
                    const comparisonContainer = this.createHTMLBlock();
                    comparisonContainer ? this.insertAjaxAPIdata(comparisonContainer) : '';
                    comparisonContainer ? this.displayCustomizations(comparisonContainer) : '';
                    this.renderComparison();
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // format data objects
    formatTableData() {
        const findOneData = this.findOneData;
        const findDocData = this.findDocData;
        const comparisonTableData = {};
        const basicParamsData = {};
        if (findOneData && findDocData) {
            const oneParamKeys = Object.keys(findOneData.productParameters);
            const filteredOneParamKeys = oneParamKeys.filter((el) => {
                return findOneData.productParameters[el] !== null && findOneData.productParameters[el] !== "";
            });
            this.filteredOneParamKeys = filteredOneParamKeys;
            filteredOneParamKeys.forEach((el) => {
                comparisonTableData[el] = [];
            });
            comparisonModuleParams.nonScoringParams.forEach((el) => {
                basicParamsData[el] = [];
            });
            // prepare the oneData for the rows of the comparison table
            filteredOneParamKeys.forEach((el_01) => {
                let score = findOneData.productParameters[el_01];
                comparisonTableData[el_01].push(score);
            });
            comparisonModuleParams.nonScoringParams.forEach((el2) => {
                let score = findOneData[el2];
                basicParamsData[el2].push(score);
            });
            // prepare the docData for the rows of the comparison table
            findDocData.forEach((el) => {
                filteredOneParamKeys.forEach((el_01) => {
                    let score = el.productParameters[el_01];
                    comparisonTableData[el_01].push(score);
                });
                comparisonModuleParams.nonScoringParams.forEach((el_02) => {
                    let score = el[el_02];
                    basicParamsData[el_02].push(score);
                });
            });
        }
    }
    getAllParamsDataSorted() {
        if (this.findDocData && this.findOneData) {
            const allParamsDataSorted = [this.findOneData, ...this.findDocData];
            allParamsDataSorted.forEach((el) => {
                el = Object.assign(el, el.productParameters);
                delete el.productParameters;
            });
            return allParamsDataSorted;
        }
    }
    // createHTML Elems
    createHTMLBlock() {
        const filteredOneParamKeys = this.filteredOneParamKeys;
        // const basicParamsData = this.basicParamsData
        // const comparisonTableData = this.comparisonTableData
        if (filteredOneParamKeys) {
            const shownParams = [...comparisonModuleParams.shownNonScoringParams, ...filteredOneParamKeys];
            const allParamsDataSorted = this.getAllParamsDataSorted();
            const scoreTable = allParamsDataSorted ? this.getScorsTable(allParamsDataSorted) : undefined;
            const sideBar = this.getSideBar();
            const container = document.createElement('div');
            const scoreCardsGrid = document.createElement('div');
            container.classList.add('productComparison__container__grid2S');
            scoreCardsGrid.classList.add('productComparison__container__grid2S__table');
            if (scoreTable && sideBar) {
                container.insertAdjacentElement('beforeend', sideBar);
                container.insertAdjacentElement('beforeend', scoreCardsGrid);
                scoreTable.forEach((el) => {
                    scoreCardsGrid.insertAdjacentElement('beforeend', el);
                });
                this.compiledHTML = container;
                return container;
            }
        }
    }
    // Build HTML Elm
    getScorsTable(allParamsDataSorted) {
        const cardsArray = [];
        allParamsDataSorted === null || allParamsDataSorted === void 0 ? void 0 : allParamsDataSorted.forEach((el, ind) => {
            const comparisonCard = this.getTemplateClone('comparison_card');
            this.modifyComparisonCardClone(comparisonCard, el);
            const cardDiv = comparisonCard.querySelector('.productComparison__card');
            this.insertScoreClones(cardDiv, allParamsDataSorted[ind]);
            cardsArray.push(cardDiv);
        });
        return cardsArray;
    }
    getSideBar() {
        const allKeys = this.getShownParamsKeys();
        allKeys === null || allKeys === void 0 ? void 0 : allKeys.push('價錢');
        if (allKeys) {
            const sideBarClone = this.getTemplateClone('comparison_side_bar');
            const sideBarWrapper = sideBarClone.querySelector('.productComparison__container__grid2S__titles');
            this.modifySideBarClone(sideBarWrapper, allKeys);
            return sideBarWrapper;
        }
    }
    getTemplateClone(id) {
        const template = document.getElementById(id);
        const clone = template.content.cloneNode(true);
        return clone;
    }
    modifyComparisonCardClone(clone, paramsDataSorted) {
        const link = clone.querySelector('a');
        link.href = `/products/${paramsDataSorted.productHandle}`;
        const image = clone.querySelector('img');
        this.writeHandleToElm(image, paramsDataSorted.productHandle);
        const title = clone.querySelector('.productComparison__container__grid2S__table__grid5S__title');
        title.innerText = paramsDataSorted.productName;
        const price = clone.querySelector('.productComparison__container__grid2S__table__grid5S__price');
        this.writeHandleToElm(price, paramsDataSorted.productHandle);
    }
    modifySideBarClone(clone, allKeys) {
        const title = clone.querySelector('.productComparison__container__grid2S__titles__title');
        allKeys.forEach((el, ind, arr) => {
            const titleClone = title.cloneNode(true);
            titleClone.innerText = el;
            clone.insertAdjacentElement('beforeend', titleClone);
            if (ind === arr.length - 1) {
                title.remove();
            }
        });
    }
    insertScoreClones(card, productScoresData) {
        var _a;
        const allShownKeys = this.getShownParamsKeys();
        if (allShownKeys) {
            allShownKeys.forEach((el, ind, arr) => {
                const keyValuePair = { [el]: productScoresData[el] };
                const scoreElm = this.newScoreElm(card, keyValuePair, false);
                card.insertAdjacentElement('beforeend', scoreElm);
                if (ind === arr.length - 1) {
                    this.cleanUpFirstScoreElm(card);
                }
            });
        }
        const priceBlock = card.querySelector('.productComparison__container__grid2S__table__grid5S__price');
        (_a = priceBlock.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(priceBlock);
    }
    getShownParamsKeys() {
        const filteredOneKeys = this.filteredOneParamKeys;
        if (filteredOneKeys) {
            const allKeys = [...comparisonModuleParams.shownNonScoringParams, ...filteredOneKeys];
            return allKeys;
        }
    }
    newScoreElm(clone, keyValuePair, lastScore) {
        const score = clone.querySelector('.productComparison__container__grid2S__table__grid5S__score');
        const scoreClone = score.cloneNode(true);
        scoreClone.dataset.key = Object.entries(keyValuePair)[0][0];
        scoreClone.innerText = Object.entries(keyValuePair)[0][1];
        return scoreClone;
    }
    writeHandleToElm(elm, handle) {
        elm.dataset.handle = handle;
        return elm;
    }
    cleanUpFirstScoreElm(card) {
        const score = card.querySelector('.productComparison__container__grid2S__table__grid5S__score');
        score.remove();
    }
    insertAjaxAPIdata(comparisonContainer) {
        return __awaiter(this, void 0, void 0, function* () {
            const productImg = comparisonContainer.querySelectorAll(`.productComparison__container__grid2S__table__grid5S__img`);
            const productPrice = comparisonContainer.querySelectorAll(`.productComparison__container__grid2S__table__grid5S__price`);
            const productImageArray = Array.from(productImg);
            for (let image of productImageArray) {
                const productHandle = image.dataset.handle;
                if (productHandle) {
                    // call shopify ajaxAPI to get product data 
                    const parsedResponse = yield moobiQueries.getPdtDetails(productHandle);
                    const obj = parsedResponse.data;
                    let img_url = obj.image.src;
                    let index = img_url.indexOf(".jpg");
                    let img_url_100x = img_url.slice(0, index) + "_300x" + img_url.slice(index, -1);
                    // insert imgUrl from ajaxAPI
                    image.src = img_url_100x;
                    // insert link from ajaxAPI
                    const imageWrapper = image.parentElement;
                    imageWrapper.href = `/products/${productHandle}`;
                    productPrice.forEach((el) => {
                        if (el.dataset.handle === productHandle) {
                            el.innerText = "$" + obj.variants[0].price.slice(0, -1);
                        }
                    });
                }
            }
        });
    }
    displayCustomizations(comparisonContainer) {
        const tick = `<i style = "color:#49d900" class="fas fa-check-circle"></i>`;
        const cross = `<i style = "color:#666" class="fas fa-times-circle"></i>`;
        const scores = comparisonContainer.querySelectorAll(".productComparison__container__grid2S__table__grid5S__score");
        scores.forEach((el, ind) => {
            comparisonModuleParams.greenKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText);
                    if (value === 1) {
                        el.innerHTML = tick;
                    }
                    if (value === -1) {
                        el.innerHTML = cross;
                    }
                    if (!value) {
                        el.innerHTML = "";
                    }
                }
            });
            comparisonModuleParams.blueKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText);
                    if (value > 0) {
                        el.innerHTML = tick;
                    }
                    if (value <= 0) {
                        el.innerHTML = "";
                    }
                    if (!value) {
                        el.innerHTML = "";
                    }
                }
            });
            comparisonModuleParams.purpleKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText);
                    if (value === 0) {
                        el.innerHTML = tick;
                    }
                    if (value === 1) {
                        el.innerHTML = cross;
                    }
                    if (value !== 0 && value !== 1) {
                        el.innerHTML = "";
                    }
                }
            });
            comparisonModuleParams.whiteKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText);
                    const star = `<i class="fas fa-star"></i>`;
                    let stars = "";
                    if (value > 0) {
                        for (let i = 0; i < value; i++) {
                            stars += star;
                        }
                        el.innerHTML = stars;
                    }
                    if (!value) {
                        el.innerHTML = "";
                    }
                }
            });
            comparisonModuleParams.yellowKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = el.innerText;
                    if (value === "null") {
                        el.innerHTML = "";
                    }
                    if (value !== "null") {
                        el.innerHTML = value;
                    }
                }
            });
        });
    }
    renderComparison() {
        const sectionTemplate = document.querySelector('#product_comparison_template');
        const recommendationSection = document.getElementById('recommendation_section');
        const sectionClone = sectionTemplate.content.cloneNode(true);
        const section = sectionClone.querySelector('.product_main_section_standard');
        const renderTarget = section === null || section === void 0 ? void 0 : section.querySelector("[data-productPage_engagement_type = 'productPage_engagement_comparison']");
        if (renderTarget && this.compiledHTML && section) {
            renderTarget.insertAdjacentElement("beforeend", this.compiledHTML);
            recommendationSection === null || recommendationSection === void 0 ? void 0 : recommendationSection.insertAdjacentElement('beforebegin', section);
        }
        else {
            console.log('target for comparison rendering not found');
        }
    }
}
const insertComparison = new ProductionComparison();
class ProductRecommendation {
    constructor() {
        const idHolder = document.querySelector('[data-productid]');
        this.productId = parseInt(idHolder.dataset.productid);
        this.insertRecommendations('[data-productPage_engagement_type = "productPage_engagement_reccom"]', this.productId, 10, 350);
    }
    resizeImageSrc(src, imgRes) {
        const index = src.indexOf(".jpg") || src.indexOf(".png");
        const resizedSrc = `${src.slice(0, index)}_${imgRes}x${src.slice(index)}`;
        return resizedSrc;
    }
    insertRecommendations(targetSelector, id, limit, imgRes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const target = document.querySelector(`${targetSelector}`);
                const data = yield moobiQueries.getRecommendationsbyProductId(id, limit);
                const productsData = data.products;
                this.renderRecommendations(productsData, target);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    returnRecommendationClone() {
        const template = document.getElementById('product_recommendation_template');
        const clone = template.content.cloneNode(true);
        return clone;
    }
    modifyRecommendationClone(clone, dataObj) {
        const image = clone.querySelector('img');
        image.src = this.resizeImageSrc(dataObj.images[0], 300);
        const title = clone.querySelector('h3');
        title.innerText = dataObj.title;
        const vendor = clone.querySelector('.products-slide-item-vendor');
        vendor.innerText = dataObj.vendor;
        const link = clone.querySelector('a');
        link.href = `/products/${dataObj.handle}`;
        const price = clone.querySelector('.products-slide-item-price');
        // Format number to two decimals (Typescript)
        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dataObj.price / 100);
        price.innerText = formattedPrice;
        const compared_at_price = clone.querySelector('.products-slide-item-price-original');
        if (dataObj === null || dataObj === void 0 ? void 0 : dataObj.compare_at_price) {
            const formattedComparedAtPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dataObj.compare_at_price / 100);
            compared_at_price.innerText = formattedComparedAtPrice;
        }
        return clone;
    }
    renderRecommendations(productsData, target) {
        const sectionHTMLArray = [];
        productsData.forEach((el) => {
            const templateClone = this.returnRecommendationClone();
            const modifiedClone = this.modifyRecommendationClone(templateClone, el);
            sectionHTMLArray.push(modifiedClone);
        });
        sectionHTMLArray.forEach((el) => {
            target.appendChild(el);
        });
    }
}
const renderRecommendations = new ProductRecommendation();
