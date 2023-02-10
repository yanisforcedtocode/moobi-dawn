'use strict'
// === init TS search client
declare var Typesense: any 

let client = new Typesense.SearchClient({
    'nodes': [{
      'host': '2y9h70d3prw6uv8jp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
      'port': '443',      // For Typesense Cloud use 443
      'protocol': 'https'   // For Typesense Cloud use https
    }],
    'apiKey': 'itq7jicFo1XypYg2paZKPQx0qxJFgbG6',
    'connectionTimeoutSeconds': 2
  })
  // === TS search handlers
  

  
//   searchFn()
class TSSearchWidget {
    initStates: {
        searchParams : Boolean,
        query: Boolean,
        isSearchSubmited:Boolean,
        search:{
            query:Boolean,
            params:Boolean,
            res:Boolean
        }
    }
    constructor(params: any) { 
        // states
        this.initStates = {
            // searchParams:[...params.searchParams],
            // searchFields:[...params.searchFields],
            // facetFields:[...params.facetFields],
            searchParams : false,
            query: false,
            isSearchSubmited:false,
            search:{
                query:false,
                params:false,
                res:false
            }

        }
        /*this.currentState = {...this.initStates}
        // targets
        this.section = document.querySelector(".TSClient__section")
        this.query = document.querySelector("#query")
        this.params = document.querySelector("#params")
        this.response = document.querySelector("#response")
        this.searchBtn = document.querySelector("#submitsearch")*/
        }
    }
    // event listeners
    /*
    listen(elm, fn, self, event='input'){
        elm.addEventListener(event, (e)=>{
            if(fn){
                fn(e.target.value, self)
            }
        })
    }

    // handlers
    // show string on response block
    displayRes(res){
        if (res !== this.response.innerText)
        {this.response.innerHTML = this.formatRes(res)
        }
    }
    formatRes(res){
        const text = res.hits.map((el, ind)=>{
            const title = el.document.title
            const highlights = []
            el.highlights.forEach((el_1)=>{
                highlights.push(JSON. stringify(el_1))
            })
            return title + '<br/>'+ highlights + '<br/>'
        })
        return text.join("")
    }
    // send search request
    searchFn = async(params)=>{
        console.log(JSON.parse(params))
        let searchParameters = {
            q         : 'glaco',
            query_by  : 'title',
            // 'filter_by' : 'num_employees:>100',
            // 'sort_by'   : 'num_employees:desc'
          }
        const res = await client.collections('shopify_products_zh_01').documents().search(JSON.parse(params))
        console.log(res)
        return res
    }

    // set current state
    setQuery(query, self){
        self.currentState.search.query = query
        self.evoke(self.currentState)
    }
    setParams(params, self){
        self.currentState.search.params = params
        self.evoke(self.currentState)    
    }
    setSubmit(params, self){
        if(self.currentState.search.params){
            self.currentState.isSearchSubmited = true
            self.evoke(self.currentState)
        }
    }

    // evoke
    evoke = async(currentState)=>{
        if(this.currentState.isSearchSubmited){
            const res = await this.searchFn(currentState.search.params)
            this.currentState.search.res = res
            this.displayRes(
                res
            // `${currentState.search.query? currentState.search.query :""}  
            // ${currentState.search.params? currentState.search.params:""}`
            )
            this.currentState.isSearchSubmited = false
        }
    }

    // init
    init(){
        const self = this
        this.listen(self.query, self.setQuery, self)
        this.listen(self.params, self.setParams, self)
        this.listen(self.searchBtn, self.setSubmit, self, 'click')
    }
  }

  const tsWidget = new TSSearchWidget()
  tsWidget.init() */