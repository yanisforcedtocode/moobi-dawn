'use strict'
interface TypesenseClientStates{
    searchParams: boolean;
    query: boolean;
    isSearchSubmited: boolean;
    search: {
        query: boolean;
        params: boolean;
        res: boolean;
    }
}
interface TypesenseServerResponse{
    hits: TypesenseHits[]
}
interface TypesenseSearchParams{ 
        q: string,
        query_by: string,
        filter_by: string,
        sort_by : string
}
type TypesenseHits = {
    highlights: any[]
    document: {title: string}
}
declare var Typesense: any 

let moobiTypeSenseClient = new Typesense.SearchClient({
    'nodes': [{
      'host': '2y9h70d3prw6uv8jp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
      'port': '443',      // For Typesense Cloud use 443
      'protocol': 'https'   // For Typesense Cloud use https
    }],
    'apiKey': 'itq7jicFo1XypYg2paZKPQx0qxJFgbG6',
    'connectionTimeoutSeconds': 2
  })
  
class TSSearchWidget {
    initStates: {
        searchParams: any;
        query: any;
        isSearchSubmited: boolean;
        search: {
            query: any;
            params: any;
            res: any;
        }
    }
    currentStates: {
        searchParams: any;
        query: any;
        isSearchSubmited: boolean;
        search: {
            query: any;
            params: any;
            res: any;
        }
    }
    sectionElm: HTMLElement;
    queryElm: HTMLElement;
    paramsElm: HTMLElement;
    responseElm: HTMLElement;
    searchBtnElm: HTMLElement;

    constructor() { 
        console.log('typesense running')
        this.initStates = {
            searchParams : false,
            query: false,
            isSearchSubmited:false,
            search:{
                query:false,
                params:false,
                res:false
            }
        }
        this.currentStates = {...this.initStates}
        this.sectionElm = document.querySelector(".TSClient__section") as HTMLElement
        this.queryElm = document.querySelector("#query") as HTMLElement
        this.paramsElm = document.querySelector("#params") as HTMLElement
        this.responseElm = document.querySelector("#response") as HTMLElement
        this.searchBtnElm = document.querySelector("#submitsearch") as HTMLElement
    }
    // initiation

    init(){
        this.listen.apply(this, [this.queryElm, this.setQuery, "input"])
        this.listen.apply(this, [this.paramsElm, this.setParams, "input"])
        this.listen.apply(this, [this.searchBtnElm, this.setSubmit, "mouseover"])
        this.setSubmit()
    }

    // event listeners
    listen(elm: HTMLElement, fn: Function, event:string){
        console.log(elm)
        console.log(event)
        console.log(fn)
        elm.addEventListener(event, (e)=>{
            const target = e.target as HTMLInputElement
            if(target && target.value){
                fn.apply(this, [target.value])
            }else{
                fn.apply(this)
            }
        })
    }

    // handlers
    // show string on response block
    displayRes(res: any){
        console.log(res)
        if (res !== this.responseElm.innerText)
        {this.responseElm.innerHTML = this.formatRes(res)
        }
    }
    formatRes(res: TypesenseServerResponse){
        const hits = res.hits
        const text = hits.map((el, ind)=>{
            const title = el.document.title
            const highlights:any[] = []
            el.highlights.forEach((el_1)=>{
                highlights.push(JSON. stringify(el_1))
            })
            return title + '<br/>'+ highlights + '<br/>'
        })
        return text.join("")
    }
    // send search request
    searchFn = async(params: string)=>{
        const parsedParams: TypesenseSearchParams = JSON.parse(params)
        const res = await moobiTypeSenseClient.collections('shopify_products_zh_01').documents().search(parsedParams)
        console.log(res)
        return res
    }

    // set current state
    setQuery(query: any){
        console.log(query)
        this.currentStates.search.query = query
        this.evoke()
    }
    setParams(params: string){
        console.log(params)
        this.currentStates.search.params = params
        console.log(this.currentStates.search.params)
        this.evoke()    
    }
    setSubmit(){
        console.log('submit')
        console.log(this.currentStates.search.params)
        if(this.currentStates.search.params){
            this.currentStates.isSearchSubmited = true
            this.evoke()
        }
    }

    // evoke
    async evoke(){
        try {
            console.log(this.currentStates.isSearchSubmited)
            if(this.currentStates.isSearchSubmited){
                const res = await this.searchFn(this.currentStates.search.params)
                this.currentStates.search.res = res
                this.displayRes(res)
                this.currentStates.isSearchSubmited = false
            }
        } catch (error) {
            this.currentStates.isSearchSubmited = false
        }
    }
  }

  const tsWidget = new TSSearchWidget()
  tsWidget.init()
