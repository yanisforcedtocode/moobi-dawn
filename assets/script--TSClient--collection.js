'use strict'
// === init TS search client

class TSSearchWidget {
    constructor(params) { 
        // states
        this.initStates = {
            searchParams : false,
            query: false,
            isSearchSubmited:false,
            ui:{
                sideBar: false,
                screen: parseInt(window.innerWidth),
                breakpoint: 650
            },
            search:{
                query:false,
                params:false,
                res:false,
                checkedFilters:{},
                collection:document.querySelector('#TS__collection__titles__container__h1').innerText,
                facets: ['series','origin','vendor','subSeries'],
                minP: 0,
                maxP: 100,
                minV:10,
                maxV:300,
                sortby:['price:asc','price:desc','order:asc','createdAt:desc'],
                sortbyStr: "",
                standardFilters:['discount:>0.09','totalInventory:>0'],
                standardFiltersStr : "",
                page: 1,
            },
            response:{
                facet:[],
                activeFacet:[],
                ttlPage: 1,
                currentPage: 1
            }

        }
        this.currentState = JSON.parse(JSON.stringify(this.initStates))
        // targets
        this.section = document.querySelector(".TSClient__section")
        this.query = document.querySelector("#query")
        this.params = document.querySelector("#params")
        this.response = document.querySelector("#response")
        this.searchBtn = document.querySelector("#submitsearch")
        this.relatedCol = document.querySelector(".related__collections__data")
        this.filterSection = document.querySelector(".facet__filters")
        this.facetFilters = document.querySelector(".facetFilter__data") 
        this.minDisplay= document.querySelector("#minV"),
        this.maxDisplay= document.querySelector("#maxV"),
        this.minRange=document.querySelector("#minRange"),
        this.maxRange=document.querySelector("#maxRange"),
        this.maxProgress=document.querySelector("#progressA"),
        this.minProgress=document.querySelector("#progressB")
        this.pageCtrl = document.querySelector('.pageSelect--collection__container__pageCtrl')
        this.pageLeft = document.querySelector('#pageSelect--collection__container__left')
        this.pageRight = document.querySelector('#pageSelect--collection__container__right')
        this.filterBtn = document.querySelector('#filter__btn')
        this.sideBarWrapper = document.querySelector('#sideBar__wrapper')
        this.overLay = document.querySelector('.overlay')
        this.closeBtn = document.querySelector('#closeBtn')
        this.resultsTitle = document.querySelector("#resultsTitle")
        this.related__collections = document.querySelector("#related__collections")
    }
    // event listeners
    listenCheckBox(elm, fn, self=this, event='input'){
        elm.addEventListener(event, (e)=>{
            if(fn){
                fn(e, self)
            }
        })
    }
    listenChange = (target,fn,type, currentState, initState, self)=>{
        target.addEventListener(type,(e)=>{
            fn(target, currentState, initState, self)
        }, true)
    }

    // handlers
    checkCheckBox(e, self = this){
        const event = {
            checked:e.target.checked,
            value: e.target.value,
            field:e.target.dataset.field
         }
         return event
    }
    checkCheckBoxActive(target, self){
        const input = target.querySelectorAll('input')
        const eventArr = []
        input.forEach((el_00)=>{
            if(el_00.checked){
                eventArr.push({
                    checked:el_00.checked,
                    value:el_00.value,
                    field:el_00.dataset.field
                })
            }

        })
        return eventArr
    }
    checkMinP = (value, currentMaxP)=>{
        if(value > Number(currentMaxP) - 1){
            return Number(currentMaxP) - 1
        }
        else {
            return value
        }
    }
    checkMaxP = (value, currentMinP)=>{
        if(value < Number(currentMinP) + 1){
            return Number(currentMinP) + 1
        }
        else {
            return value
        }
    }
    
