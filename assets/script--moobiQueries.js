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
class MoobiQueries {
    constructor() {
        this.hostName = 'https://moobinavi.df.r.appspot.com';
    }
    getPdtDetails(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = {
                    method: 'GET',
                    redirect: 'manual'
                };
                const res = yield fetch(`${this.hostName}/api/v00/dynamicHP/getOnepdt?handle=${handle}`, requestOptions);
                const text = yield res.text();
                const data = yield JSON.parse(text);
                return data;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getPdtCpr(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // return resdata or false
                let requestOptions = {
                    method: 'GET',
                    redirect: 'manual'
                };
                const res = yield fetch(`${this.hostName}/api/v00/comparisons/param?handle=${handle}`, requestOptions);
                const text = yield res.text();
                const data = yield JSON.parse(text);
                console.log(data);
                if (data.results) {
                    return data;
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
    getPdtLists(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const raw = JSON.stringify({ tags: tags });
                const requestOptions = {
                    mode: 'cors',
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'manual'
                };
                const res = yield fetch(`${this.hostName}/api/v00/dynamicHP/getPdtListsByTags`, requestOptions);
                const text = yield res.text();
                const data = yield JSON.parse(text);
                return data.data;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getProductListbyCollectionId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = {
                    method: 'GET',
                    redirect: 'manual'
                };
                const response = yield fetch(`${this.hostName}/api/v00/dynamicHP/getPdtListsById?id=${id}`, requestOptions);
                const result = yield response.text();
                const data = yield JSON.parse(result);
                return data;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getRecommendationsbyProductId(id, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestOptions = {
                    method: 'GET',
                    redirect: 'manual'
                };
                const response = yield fetch(`/recommendations/products.json?product_id=${id}&limit=${limit}`, requestOptions);
                const result = yield response.text();
                const data = yield JSON.parse(result);
                return data;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
const moobiQueries = new MoobiQueries();
