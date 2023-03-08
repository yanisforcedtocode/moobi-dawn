'use strict'
class TS_AC {
  constructor() {
    this.initState = {
      search: {
        rawQuery: false,
        formatedQuery: false,
        searchParams: false,
        isSubmited: false,
        submitTime: false,
        searchTime: false,
        isListOpen: false,
        facets:["tags"],
        filterby:{},
        getPage:1,
        hitsPerPage: 6,
        facetLimit: 6,
        facetKeep: 4,
        summaryLimit: 60
      },
      response: {
        facet: [],
        activeFacet: [],
        ttlPage: 1,
        currentPage: 1,
        tsResponse: false,
        tsQuery: false,
        matchTokens:[],
        currentPage:1,
        ttlPage:1,
        allFacets:[]
      },
    };
    // Elements
    this.currentState = JSON.parse(JSON.stringify(this.initState));
    this.textInput = document.querySelector(
      "#TS__AC__section__container__textField"
    );
    this.dataList = document.querySelector(
      "#TS__AC__section__container__dataList"
    );
    this.searchBtn = document.querySelector(
        "#TS__AC__section__container__searchBtn"
    );
    this.searchResults = document.querySelector(
        "#TS__AC__results"
    );
    this.filters = document.querySelector("#TS__AC__fitlers__container")
    this.pageBtnNxt = document.querySelector("#pageSelect__container__right")
    this.pageBtnPrev = document.querySelector("#pageSelect__container__left")
    this.pageNum = document.querySelector("#pageSelect__container__pageNum")
  }
  // listeners
  listenToElm(elm, fn, self = this, event = "input") {
    elm.addEventListener(event, (e) => {
      if (fn) {
        fn(e, self);
      }
    });
  }
  callByInterval(elm, fn, self = this, event = "input") {
    setInterval(fn, 500, elm, self, event);
  }
  recursiveFn(elm, fn, self = this, event = "input") {
    const myPromise = new Promise((resolve) => {
      fn(resolve, self);
    });
  }
  // handlers
  limitQueryRate(ms, self) {
    const triggerTime = Date.now();
    if (!self.currentState.search.submitTime) {
      self.currentState.search.submitTime = triggerTime;
      return true;
    }
    if (
      self.currentState.search.submitTime &&
      triggerTime - self.currentState.search.submitTime > ms
    ) {
      self.currentState.search.submitTime = Date.now();
      return true;
    }
    if (
      self.currentState.search.submitTime &&
      triggerTime - self.currentState.search.submitTime <= ms
    ) {
    //   console.log(`query over limited rate at ${ms}ms`);
      return false;
    } else return false;
  }
  limitSearchRate(ms, self) {
    const triggerTime = Date.now();
    if (!self.currentState.search.searchTime) {
      self.currentState.search.searchTime = triggerTime;
      return true;
    }
    if (
      self.currentState.search.searchTime &&
      triggerTime - self.currentState.search.searchTime > ms
    ) {
      self.currentState.search.searchTime = Date.now();
      return true;
    }
    if (
      self.currentState.search.searchTime &&
      triggerTime - self.currentState.search.searchTime <= ms
    ) {
    //   console.log(`query over limited rate at ${ms}ms`);
      return false;
    } else return false;
  }
  // format
  removeHTMLTags(str){
    if ((str===null) || (str===''))
        return false;
    else{
      str = str.toString();
    }
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}
  formatDataList(res, self) {
    let dataListArr = []
    if (res?.hits?.length >= 1) {
      res.hits.forEach((el_01) => {
        if (el_01?.highlights?.length >= 0) {
          el_01.highlights.forEach((el_02) => {
            if (el_02?.matched_tokens?.length >= 0) {
              el_02.matched_tokens.forEach((el_03) => {
                dataListArr.push(el_03)
              });
            }
          });
        }
      });
      // lowercase doesn't apply for chinese
      // dataListArr = dataListArr.map((el)=>{
      //   if(el){
      //     return el.toLowerCase().replace(",","").replace(".","")
      //   }
      // })
      dataListArr.forEach((el, ind, arr)=>{
          arr.forEach((el_01, ind_01)=>{
              if(JSON.stringify(el) === JSON.stringify(el_01) && ind !== ind_01){
                arr[ind] = ""
              }
          })

      })
    //   dataListArr = dataListArr.filter((el, ind, arr)=>{
    //       console.log(arr.indexOf(el, (arr.indexOf(el)+1)))
    //       return arr.indexOf(el, (arr.indexOf(el)+1)) === -1
    //   })
      return dataListArr
    }
  }
  formatSearchResult(res, self){
      const dataArr = []
    if (res?.hits?.length >= 1) {
          res.hits.forEach((el_01) => {
            if (el_01?.document) {
                dataArr.push({
                    summary:self.removeHTMLTags(el_01.document.summary_html),
                    handle:el_01.document.handle,
                    blog_id: el_01.document.blog_id,
                    title: el_01.document.title,
                    imageSrc:el_01.document['image.src'],
                    created_at: el_01.document.created_at
                    // no url
                })
            }
          });
          return dataArr
        }
  }
  formatFacets(res, self){
    const facets = res.facet_counts.map((el_01)=>{
      const obj = {
        fieldName: el_01.field_name,
        values: el_01.counts.map((el)=>{return el.value})
      }
      return obj
    })
    return facets
  }
  formatFilterStr(self){
    const filterObj = self.currentState.search.filterby
    let arr = Object.entries(filterObj)
    let filterArr = []
    if (Object.keys(filterObj).length>=1) {
      filterArr = arr.map((el)=>{
        return el[0]+":="+el[1]
      })
    }
    let filterStr = ""
    if(Array.isArray(filterArr) && filterArr.length >= 1){
      filterStr = filterArr.join("&&")
    }
    return filterStr
  }
  limitStrLength(str, limit = this.initState.search.summaryLimit){
    if(str.length > limit){
      str = str.slice(0,limit) + "..."
    }
    return str
  }
  randomizeFacets(
    res, limit = this.initState.search.facetLimit, 
    keep = this.initState.search.facetKeep, self){
    const allFacets = self.currentState.response.allFacets
    let facets = res.facet_counts[0].counts
    let spliceItr = 0
    const keepInd = keep - 1
    const genRandom = (max)=>{
      const randomInd = Math.ceil(Math.random()*(max)) - 1
      return randomInd
    }
    const removeElByind = (array, ind)=>{
      array.splice(ind, 1)
    }
    // remove random el from facet if its longer than limit
    if(Array.isArray(facets) && facets.length > limit){
      const checkedTag = self.currentState.search.filterby.tags
      spliceItr = facets.length - limit
      for (let i = 0; i<spliceItr; i++){
        const maxLoop = 20
        let whileItr = 0
        let ranInd = genRandom(facets.length)
        // redraw if the tag is checked or its within keep range
        while(ranInd <= keepInd || facets[ranInd].value === checkedTag ){
          if(whileItr<maxLoop){
            whileItr++
          }
          if(whileItr>= maxLoop){
            break
          }
          ranInd = genRandom(facets.length)
        }
        
        removeElByind(facets, ranInd)
      }
    }
    // add random el from facet if its shorter than limit
    if(Array.isArray(facets) && facets.length < limit){
      // spliceItr = facets.length - limit
      const itr = limit - facets.length
      for (let i = 0; i<itr; i++){
        const maxLoop = 15
        let whileItr = 0
        const facetsVals = facets.map((el)=>{return el.value})
        let ranInd = genRandom(allFacets.length)
        while(facetsVals.includes(allFacets[ranInd].value)){
          if(whileItr<maxLoop){
            whileItr++
          }
          if(whileItr>= maxLoop){
            break
          }
          ranInd = genRandom(facets.length)
        }
        facets.push(allFacets[ranInd])
      }
    }
    res.facet_counts[0].counts = facets
    return res
  }
  blogId2Blog(id){
    const map  = {
      81470783671:"wisdom-car-beauty",
      81471045815:"wisdom-startup",
      81470161079:"wisdom-repairs",
      83330367738:"car-repairs-tutorial",
    }
    return map[id]
  }
  