    // format response
    formatFacet(res, facetValue){
        const tagsArr = []
        res.facet_counts.forEach((el_00)=>{
            if(el_00.field_name === facetValue){
                el_00.counts.forEach((el_01)=>{
                    tagsArr.push(el_01)
                })
            }
        })
        if(tagsArr.length>0){
            return tagsArr
        }
    }
    formatRes(res){
        const changeJpgRes = (url, res)=>{
        const ind = url.indexOf('.jpg')
        const newUrl = url.slice(0,ind)+`_${res}x`+url.slice(ind)
        return newUrl
      }
        const text = res.hits.map((el, ind)=>{
            const template = `
            <div class="productCard">
                <div class="productCard__container">
                    <div class="productCard__container__media">
                        <a href = "<<href>>">
                        <div class="productCard__container__imgWrapper">
                            <img src="<<imgSrc>>" alt="" class="productCard__container__img">
                        </div>
                        </a>
                    </div>
                    <div class="productCard__container__content">
                    <<compared>>
                    <p class="productCard__container__content__price"><<price>></p>
                        <p class="productCard__container__content__vendor"><<vendor>></p>
                        <a href = "<<href>>">
                        <h4 class="productCard__container__content__title"><<title>></h4>
                        </a>
                    </div>
                </div>
            </div>`;

            const htmlString = template
              .replace(/<<href>>/g, `/products/${el.document.handle}`)
              .replace(/<<imgSrc>>/g, changeJpgRes(el.document.imgSrc, 400))
              .replace(/<<vendor>>/g, el.document.vendor)
              .replace(/<<price>>/g, `$${el.document.price}`)
              .replace(/<<compared>>/g, el.document.comparedAtPrice? `<span class="productCard__container__content__comparedPrice">$${el.document.comparedAtPrice}</span>`: "")
              .replace(/<<title>>/g, el.document.title);
            return htmlString
        })
        return text.join("")
    }
    formatTtlPages(res){
        const currentPage = res.page
        const ttlPage = Math.ceil(res.found/res.request_params.per_page)
        return {currentPage,ttlPage}
    }
    formatQueryFilters(currentState){
        const checkedEntries = Object.entries(currentState.search.checkedFilters)
        let joinedFilterQueries = []
        checkedEntries.forEach((el_00)=>{
            if(el_00[1].length>0)
            {let filterTemplate = `<<field>>:= [<<valuesArr>>]`
            let template = filterTemplate.replace('<<field>>', el_00[0])
            let values = []
            el_00[1].forEach((el_01)=>{
                values.push(el_01.value)
            })
            filterTemplate = template.replace('<<valuesArr>>', values.join(','))  
            joinedFilterQueries.push(filterTemplate)}
        })
        return joinedFilterQueries.join('&&')
        // return filterTemplate
    }
    formatPriceFilter(currentState, self){
        let template = `price:[${currentState.search.minV}..${currentState.search.maxV}]`
        // if current maxV === init maxV, format max range filter to be 10000
        if(currentState.search.maxV === self.initStates.search.maxV){
            template = template.replace(currentState.search.maxV, 10000)
        }
        return template
    }
    formatSortBy(e, self){
        let arr = []
        // if(self.currentState.search.sortbyStr.length>0){
        //     arr = self.currentState.search.sortbyStr.split(',')
        // }
        if(e.target.checked){
            self.initStates.search.sortby.forEach((el_02)=>{
                const target = document.getElementById(`checkbox__sort__${el_02}`)
                if(target !== e.target){
                    target.checked = false
                }
            })
            if(!arr.includes(e.target.value)){
                arr.push(e.target.value)
            }
        }
        if(!e.target.checked){
            if(arr.includes(e.target.value)){
                arr = arr.filter((el_01)=>{
                    return el_01 !== e.target.value
                })
            }
        }

        return arr.join(',')
    }
    formatStdFilter(e, self){
        let arr = []
        if(self.currentState.search.standardFiltersStr.length>0){
            arr = self.currentState.search.standardFiltersStr.split('&&')
        }

        if(e.target.checked){
            if(!arr.includes(e.target.value)){
                arr.push(e.target.value)
            }
        }
        if(!e.target.checked){
            if(arr.includes(e.target.value)){
                arr = arr.filter((el_01)=>{
                    return el_01 !== e.target.value
                })
            }
        }
        // console.log(arr.join('&&'))
        return arr.join('&&')
    }
    singleTranslation(string){
        const translation = [
            {ori:'series', translation:'主系列'},
            {ori:'origin', translation:'產地'},
            {ori:'vendor', translation:'品牌'},
            {ori:'subSeries', translation:'副系列'},
        ]
        let translatedString = string
        translation.forEach((el)=>{
            if (translatedString.includes(el.ori)){
                    translatedString = translatedString.replace(el.ori, el.translation)
            }
        })
        return translatedString
    }


