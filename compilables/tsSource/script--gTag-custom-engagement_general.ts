"use strict";
// declare global variables
declare var dataLayer:any
declare var gtag:any

// how to use
/*
Create a new instance of "homePage_gTagHandler", which takes the following arguements:
const record_engagement_1 = new homePage_gTagHandler(['HTML elelment identifiers'] | false, 'GA4 event name', options: {articleWidget: boolean, clickElm: {id: string, type: string}[] | false}})
*/

// Types
type dataLayerObj = {
    event: string,
    type: string,
    targetUrl: string,
    title: string
}
type gTagCustomEngagementOptions = {
    articleWidget: boolean, 
    clickElm: {id: string, type: string}[] | false
    dev?: true | false
}
// main class
class General_gTagHandler{
    trackingElms: {element: HTMLElement, identifier: string, type: string }[];
    eventName: string
    articleWidgetIds:{id: string, type: string}[
        ];
    options: gTagCustomEngagementOptions
    constructor(identifiers: string[] | false, eventName: string, options: gTagCustomEngagementOptions) {
        this.eventName = eventName
        this.trackingElms = []
        this.options = options
        if(identifiers){
            identifiers.forEach((el) => {
                const trackedGroup = document.querySelectorAll(el.toLowerCase()) as NodeListOf<HTMLElement>
                // console.log(trackedGroup)
                trackedGroup.forEach((el_1) => {
                    const eventTypeKey = `${this.eventName}_type`.toLowerCase()
                    // console.log({element: el_1, identifier: el, type: el_1.dataset[eventTypeKey] || ""})
                    this.trackingElms.push(
                        {element: el_1, identifier: el, type: el_1.dataset[eventTypeKey] || this.eventName+"_defaultLink"}
                    )
                })
            })
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
            (evt: Event)=>{
                if(options.dev){
                    console.log('dev')
                    evt.preventDefault()
                }
            },
            this.listernerHandler_01
        ]
        const clickListenerFnArr = [
            (evt: Event)=>{
                if(options.dev){
                    console.log('dev')
                    evt.preventDefault()
                    // console.log(evt.target)
                }
            },
            this.listernerHandler_02
        ]

        // listen to link clicks
        if(this.trackingElms.length>0){
            this.listenToElmsLinks(this.trackingElms, linklistenerFnArr)
        }
        // listen to the article widget
        if(this.options.articleWidget){
            this.listenToArticleWidget()
        }
        if(this.options.clickElm){
            this.listenToElmsClicks(this.options.clickElm, clickListenerFnArr)
        }
        // if(this.options.clickElm){
        //     this.listenToElmsScrolls(this.options.clickElm, scrollListenerFnArr)
        // }
    }

    findTargetUrl(evt: Event){
            const targetPath = evt.composedPath() as HTMLElement[]
            let targetUrl = ''
            for(const target of targetPath){
                if (target.tagName === 'A'){
                    const aElm = target as HTMLLinkElement
                    // console.log(aElm.href)
                    targetUrl = aElm.href
                    break
                }
            }
        return targetUrl || ""
    }

    findEngagementType(elm: HTMLElement, identifier: string){
        const dataKey = identifier.slice(6, -1)
        const defaultType = this.eventName+'_hyperLink'
        console.log(dataKey)
        if(elm.dataset[dataKey]){
            return elm.dataset[dataKey]
        } else {
            return defaultType
        }
    }

    formatDataLayerObj(engagement_type: string, targetUrl: string , title: string):dataLayerObj{
        // const typeKey  = `${this.eventName}_type`
        // const urlKey  = `${this.eventName}_targetUrl`
        const dataLayerObj:dataLayerObj = {
            event: this.eventName,
            type: engagement_type,
            targetUrl: targetUrl,
            title: title
        }
        return dataLayerObj
    }

    async fireDataLayer (dataLayerObj: {}){
        if(dataLayer){
            dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
            dataLayer.push(dataLayerObj);
            // Clear the keys defined by this push.
            dataLayer.push({ 
                event: null,
                type: null,
                targetUrl: null,
                title: null
            })
            if(this.options.dev){
                console.log(dataLayerObj)
            }
        }
    }

    async listernerHandler_01(evt: Event, elm: HTMLElement, identifier: string, type: string){
        try{
            const engagement_type = type
            const targetUrl = this.findTargetUrl(evt)
            const dataLayerObj:dataLayerObj = this.formatDataLayerObj(engagement_type || "", targetUrl, '' )
            // only send link related dataLayerObj
            if(dataLayerObj.targetUrl && dataLayerObj.targetUrl.length > 0){
                await this.fireDataLayer(dataLayerObj)
            }
        }catch(err){
            console.log(err)
        }
    }