  // render
  renderFilters(target, arr, self){
    const optionTemplate = `
    <input type = "checkbox" data-fieldname = "<<field_name>>" id = "box__<<value>>" value="<<value>>">
    <label for="box__<<value>>"><<value>></label>
    `
    const selectTemplate = `
    <div class="TS__AC__fitlers__container__item" >
      <label for="select__<<field_name>>"><<field_name>></label>
      <div data-fieldName = "<<field_name>>" class = "TS__AC__fitlers__container__item__select" name="select__<<field_name>>" id="select__<<field_name>>">
      <<options>>
        </div>
    </div>
    `
    let html = []
    if(Array.isArray(arr) && arr.length>=1){
      arr.forEach((el_01)=>{
        let select = selectTemplate.replace(/<<field_name>>/g, el_01?.fieldName)
        let optionsArr = []
        el_01?.values.forEach((el_02)=>{
          optionsArr.push(optionTemplate.replace(/<<value>>/g, el_02))
        })
        select = select.replace("<<options>>", optionsArr.join(""))
        select = select.replace(/<<field_name>>/g, el_01?.fieldName)
        html.push(select)
      })
    }
    target.innerHTML = html.join("")
    // check checked filters
    const filterObj = self.currentState.search.filterby
    let inputs = target.querySelectorAll('input')
    inputs = Array.from(inputs)
    // change styles according to self.currentState.search.filterby
    if(inputs.length > 0){
      inputs.forEach((el)=>{
        if(el.value === filterObj.tags){
          el.checked = true
          el.classList.add('active')
        }
      })
    }
  }
  renderDataList(target, arr, self) {
      const template = `<li><<match_token>></li>`
      if(Array.isArray(arr) && arr.length >= 1){
          const sorted = arr.sort((a,b)=>{return a.length - b.length})
          let html = ""
          sorted.forEach((el)=>{
            if(el){
                const list = template.replace('<<match_token>>', el)
                html = html + list
            }
          })
          target.innerHTML = html
      }
      else{
        target.innerHTML = ""
      }
  }
  renderInputValue(target, value, self){
      target.value = value
  }
  renderListDisplay(target, boolean, self){
      if(boolean){
          target.style.display = 'block'
      }else{
          target.style.display = 'none'
      }
  }
  renderSearchResult(target, arr, self){
    // console.log(arr)
      if(Array.isArray(arr) && arr?.length>0){
          const template = `
            <div class="TS__AC__results__container__grid__card">
            <a href = "/blogs<<link>>">
                <div class="TS__AC__results__container__grid__card__media">
                    <div class="TS__AC__results__container__grid__card__media__imgWrapper">
                        <img src = "<<imgSrc>>" class="TS__AC__results__container__grid__card__media__img loading = "lazy">
                    </div>
                </div>
                </a>
                <div class="TS__AC__results__container__grid__card__content">
                <a href = "<<link>>">
                    <h4 class="TS__AC__results__container__grid__card__content__title"><<title>></h4>
                    </a>
                    <p class="TS__AC__results__container__grid__card__content__created"><<created>></p>
                    <p class="TS__AC__results__container__grid__card__content__description"><<summary>></p>
                </div>
            </div>`
          let html = ''
          arr.forEach((el)=>{
            const date = new Date(el.created_at)
            const [month, day, year] = [date.getMonth(), date.getDate(), date.getYear()]
              const card = template
                .replace("<<imgSrc>>", el.imageSrc)
                .replace(/<<link>>/g, `/${self.blogId2Blog(el.blog_id)}/${el.handle}`)
                .replace("<<title>>", el.title)
                .replace("<<summary>>", self.limitStrLength(el.summary, undefined))
                .replace("<<created>>", date.toLocaleDateString());
              html = html + card
          })
          target.innerHTML = html
          self.renderPreTag(target, self)
      }
      else{
        target.innerHTML = "<p>無相關搜尋結果。 </p>"
      }
  }
  renderPageNum(target, self){
    const currentPage = self.currentState.response.currentPage
    const ttlPage = self.currentState.response.ttlPage
    target.innerText = `${currentPage}/${ttlPage}`
  }
  renderLRStyle(self){
    self.pageBtnNxt.classList.remove('inactive')
    self.pageBtnPrev.classList.remove('inactive')
    // console.log(self.currentState.response.ttlPage)
    if(self.currentState.response.currentPage === 1){
      self.pageBtnPrev.classList.add('inactive')
    }
    if(self.currentState.response.currentPage === self.currentState.response.ttlPage || self.currentState.response.ttlPage === 1 ){
      self.pageBtnNxt.classList.add('inactive')
    }
  }
  renderPreTag(target, self){
    let cards = target.querySelectorAll(".TS__AC__results__container__grid__card")
    cards = Array.from(cards)
    cards.forEach((el, ind)=>{
      const a = el.querySelector("a")
      if(a.href.includes("car-repairs-tutorial")){
        const imgWrapper = el.querySelector(".TS__AC__results__container__grid__card__media__imgWrapper")
        imgWrapper.classList.add("PRE")
      }
    })
  }
  emptyQueryField(target, self){
    // console.log(target.value)
    target.value = ""
  }