    clearQueryFilters(currentState, self){
        self.currentState.search.checkedFilters = {}
    }
    clearFilterParams(currentState, self){
        self.currentState.search.filterParams = ""
    }
    // queries
    searchFn = async(params)=>{
        let searchParameters = {
            q         : 'glaco',
            query_by  : 'title',
            filter_by : `status:= "ACTIVE"`,
            // 'sort_by'   : 'num_employees:desc'
          }
        const res = await moobiTypeSenseClient.collections('shopify_products_zh_01').documents().search(JSON.parse(params))
        console.log(res)
        return res
    }
    searchFilterFn = async(currentState, self)=>{
        // default sortby before 19th Jan 2023
        // let sortby = "createdAt:desc"
        // default sortby after 19th Jan 2023
        let sortby = 'order:asc'

        if(currentState.search.sortbyStr){
            sortby = currentState.search.sortbyStr
        }
        let searchParameters = {
            q         : '',
            query_by  : 'title',
            facet_by: self.currentState.search.facets.join(","),
            max_facet_values:5,
            filter_by: `status:= "ACTIVE"&&published:>100&&collectionTags:=${currentState.search.collection}${currentState.search.filterParams?"&&":""}${currentState.search.filterParams||""}&&${self.formatPriceFilter(currentState, self)}${currentState.search.standardFiltersStr?"&&":""}${currentState.search.standardFiltersStr||""}`,
            sort_by:sortby,
            per_page:12,
            page:currentState.search.page,
            exclude_fields:'bodyHTML'
          }
        //   console.log(searchParameters)
        const res = await moobiTypeSenseClient.collections('shopify_GQL_test_01').documents().search(searchParameters)
        // console.log(res)
        return res
    }
    initQuery = async(initStates)=>{
        // let sortby = "createdAt:desc"
        // default sortby after 19th Jan 2023
        let sortby = 'order:asc'
        let searchParameters = {
            q         : '',
            query_by  : 'title',
            facet_by: initStates.search.facets.join(","),
            max_facet_values:5,
            filter_by: `status:= "ACTIVE"&&published:>100&&collectionTags:=${initStates.search.collection}`,
            // filter_by: `handle:wd-40-multi-use-product-100ml`,
            per_page:12,
            sort_by:sortby,
            exclude_fields:'bodyHTML'
          }
        const res = await moobiTypeSenseClient.collections('shopify_GQL_test_01').documents().search(searchParameters)
        // console.log(res)
        return res
    }
    // render elements    
    renderFacetFilter(currentState, target, self){
        const template_00 = `<h4><<field_name>></h4>`
        const template_01 = `<input type = "checkbox" data-field = <<field_name>> value = "<<value>>" id = "checkbox_<<field_name>>_<<value>>"><label for = "checkbox_<<field_name>>_<<value>>"><<value>></label>
        <span>(<<count>>)</span>`
        const templateArr = []
        currentState.response.facet.forEach((el_00, ind)=>{
            const field_name = self.singleTranslation(template_00.replace('<<field_name>>', el_00.field_name))
            const checkboxes = []
            el_00.counts.forEach((el_01)=>{
                const elm = template_01.replace(/<<value>>/g, el_01.value).replace(/<<count>>/g, el_01.count).replace(/<<field_name>>/g, el_00.field_name)
                checkboxes.push(elm)
            })
            templateArr.push(field_name+checkboxes.join(''))
            // target.insertAdjacentHTML('beforeend', field_name+checkboxes.join('<br/>'))
        })
        // target.innerHTML = templateArr.join('')
        target.insertAdjacentHTML('beforeend', templateArr.join('') )
    }
    renderActiveFacetFilter(currentState, target, self){
        const template_00 = `<h4>已選擇</h4>`
        const template_01 = `<input type = "checkbox" checked = "true" data-field = "<<active_field_name>>" value = "<<value>>" id = "checkbox_<<active_field_name>>_<<value>>">
        <label for = "checkbox_<<active_field_name>>_<<value>>"><<value>> (<<active_field_name>>)</label><br/>
        `
        const templateArr = []
        let field_name = ''
        currentState.response.activeFacet.forEach((el_00, ind)=>{
            field_name = template_00.replace('<<field_name>>', el_00.field_name)
            const checkboxes = []
            const elm = self.singleTranslation(template_01.replace(`(<<active_field_name>>)`, `(${el_00.active_field_name})`)).replace(/<<active_field_name>>/g, el_00.active_field_name).replace(/<<value>>/g, el_00.value).replace(/<<count>>/g, el_00.count).replace(/<<field_name>>/g, el_00.field_name)
            checkboxes.push(elm)
            // el_00.forEach((el_01)=>{
            // })
            templateArr.push(checkboxes.join('<br/>'))
            // target.insertAdjacentHTML('beforeend', field_name+checkboxes.join('<br/>'))
        })
        target.innerHTML = field_name + templateArr.join('')
    }
    displayRes(res){
        if (res !== this.response.innerText)
        {this.response.innerHTML = this.formatRes(res)
        }
    }
    displayFacet(dataArr){
        if(Array.isArray(dataArr)&&dataArr.length>0)
        {
            const namesArr = dataArr.map((el)=>{
                return el.value + `<br/>`
            })
            this.relatedCol.innerHTML = namesArr.join('')
        }
    }
    tickBoxes(currentState, target, self){
        const fields = Object.keys(currentState.search.checkedFilters)
        fields.forEach((el_00)=>{
            currentState.search.checkedFilters[el_00].forEach((el_01)=>{
                const box = target.querySelector(`[data-field = "${el_01.field}"][value="${el_01.value}"]`)
            })            
        })
        
        

    }
    renderTargetP = (value, target)=>{
        target.value = value
        return value
    }
    renderTargetV = (value, target, self)=>{
        target.value = "$"+value
        target.dataset.value = value
        // snippet for maxV + prices
        if(value >= self.initStates.search.maxV){
            target.value = "$"+self.initStates.search.maxV + " +" 
        }
        return value
    }
    renderProgress = (valueP, target)=>{
        target.style.width = `${valueP}%`
        return valueP
    }
    renderPageCtrl(currentState, target, self){
        target.innerHTML = ''
        const btnTemp = `<button class="pageSelect--collection__container__pages__btn" id="pageBtn__<<pageNumber>>"><<pageNumber>></button>`
        const dots = `<span class="pageSelect--collection__container__pages__dots">...</span>`
        const maxPages = 7
        let btnColTemp = []
        const ttlPage = currentState.response.ttlPage
        const currentPage = currentState.response.currentPage
        // if total pages < maxpages, show all 
        if(ttlPage <= maxPages){
            for(let i =1; i<=ttlPage; i++){
                let btn = btnTemp.replace(/<<pageNumber>>/g, i)
                btnColTemp.push(btn)
            }
            btnColTemp = btnColTemp.map((el)=>{
                if(el.includes(`"pageBtn__${currentPage}"`)){
                    return el.replace('pageSelect--collection__container__pages__btn','pageSelect--collection__container__pages__btn--active')
                } else {
                    return el
                }
            })
            target.insertAdjacentHTML('beforeend',btnColTemp.join('') )
        }
        // if total pages > maxpages, show only page 1  +/- 2 pages
        if(ttlPage > maxPages){
            if(currentPage >=4){
                btnColTemp.push(btnTemp.replace(/<<pageNumber>>/g, 1))
                // btnColTemp.push(dots)
            }
            if(currentPage >=5){
                // btnColTemp.push(btnTemp.replace(/<<pageNumber>>/g, 1))
                btnColTemp.push(dots)
            }
            for (let i = currentPage - 2; i<=currentPage; i++){
                if(i>0)
                {
                    btnColTemp.push(btnTemp.replace(/<<pageNumber>>/g, i))
                }
            }
            for (let i = currentPage + 1 ; i<=currentPage + 2; i++){
                if(i<=ttlPage){
                    btnColTemp.push(btnTemp.replace(/<<pageNumber>>/g, i))
                }
            }
            if(currentPage <= (ttlPage - 4)){
                btnColTemp.push(dots)
            }
            if(currentPage < (ttlPage -2)){
                btnColTemp.push(btnTemp.replace(/<<pageNumber>>/g, ttlPage))
            }
            btnColTemp = btnColTemp.map((el)=>{
                if(el.includes(`"pageBtn__${currentPage}"`)){
                    return el.replace('pageSelect--collection__container__pages__btn','pageSelect--collection__container__pages__btn--active')
                } else {
                    return el
                }
            })
            
            target.insertAdjacentHTML('beforeend',btnColTemp.join('') )
        }
        // add transparency to inactive button
        if(currentPage === 1){
                self.pageLeft.classList.add("inactive")
        }
        if(currentPage === ttlPage){
            self.pageRight.classList.add("inactive")
        }
        if(currentPage !== 1){
            self.pageLeft.classList.remove("inactive")
        }
        if(currentPage !== ttlPage){
            self.pageRight.classList.remove("inactive")
        }
    }
    renderSideBar(value,self){
        if(value){
            self.sideBarWrapper.style.height = '85%'
            self.overLay.style.opacity = '100'
            self.overLay.style.display = 'block'
        }
        if(!value){
            self.sideBarWrapper.style.height = '0%'
            self.overLay.style.opacity = '0'
            self.overLay.style.display = 'none'
        }
    }
    renderZeroHits(target, self){
        const template = '<h4 id = "not__found">無相關產品，請嘗試其他篩選條件。</h4>'
        target.innerHTML = ''
        target.insertAdjacentHTML('beforeend', template)
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
    setFacetValues(res, self = this){
        self.currentState.response.facet = []
        res.facet_counts.forEach((el)=>{
            self.currentState.response.facet.push(el)
        })
        self.currentState.response.facet
    }
    setCheckedFilters(event, self = this){
        if(event.checked === true){
            const currentState  = []
            currentState.push(event)
            if(self.currentState.search.checkedFilters[event.field]){
                self.currentState.search.checkedFilters[event.field].forEach((el_00)=>{
                    currentState.push(el_00)
                })
            }
            self.currentState.search.checkedFilters[event.field] = currentState
        }
        if(event.checked === false && self.currentState.search.checkedFilters[event.field]){
            if(self.currentState.search.checkedFilters[event.field]){
                self.currentState.search.checkedFilters[event.field] = self.currentState.search.checkedFilters[event.field].filter((el_01)=>{
                    return el_01.value !== event.value
                })

            }
        }
    }
    setFilterParams(params, self = this){
        self.currentState.search.filterParams = params
    }
    setActivFacet(currentState, self){
        const formatedArr = []
        const keys = Object.keys(currentState.search.checkedFilters)
        keys.forEach((el_00)=>{
            currentState.search.checkedFilters[el_00].forEach((el_01)=>{
                formatedArr.push(
                    {
                        counts: 0,
                        field_name: "active facets",
                        active_field_name: el_01.field,
                        value: el_01.value
                    }
                )

            })
        })
        currentState.response.activeFacet = formatedArr
        return formatedArr
    }
    setMinV = (currentMinP, currentState, initState)=>{
        currentState.search.minV = initState.search.maxV * currentMinP/100
        return currentState.search.minV
    }
    setMaxV = (currentMaxP, currentState, initState)=>{
        currentState.search.maxV = initState.search.maxV * currentMaxP/100
        return currentState.search.maxV
    }
    setMinP = (value, currentState)=>{
        currentState.search.minP = value
    }
    setMaxP = (value, currentState)=>{
        currentState.search.maxP = value
    }
    setSortByStr = (value, currentState)=>{
        currentState.search.sortbyStr = value
    }
    setStdFilterStr = (value, currentState)=>{
        currentState.search.standardFiltersStr = value
    }
    setPages(obj, currentState, self){
        currentState.response.ttlPage = obj.ttlPage
        currentState.response.currentPage = obj.currentPage
        // if current page> total page, setsearchpage(1), and submit search again
        if (currentState.response.ttlPage<currentState.response.currentPage){
            self.setSearchPage(1, currentState)
            self.submitSearch(currentState, self)
        }
    }
    setSearchPage(value, currentState){
        currentState.search.page = value
    }
    setSideBarStatus(boolean, currentState){
        currentState.sideBar = boolean
    }
    setScreenWidth(currentState){
        currentState.ui.screen = parseInt(window.innerWidth)
        console.log(currentState.ui.screen)
    }


    // compositions
    checkBoxCompo  (e, self = this){
        self.setCheckedFilters(self.checkCheckBox(e, self), self)
        self.setFilterParams(self.formatQueryFilters(self.currentState),self)
        // set searchPage to page 1
        self.setSearchPage(1, self.currentState)
    }
    submitSearch = async(currentState, self)=>{
        // if mobile, use/ hide mobile side bar controls
        if(window.innerWidth<=650){
            self.setSideBarStatus(false, self.currentState)
            self.renderSideBar(false, self)
        }
        // execute the search
        const res = await self.searchFilterFn(self.currentState, self)
        // handle found = 0
        if(res.found === 0 ){
            self.renderZeroHits(self.response, self)
            return "no products found"
        }
        // handle found > 0
        self.setPages(self.formatTtlPages(res), self.currentState, self)
        self.setFacetValues(res)
        self.setActivFacet(self.currentState, self)
        self.renderActiveFacetFilter(self.currentState, self.facetFilters, self)
        self.renderFacetFilter(self.currentState, self.facetFilters, self)
        self.renderPageCtrl(self.currentState, self.pageCtrl, self)
        
        self.clearQueryFilters(self.currentState, self)
        self.clearFilterParams(self.currentState, self)
        self.checkCheckBoxActive(self.facetFilters, self).forEach((el)=>{
            self.setCheckedFilters(el,self)
        })
        self.setFilterParams(self.formatQueryFilters(self.currentState),self)
        self.displayRes(res)
        // scroll to top
         window.scroll (0,0)
        // self.resultsTitle.scrollIntoView(true, {block: "start"})
        // self.tickBoxes(self.currentState, self.facetFilters, self)
        // check the boxes
    }
    rangeSelectMinCompo = (target, currentState, initState, self)=>{
        self.setMinP(self.checkMinP(target.value, currentState.search.maxP), self.currentState, initState)
        self.setMinV(currentState.search.minP, self.currentState, self.initStates)
        self.renderTargetP(currentState.search.minP, self.minRange)
        self.renderTargetV(currentState.search.minV, self.minDisplay, self)
        self.renderProgress(currentState.search.minP, self.minProgress)
    }
    rangeSelectMaxCompo = (target, currentState, initState, self)=>{
        self.setMaxP(self.checkMaxP(target.value, currentState.search.minP), self.currentState, initState)
        self.setMaxV(currentState.search.maxP, self.currentState, self.initStates)
        self.renderTargetP(currentState.search.maxP, self.maxRange)
        self.renderTargetV(currentState.search.maxV, self.maxDisplay, self)
        self.renderProgress(currentState.search.maxP, self.maxProgress)
    }
    sortByCompo = (e, self)=>{
        const sortStr = self.formatSortBy(e, self)
        self.setSortByStr(sortStr, self.currentState)
        // set searchPage to page 1
        self.setSearchPage(1, self.currentState)
    }
    standardFilterCompo(e, self){
        const stdFilterStr = self.formatStdFilter(e, self)
        self.setStdFilterStr(stdFilterStr, self.currentState)
        // set searchPage to page 1
        self.setSearchPage(1, self.currentState)
    }
    pageCtrlCompo(self){
        self.renderPageCtrl(self.currentState, self.pageCtrl, self)
        const handler = (e, self)=>{
            self.setSearchPage(Number(e.target.innerText), self.currentState)
            self.submitSearch(self.currentState, self)
        }
        self.listenCheckBox(self.pageCtrl, handler, self, 'click')
    }
    pageLRCompo(e, self){
        const value = e.target.dataset.value
        const currentPage = self.currentState.response.currentPage
        const ttlPage = self.currentState.response.ttlPage
        if(value === 'left'){
            if(currentPage>1){
                self.setSearchPage(currentPage - 1, self.currentState)
                self.submitSearch(self.currentState, self)
            }
        }
        if(value === 'right'){
            if (currentPage<ttlPage){
                self.setSearchPage(currentPage + 1, self.currentState)
                self.submitSearch(self.currentState, self)
            }
        }
    }
    filterBtnCompo(e, self){
        self.setSideBarStatus(true, self.currentState)
        self.renderSideBar(true, self)
    }
    closeBtnCompo(e, self){
        self.setSideBarStatus(false, self.currentState)
        self.renderSideBar(false, self)
    }
    

    // lifecycle
    mount = async(initStates, self = this)=>{
        const res = await self.initQuery(initStates)
        // console.log(res)
        // set current page
        self.setPages(self.formatTtlPages(res), self.currentState,self)
        // render page control
        self.pageCtrlCompo(self)
        // listen page prev/ next control
        self.listenCheckBox(self.pageLeft, self.pageLRCompo, self, 'click')
        self.listenCheckBox(self.pageRight, self.pageLRCompo, self, 'click')
        
        // filterBtn for mobile
        self.listenCheckBox(self.filterBtn, self.filterBtnCompo, self, 'click')
        // closeBtn for mobile
        self.listenCheckBox(self.closeBtn, self.closeBtnCompo, self, 'click')


        // load price range bar values
        self.renderTargetV(self.initStates.search.minV, self.minDisplay, self)
        self.renderTargetV(self.initStates.search.maxV, self.maxDisplay, self)
        // listen to price bars
        self.listenChange(self.minRange,self.rangeSelectMinCompo, 'change', self.currentState, self.initStates, self)
        self.listenChange(self.maxRange,self.rangeSelectMaxCompo, 'change', self.currentState, self.initStates, self)
        
        // set facet values as current states
        self.setFacetValues(res)
        self.renderFacetFilter(self.currentState, self.facetFilters, self)
        if(self.currentState.ui.screen >= self.currentState.ui.breakpoint){
            self.listenCheckBox(self.filterSection, self.checkBoxCompo, self,'change')

            // listen to standardFilters
            initStates.search.sortby.forEach((el)=>{
                const target = document.getElementById(`checkbox__sort__${el}`)
                self.listenCheckBox(target, self.sortByCompo, self, 'change')
                self.listenCheckBox(target, self.submitSearch, self, 'change')
            })
            // listen to sortby
            initStates.search.standardFilters.forEach((el)=>{
                const target = document.getElementById(`standardFilter__${el}`)
                self.listenCheckBox(target, self.standardFilterCompo, self, 'change')
                self.listenCheckBox(target, self.submitSearch, self, 'change')
            })

            // self.listenCheckBox(self.searchBtn, self.submitSearch, self, 'click')
            self.listenCheckBox(self.filterSection, self.submitSearch, self,'change')
            self.listenCheckBox(self.minRange, self.submitSearch, self, 'change')
            self.listenCheckBox(self.maxRange, self.submitSearch, self, 'change')

            // hide search button
            self.searchBtn.style.display = "none"
        }

        if(self.currentState.ui.screen < self.currentState.ui.breakpoint){
            // listen to standardFilters
            initStates.search.sortby.forEach((el)=>{
                const target = document.getElementById(`checkbox__sort__${el}`)
                self.listenCheckBox(target, self.sortByCompo, self, 'change')
            })
            // listen to sortby
            initStates.search.standardFilters.forEach((el)=>{
                const target = document.getElementById(`standardFilter__${el}`)
                self.listenCheckBox(target, self.standardFilterCompo, self, 'change')
            })
            console.log(self.currentState.ui.screen < self.currentState.ui.breakpoint)
            self.listenCheckBox(self.filterSection, self.checkBoxCompo, self,'change')
            self.listenCheckBox(self.searchBtn, self.submitSearch, self, 'click')
            // self.listenCheckBox(self.filterSection, self.submitSearch, self,'change')
            // self.listenCheckBox(self.minRange, self.submitSearch, self, 'change')
            // self.listenCheckBox(self.maxRange, self.submitSearch, self, 'change')
        }

        

        this.displayRes(res)
    }
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
    init = async()=>{
        const self = this
        self.mount(self.initStates)
    }
  }

  const tsWidget = new TSSearchWidget()
  tsWidget.init()