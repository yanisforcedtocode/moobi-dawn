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
// main class
class General_gTagHandler {
    constructor(identifiers, eventName, options) {
        this.eventName = eventName;
        this.trackingElms = [];
        this.options = options;
        if (identifiers) {
            identifiers.forEach((el) => {
                const trackedGroup = document.querySelectorAll(el.toLowerCase());
                // console.log(trackedGroup)
                trackedGroup.forEach((el_1) => {
                    const eventTypeKey = `${this.eventName}_type`.toLowerCase();
                    // console.log({element: el_1, identifier: el, type: el_1.dataset[eventTypeKey] || ""})
                    this.trackingElms.push({ element: el_1, identifier: el, type: el_1.dataset[eventTypeKey] || this.eventName + "_defaultLink" });
                });
            });
        }
        // article  widget identifiers
        this.articleWidgetIds = [
            { id: ".TS__AC__fitlers__container", type: `${this.eventName}_blog_widget_category` },
            { id: ".pageSelect__container", type: `${this.eventName}_blog_widget_pageSelect` },
            { id: "#TS__AC__section__container__textField", type: `${this.eventName}_blog_widget_search` }
            // { id: ".repairArticle__backToNavi", type: "homePage_engagement_back_to_navi" }
        ];
        // initiation
        const linklistenerFnArr = [
            (evt) => {
                if (options.dev) {
                    console.log('dev');
                    evt.preventDefault();
                }
            },
            this.listernerHandler_01
        ];
        const clickListenerFnArr = [
            (evt) => {
                if (options.dev) {
                    console.log('dev');
                    evt.preventDefault();
                    // console.log(evt.target)
                }
            },
            this.listernerHandler_02
        ];
        // listen to link clicks
        if (this.trackingElms.length > 0) {
            this.listenToElmsLinks(this.trackingElms, linklistenerFnArr);
        }
        // listen to the article widget
        if (this.options.articleWidget) {
            this.listenToArticleWidget();
        }
        if (this.options.clickElm) {
            this.listenToElmsClicks(this.options.clickElm, clickListenerFnArr);
        }
        // if(this.options.clickElm){
        //     this.listenToElmsScrolls(this.options.clickElm, scrollListenerFnArr)
        // }
    }
    findTargetUrl(evt) {
        const targetPath = evt.composedPath();
        let targetUrl = '';
        for (const target of targetPath) {
            if (target.tagName === 'A') {
                const aElm = target;
                // console.log(aElm.href)
                targetUrl = aElm.href;
                break;
            }
        }
        return targetUrl || "";
    }
    findEngagementType(elm, identifier) {
        const dataKey = identifier.slice(6, -1);
        const defaultType = this.eventName + '_hyperLink';
        console.log(dataKey);
        if (elm.dataset[dataKey]) {
            return elm.dataset[dataKey];
        }
        else {
            return defaultType;
        }
    }
    formatDataLayerObj(engagement_type, targetUrl, title) {
        // const typeKey  = `${this.eventName}_type`
        // const urlKey  = `${this.eventName}_targetUrl`
        const dataLayerObj = {
            event: this.eventName,
            type: engagement_type,
            targetUrl: targetUrl,
            title: title
        };
        return dataLayerObj;
    }
    fireDataLayer(dataLayerObj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dataLayer) {
                dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
                dataLayer.push(dataLayerObj);
                // Clear the keys defined by this push.
                dataLayer.push({
                    event: null,
                    type: null,
                    targetUrl: null,
                    title: null
                });
                if (this.options.dev) {
                    console.log(dataLayerObj);
                }
            }
        });
    }
    listernerHandler_01(evt, elm, identifier, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const engagement_type = type;
                const targetUrl = this.findTargetUrl(evt);
                const dataLayerObj = this.formatDataLayerObj(engagement_type || "", targetUrl, '');
                // only send link related dataLayerObj
                if (dataLayerObj.targetUrl && dataLayerObj.targetUrl.length > 0) {
                    yield this.fireDataLayer(dataLayerObj);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    listernerHandler_02(evt, elm, identifier, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const engagement_type = type;
                const title = elm.innerText || '';
                // const targetUrl = this.findTargetUrl(evt)
                const dataLayerObj = this.formatDataLayerObj(engagement_type || '', '', title);
                // only send link unrelated dataLayerObj
                if (!dataLayerObj.targetUrl || dataLayerObj.targetUrl.length === 0) {
                    yield this.fireDataLayer(dataLayerObj);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    listernerHandler_03(evt, elm, identifier, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const engagement_type = type;
                const title = elm.innerText || '';
                const dataLayerObj = this.formatDataLayerObj(engagement_type || '', '', title);
                // only send link unrelated dataLayerObj
                if (!dataLayerObj.targetUrl || dataLayerObj.targetUrl.length === 0) {
                    yield this.fireDataLayer(dataLayerObj);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    listenToElmsLinks(trackingElms, handlers) {
        const self = this;
        trackingElms.forEach((el) => {
            const handlerCarrier = (evt, elm = el) => {
                handlers.forEach((handler) => {
                    handler.apply(self, [evt, elm.element, elm.identifier, elm.type]);
                });
                // el.element.removeEventListener('click', handlerCarrier)
            };
            el.element.addEventListener('click', handlerCarrier);
        });
    }
    // // create a gTag handler to be called in the global scope
    listenToArticleWidget() {
        const self = this;
        self.articleWidgetIds.forEach((el) => {
            const engagementAreas = document.querySelectorAll(el.id);
            engagementAreas.forEach((area) => {
                if (area) {
                    area.addEventListener("click", (evt) => {
                        const elm = evt.target;
                        if (elm.tagName !== "LABEL") {
                            // const typeKey  = `${self.eventName}_type`
                            // const titleKey  = `${self.eventName}_title`
                            // const gtagObj = {
                            //     type: el.type,
                            //     title: area.innerText || "" 
                            // }
                            // gtag("event", this.eventName, gtagObj);
                            const dataLayerObj = self.formatDataLayerObj(el.type, '', area.innerText || '');
                            if (dataLayer) {
                                dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
                                dataLayer.push(dataLayerObj);
                            }
                            // console.log('engagement tag fired' + " " + el.type + " " + area.innerText ) 
                            if (self.options.dev) {
                                // console.log(dataLayerObj) 
                            }
                        }
                    });
                }
            });
        });
    }
    listenToElmsClicks(trackingIds, handlers) {
        const self = this;
        const trackingElms = [];
        trackingIds.forEach((el) => {
            const selectedNodes = document.querySelectorAll(el.id);
            selectedNodes.forEach((el_01) => {
                trackingElms.push({
                    element: el_01,
                    identifier: el.id,
                    type: el.type
                });
            });
        });
        trackingElms.forEach((el) => {
            const handlerCarrier = (evt, elm = el) => {
                handlers.forEach((handler) => {
                    handler.apply(self, [evt, elm.element, elm.identifier, elm.type]);
                });
            };
            el.element.addEventListener('click', handlerCarrier);
        });
    }
    listenToElmsScrolls(trackingIds, handlers) {
        const self = this;
        const trackingElms = [];
        trackingIds.forEach((el) => {
            const selectedNodes = document.querySelectorAll(el.id);
            selectedNodes.forEach((el_01) => {
                trackingElms.push({
                    element: el_01,
                    identifier: el.id,
                    type: el.type
                });
            });
        });
        trackingElms.forEach((el) => {
            const handlerCarrier = (evt, elm = el) => {
                handlers.forEach((handler) => {
                    handler.apply(self, [evt, elm.element, elm.identifier, elm.type]);
                });
            };
            el.element.addEventListener('scroll', handlerCarrier);
        });
    }
}