  // query
  getFacets = async (self = this, ms = 100) => {
    // article tags facet when mounted
    let searchParameters = {
      q: "*",
      query_by: "body_html,title,tags,handle",
      per_page: 0,
      page: 1,
      facet_by: self.initState.search.facets.join(","),
      limit_hits: 100,
      include_fields: "title",
      sort_by: "created_at:desc"
    };
    const res = await moobiTypeSenseClient
      .collections("shopify_articles_zh_01")
      .documents()
      .search(searchParameters);
    // console.log(res)
    return res;
  };
  getTokenByQuery = async (self = this, ms=1000) => {
    if (!self.limitQueryRate(ms, self)) {
      return `query over limited rate at ${ms}ms`;
    }
    if (!self.currentState.search.rawQuery) {
    //   console.log(`empty query`);
      return `empty query`;
    }
    let searchParameters = {
      q: self.currentState.search.rawQuery,
      query_by: "title,body_html,tags",
      per_page: 10,
      limit_hits: 10,
      include_fields: "handle",
      drop_tokens_threshold: 0,
      num_typos:0,
      pre_segmented_query:"no",
      prioritize_exact_match: "true",
      sort_by: "_text_match:desc"     
    };
    const res = await moobiTypeSenseClient
      .collections("shopify_articles_zh_01")
      .documents()
      .search(searchParameters);
    // console.log(res);
    self.setTSQuery(res, self);
    self.setMatchTokens(self.formatDataList(res, self), self)
    self.renderDataList(self.dataList, self.currentState.response.matchTokens, self )
    return res;
  };
  getDocByQuery = async (self = this, ms = 100) => {
    if (!self.currentState.search.rawQuery) {
      return `empty query`;
    }
    // console.log(self.currentState.search.getPage)
    const filterStr = self.formatFilterStr(self)
    let searchParameters = {
      q: self.currentState.search.rawQuery,
      query_by: "body_html,title,tags,handle",
      filter_by: filterStr || "",
      per_page: self.currentState.search.hitsPerPage,
      page:1,
      limit_hits: 100,
      facet_by: self.initState.search.facets.join(","),
      drop_tokens_threshold: 0,
      num_typos:0,
      pre_segmented_query:"no",
      prioritize_exact_match: "true",
      include_fields: "handle,title,image.src,summary_html,created_at,blog_id",
      sort_by: "_text_match:desc"     
    };
    const res = await moobiTypeSenseClient
      .collections("shopify_articles_zh_01")
      .documents()
      .search(searchParameters);
    // console.log(res);
    return res;
  };
  getDocByFilter = async(self = this, ms = 100) =>{
    const filterStr = self.formatFilterStr(self)
    // self.setRawQuery("*", self)
    // console.log(self.currentState.search.rawQuery)
    let searchParameters = {
      q: self.currentState.search.rawQuery,
      query_by: "body_html,title,tags,handle",
      filter_by: filterStr || "",
      per_page: self.currentState.search.hitsPerPage,
      page:self.currentState.search.getPage,
      facet_by: self.initState.search.facets.join(","),
      limit_hits: 100,
      include_fields: "handle,title,image.src,summary_html,created_at,blog_id",
      sort_by: "_text_match:desc,created_at:desc"
    };
    const res = await moobiTypeSenseClient
      .collections("shopify_articles_zh_01")
      .documents()
      .search(searchParameters);
      // console.log(searchParameters)
    // console.log(res);
    self.setCurrentPage(res, self)
    self.setTotalPage(res, self)
    // console.log(res)
    return res;
  }
  // set State
  setAllFacets(res, self){
    self.currentState.response.allFacets = res.facet_counts[0].counts
    // self.currentState.response.allFacets.forEach((el)=>{console.log(el.value)})
  }
  setGetPage(value, self){
    if(value){
      self.currentState.search.getPage = value
    }
    return self.currentState.search.getPage
  }
  setCurrentPage(res, self){
    if(res?.page){
      self.currentState.response.currentPage = res.page
    } 
    // if(res.found === 0){
    //   self.currentState.response.currentPage = 1
    // }
    else {
      self.currentState.response.currentPage = 1
    }
    return self.currentState.response.currentFilter
  }
  setTotalPage(res, self){
    if(res?.found || res.found === 0){
      const totalHits = res.found
      const perPage = self.currentState.search.hitsPerPage
      let ttlPage = Math.ceil(totalHits/ perPage)
      if(totalHits === 0){
        ttlPage = 1
      }
      self.currentState.response.ttlPage = ttlPage
      // console.log(self.currentState.response.ttlPage)
    }
  }
  setFilterBy(obj, self){
    const keys = Object.keys(obj)
    const currentFilter = self.currentState.search.filterby
    keys.forEach((el_01)=>{
      currentFilter[el_01] = obj[el_01]
    })
    // remove value "*" || "" key value pairs
    Object.entries(currentFilter).forEach((el)=>{
      if(el[1] === "*" || el[1] === ""){
        delete currentFilter[el[0]]
      }
    })
  }
  setIsListOpen(boolean, self, handler = ""){
    const closeDataList = (e)=>{
      if(e.target !== self.dataList){
        self.setIsListOpen(false, self)
        self.renderListDisplay(self.dataList, false, self)
        document.removeEventListener('click', closeDataList)
      }
    }
    if(boolean === true){
      self.currentState.search.isListOpen = boolean;
      document.addEventListener('click',closeDataList)
    }
    // if(boolean === false){
    //   console.log('remove')
    //   document.removeEventListener('click', closeDataList)
    // }
  }
  setRawQuery(value, self) {
    self.currentState.search.rawQuery = value;
  }
  setTSQuery(res, self) {
    self.currentState.response.tsQuery = res.request_params.q;
  }
  setMatchTokens(arr, self){
    self.currentState.response.matchTokens = arr
  }
  // composition
  textInputCompo = async (event, self = this) => {
    if (event.target.value === self.currentState.search.rawQuery) {
      return;
    }
    if (event.target.value !== self.currentState.search.rawQuery) {
      self.setRawQuery(event.target.value, self);
      self.setIsListOpen(true, self)
      self.renderListDisplay(self.dataList,self.currentState.search.isListOpen, self)
      const res = await self.getTokenByQuery(self);
    }
  };
  async dataListCompo(e, self){
      self.setRawQuery(e.target.innerText, self)
      self.renderInputValue(self.textInput, self.currentState.search.rawQuery, self)
      self.setIsListOpen(false, self)
      self.renderListDisplay(self.dataList,self.currentState.search.isListOpen, self)
      self.setGetPage(1, self)
      await self.submitSearchCompo(e, self, 100)
  }
  recursiveInputCompo = async (target = self.textInput, self = this) => {
    if (target.value === self.currentState.response.tsQuery) {
    //  console.log("same query");
    }
    if (target.value !== self.currentState.response.tsQuery) {
    //  console.log("new query" + " " + self.currentState.search.rawQuery);
      self.setRawQuery(target.value, self);
      const res = await self.getTokenByQuery(self);
    }
    setTimeout(
      self.recursiveInputCompo,
      800,
      (target = self.textInput),
      (self = this)
    );
  };
  submitSearchCompo = async (event, self = this, ms = 50)=>{
    try{
    if (!self.limitQueryRate(ms, self)) {
        return `query over limited rate at ${ms}ms`;
      }
    const res = await self.getDocByFilter(self)
    self.setFiltersCompo(self, 100, res)
    self.renderSearchResult(self.searchResults, self.formatSearchResult(res, self), self)
    self.renderLRStyle(self)
    self.renderPageNum(self.pageNum, self)
  }catch(err){console.log(err)}
  }
  submitQueryCompo = async (event, self = this, ms = 100)=>{
    if (!self.limitQueryRate(ms, self)) {
        return `query over limited rate at ${ms}ms`;
      }
      if(event.keyCode &&  event.keyCode!== 13 ){
        // console.log('not enter')
        return `press enter key to submit`
      }
      self.setGetPage(1, self)
      self.setFilterBy({tags:"*"}, self)
      const res = await self.getDocByFilter(self)
      // console.log(res)
      self.setFiltersCompo(self, 100, res)
      self.setTotalPage(res, self)
    self.renderSearchResult(self.searchResults, self.formatSearchResult(res, self), self)
    self.renderLRStyle(self)
    self.renderPageNum(self.pageNum, self)
  }
setFiltersCompo = async(self = this, ms = 100, res = 'undefined')=>{
  if(res === 'undefined'){
    (async()=>{
      res = await self.getFacets(self, ms)
      self.setAllFacets(res, self)
      res = self.randomizeFacets(res, undefined, undefined, self)
      const facets = self.formatFacets(res)
      self.renderFilters(self.filters, facets, self)
      self.listenToElm(self.filters.querySelector('.TS__AC__fitlers__container__item'), self.getByFilterCompo, self, "change")
    })()
  }
  if(res !== 'undefined'){
    res = self.randomizeFacets(res, undefined, undefined, self)
    const facets = self.formatFacets(res)
    self.renderFilters(self.filters, facets, self)
    self.listenToElm(self.filters.querySelector('.TS__AC__fitlers__container__item'), self.getByFilterCompo, self, "change")
  }
}
getByFilterCompo = async(event, self = this, ms = 100)=>{
  if(event.target.value && event.target.tagName === "INPUT"){
    const checkedBox = event.target
    let checkboxes = self.filters.querySelectorAll('input')
    checkboxes = Array.from(checkboxes)
    // remove active class for all boxes
    // checkboxes.forEach((el)=>{
    //   el.classList.remove('active')
    // })
    // checked one new box
    if(checkedBox.checked){
      checkboxes.forEach((el)=>{
        if(el !== checkedBox){
          el.checked = false
        }
      })
    }
    // filter only checked boxes
    checkboxes = checkboxes.filter((el)=>{
      if (el.checked){
        return true
      }
      else {
        return false
      }
    })
    // console.log(checkboxes)
    const filterObj = {}
    if(Array.isArray(checkboxes) && checkboxes.length>0){
      filterObj[checkboxes[0].dataset.fieldname]=checkboxes[0].value
    }
    if(Array.isArray(checkboxes) && checkboxes.length<=0){
      filterObj[checkedBox.dataset.fieldname]=""
    }
    // console.log(filterObj)
    self.setFilterBy(filterObj, self)
    self.setGetPage(1, self)
    self.emptyQueryField(self.textInput, self)
    self.setRawQuery("*", self)
    await self.submitSearchCompo()
  }
  self.filters.removeEventListener("change", self.getByFilterCompo)
}
pageLRCompo(e, self){
  const value = e.target.dataset.value
  const currentPage = self.currentState.response.currentPage
  const ttlPage = self.currentState.response.ttlPage
  if(value === 'left'){
    if(currentPage>1){
      (async()=>{
      self.setGetPage(currentPage - 1, self)
      self.submitSearchCompo("",self, 100)
    })()
      }
  }
  if(value === 'right'){
    if (currentPage<ttlPage){
      (async()=>{
          self.setGetPage(currentPage + 1, self)
          self.submitSearchCompo("",self, 100)
        })()
      }
  }
}
initSearchCompo = async(self)=>{
    const res = await self.getDocByFilter(self)
    self.renderSearchResult(self.searchResults, self.formatSearchResult(res, self), self)
    self.renderLRStyle(self)
    self.renderPageNum(self.pageNum, self)
    // console.log(res)
    return res
}

  // mount
  mount = async (self) => {
    try{
    self.setRawQuery("*", self)
    await self.setFiltersCompo(self, 100)
    await self.initSearchCompo(self)
    // listen to control mechanisms
    self.listenToElm(self.textInput, self.textInputCompo, self, "input");
    self.listenToElm(self.dataList, self.dataListCompo, self, "click");
    self.recursiveInputCompo(self.textInput, self);
    self.listenToElm(self.searchBtn, self.submitQueryCompo, self, "click")
    self.listenToElm(self.textInput, self.submitQueryCompo, self, "keyup")
    self.listenToElm(self.pageBtnPrev, self.pageLRCompo, self, "click")
    self.listenToElm(self.pageBtnNxt, self.pageLRCompo, self, "click")
  }catch(err){console.log(err)}
  };
  // init
  init = async (self = this) => {
    self.mount(self);
  };
}

const acBox = new TS_AC
acBox.init()