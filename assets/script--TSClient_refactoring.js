'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TSSearchWidget {
    constructor() {
        // send search request
        this.searchFn = (params) => __awaiter(this, void 0, void 0, function* () {
            const parsedParams = JSON.parse(params);
            const res = yield moobiTypeSenseClient.collections('shopify_products_zh_01').documents().search(parsedParams);
            console.log(res);
            return res;
        });
        console.log('typesense running');
        this.initStates = {
            searchParams: false,
            query: false,
            isSearchSubmited: false,
            search: {
                query: false,
                params: false,
                res: false
            }
        };
        this.currentStates = Object.assign({}, this.initStates);
        this.sectionElm = document.querySelector(".TSClient__section");
        this.queryElm = document.querySelector("#query");
        this.paramsElm = document.querySelector("#params");
        this.responseElm = document.querySelector("#response");
        this.searchBtnElm = document.querySelector("#submitsearch");
    }
    // initiation
    init() {
        this.listen.apply(this, [this.queryElm, this.setQuery, "input"]);
        this.listen.apply(this, [this.paramsElm, this.setParams, "input"]);
        this.listen.apply(this, [this.searchBtnElm, this.setSubmit, "mouseover"]);
        this.setSubmit();
    }
    // event listeners
    listen(elm, fn, event) {
        console.log(elm);
        console.log(event);
        console.log(fn);
        elm.addEventListener(event, (e) => {
            const target = e.target;
            if (target && target.value) {
                fn.apply(this, [target.value]);
            }
            else {
                fn.apply(this);
            }
        });
    }
    // handlers
    // show string on response block
    displayRes(res) {
        console.log(res);
        if (res !== this.responseElm.innerText) {
            this.responseElm.innerHTML = this.formatRes(res);
        }
    }
    formatRes(res) {
        const hits = res.hits;
        const text = hits.map((el, ind) => {
            const title = el.document.title;
            const highlights = [];
            el.highlights.forEach((el_1) => {
                highlights.push(JSON.stringify(el_1));
            });
            return title + '<br/>' + highlights + '<br/>';
        });
        return text.join("");
    }
    // set current state
    setQuery(query) {
        console.log(query);
        this.currentStates.search.query = query;
        this.evoke();
    }
    setParams(params) {
        console.log(params);
        this.currentStates.search.params = params;
        console.log(this.currentStates.search.params);
        this.evoke();
    }
    setSubmit() {
        console.log('submit');
        console.log(this.currentStates.search.params);
        if (this.currentStates.search.params) {
            this.currentStates.isSearchSubmited = true;
            this.evoke();
        }
    }
    // evoke
    evoke() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(this.currentStates.isSearchSubmited);
                if (this.currentStates.isSearchSubmited) {
                    const res = yield this.searchFn(this.currentStates.search.params);
                    this.currentStates.search.res = res;
                    this.displayRes(res);
                    this.currentStates.isSearchSubmited = false;
                }
            }
            catch (error) {
                this.currentStates.isSearchSubmited = false;
            }
        });
    }
}
const tsWidget = new TSSearchWidget();
tsWidget.init();