    async listernerHandler_02(evt: Event, elm: HTMLElement, identifier: string, type: string){
        try{
            const engagement_type = type
            const title = elm.innerText || ''
            // const targetUrl = this.findTargetUrl(evt)
            const dataLayerObj:dataLayerObj = this.formatDataLayerObj(engagement_type || '', '', title )
            // only send link unrelated dataLayerObj
            if(!dataLayerObj.targetUrl || dataLayerObj.targetUrl.length === 0){
                await this.fireDataLayer(dataLayerObj)
            }
        }catch(err){
            console.log(err)
        }
    }

    async listernerHandler_03(evt: Event, elm: HTMLElement, identifier: string, type: string){
        try{
            const engagement_type = type
            const title = elm.innerText || ''
            const dataLayerObj:dataLayerObj = this.formatDataLayerObj(engagement_type || '', '', title )
            // only send link unrelated dataLayerObj
            if(!dataLayerObj.targetUrl || dataLayerObj.targetUrl.length === 0){
                await this.fireDataLayer(dataLayerObj)
            }
        }catch(err){
            console.log(err)
        }
    }

    listenToElmsLinks(trackingElms: {element: HTMLElement, identifier: string, type: string }[], handlers: Function[]):void{
        const self = this
        trackingElms.forEach((el)=>{
            const handlerCarrier = (evt: Event, elm:any = el)=>{
                handlers.forEach((handler)=>{
                    handler.apply(self, [evt, elm.element, elm.identifier, elm.type])
                })
                // el.element.removeEventListener('click', handlerCarrier)
            }
            el.element.addEventListener('click', handlerCarrier)
        })
    }

    // // create a gTag handler to be called in the global scope
    listenToArticleWidget(){
        const self = this
        self.articleWidgetIds.forEach((el)=>{
            const engagementAreas = document.querySelectorAll(el.id) as NodeListOf<HTMLElement>;
            engagementAreas.forEach((area)=>{
                if(area){
                    area.addEventListener("click", (evt)=>{
                        const elm = evt.target as HTMLElement
                        if(elm.tagName !== "LABEL"){
                            // const typeKey  = `${self.eventName}_type`
                            // const titleKey  = `${self.eventName}_title`
                            // const gtagObj = {
                                //     type: el.type,
                                //     title: area.innerText || "" 
                                // }
                                // gtag("event", this.eventName, gtagObj);
                            const dataLayerObj = self.formatDataLayerObj(el.type, '', area.innerText || '')
                            if(dataLayer){
                                dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
                                dataLayer.push(dataLayerObj);
                            }
                            // console.log('engagement tag fired' + " " + el.type + " " + area.innerText ) 
                            if(self.options.dev){
                                // console.log(dataLayerObj) 
                            }
                        }
                    })
                }
            })
        
        })
    }

    listenToElmsClicks(trackingIds: {id:string, type: string}[], handlers: Function[]):void{
        const self = this
        type TrackingElm = {element: HTMLElement, identifier: string, type: string }

        const trackingElms: TrackingElm[] = []
        trackingIds.forEach((el)=>{
            const selectedNodes = document.querySelectorAll(el.id) as NodeListOf<HTMLElement>
            selectedNodes.forEach((el_01)=>{
                trackingElms.push({
                    element: el_01,
                    identifier: el.id,
                    type: el.type
                })
            })
        })

        trackingElms.forEach((el)=>{
            const handlerCarrier = (evt: Event, elm:TrackingElm = el)=>{
                handlers.forEach((handler)=>{
                    handler.apply(self, [evt, elm.element, elm.identifier, elm.type])
                })
            }
            el.element.addEventListener('click', handlerCarrier)
        })
    }

    listenToElmsScrolls(trackingIds: {id:string, type: string}[], handlers: Function[]):void{
        const self = this
        // console.log('listen to scrolls')
        type TrackingElm = {element: HTMLElement, identifier: string, type: string }

        const trackingElms: TrackingElm[] = []
        trackingIds.forEach((el)=>{
            const selectedNodes = document.querySelectorAll(el.id) as NodeListOf<HTMLElement>
            selectedNodes.forEach((el_01)=>{
                trackingElms.push({
                    element: el_01,
                    identifier: el.id,
                    type: el.type
                })
            })
        })

        trackingElms.forEach((el)=>{
            const handlerCarrier = (evt: Event, elm:TrackingElm = el)=>{
                handlers.forEach((handler)=>{
                    handler.apply(self, [evt, elm.element, elm.identifier, elm.type])
                })
            }
            el.element.addEventListener('scroll', handlerCarrier)
        })
    }


}


// const record_engagement_1 = new homePage_gTagHandler(['[data-homePage_engagement_type]'], 'homePage_engagement', true)
