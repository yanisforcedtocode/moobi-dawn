// comparison module variables
const comparisonModuleParams = {
    hostName: "https://moobinavi.df.r.appspot.com",
    nonScoringParams: ["productHandle","productName","規格","產地","類型","鍍膜類型","成份","附贈品","可施工數"],
    shownNonScoringParams: ["規格","產地","類型","附贈品"],
    containerHTML: `<div class = "productComparison__container">
    <div class = "productComparison__container__grid2S">
        <div class = "productComparison__container__grid2S__titles">
            <titles>
        </div>
        <div class = "productComparison__container__grid2S__table">
            <div class = "productComparison__container__grid2S__table__grid5S">
                <contents>   
            </div>
        </div>
    </div>
    </div>`,
    paramsTitleHTML: `<div class = "productComparison__container__grid2S__titles__title"><title></div>`,
    tableImgHTML: `<a href = ""><img data-handle = "<handle>" data-src = "" class = "productComparison__container__grid2S__table__grid5S__img lazyload"></a>`,
    tableTitleHTML: `<div class = "productComparison__container__grid2S__table__grid5S__title"><title></div>`,
    tableScoreHTML: `<div data-handle = "<handle>" data-key = "<key>" class = "productComparison__container__grid2S__table__grid5S__score"><score></div>`,
    tablePriceHTML: `<div data-handle = "<handle>" data-key = "<key>" class = "productComparison__container__grid2S__table__grid5S__price"><score></div>`,
    greenKeys: ["研磨劑","需稀釋"],
    blueKeys: ["中性pH","雨刷水","倒鏡可用","頭盔可用","頭燈可用","濕車可用","無水洗車","含車蠟","無需拋光","玻璃適用","鍍膜車用","柴油適用","潤滑機油"],
    purpleKeys: ["需打蠟機",""],
    whiteKeys: ["呔鈴鍍膜","容易使用","去鐵粉","呔鈴清潔","輪胎清潔","增強動力","潤滑組件","清理油路","除積碳","防止積碳","節省燃油","去水漬","去油膜","容易施工","鍍膜耐力","去污","光澤","驅水","去小花痕","強化漆色"],
    yellowKeys: ["使用頻次"],
    filterParams: [7505839390970]
}

/* input targetClass, insert HTML according to recommended products */
class ProductionComparison{
    productHandle: string
    productId: number
    renderTarget: HTMLElement
    findOneData?: {
        productParameters: any
        [x: string]: any
    }
    findDocData?: any[]
    comparisonTableData?: {[x: string]: any[]}
    basicParamsData?: {[x: string]: any[]}
    filteredOneParamKeys?:string[]
    compiledHTML?: string

    constructor(){
        const idHolder = document.querySelector('[data-productid]') as HTMLElement
        this.productId = parseInt(idHolder.dataset.productid!)
        this.productHandle = window.location.href.split('/products/')[1]
        console.log(this.productHandle)
        this.renderTarget = document.querySelector("[data-productPage_engagement_type = 'productPage_engagement_comparison']")!
        this.renderComparisonOrRec()
        }

    // init
    async renderComparisonOrRec(){
        try {
            const self = this
            const data = await moobiQueries.getPdtCpr(this.productHandle)
            console.log(data)
            if (typeof data.results !== "number"){
                this.insertRecommendations('[data-productPage_engagement_type = "productPage_engagement_reccom"]', this.productId, 10, 350)
            }
            if (typeof data.results === "number"){
                this.findOneData = data.data.oneData
                this.findDocData = data.data.docData
                this.formatTableData()
                this.createHTMLBlock()
                self.renderComparison()
                this.insertAjaxAPIdata()
                this.displayCustomizations()
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Handlers
    formatTableData() {
        const findOneData = this.findOneData
        const findDocData = this.findDocData
        console.log(findOneData)
        console.log(findDocData)
        const comparisonTableData: { [x: string]: any[] } = {}
        const basicParamsData: { [x: string]: any[] } = {}
        if (findOneData && findDocData) {
            const oneParamKeys = Object.keys(findOneData.productParameters)
            const filteredOneParamKeys = oneParamKeys.filter((el) => {
                return findOneData.productParameters[el] !== null && findOneData.productParameters[el] !== ""
            })
            this.filteredOneParamKeys = filteredOneParamKeys
            filteredOneParamKeys.forEach((el) => {
                comparisonTableData[el] = []
            })
            comparisonModuleParams.nonScoringParams.forEach((el) => {
                basicParamsData[el] = []
            })
            // prepare the oneData for the rows of the comparison table
            filteredOneParamKeys.forEach((el_01) => {
                let score = findOneData.productParameters[el_01]
                comparisonTableData[el_01].push(score)
            })
            comparisonModuleParams.nonScoringParams.forEach((el2) => {
                let score = findOneData[el2]
                basicParamsData[el2].push(score)
            })

            // prepare the docData for the rows of the comparison table
            findDocData.forEach((el) => {
                filteredOneParamKeys.forEach((el_01) => {
                    let score = el.productParameters[el_01]
                    comparisonTableData[el_01].push(score)
                })
                comparisonModuleParams.nonScoringParams.forEach((el_02) => {
                    let score = el[el_02]
                    basicParamsData[el_02].push(score)
                })
            })
            this.comparisonTableData = comparisonTableData
            this.basicParamsData = basicParamsData
        }
    }

    createHTMLBlock() {
        let paramsHTML = ""
        let imgsHTML = ""
        let titlesHTML = ""
        let tableScoresHTML = ""
        let tablepricesHTML = ""
        let contentsHTML = ""
        // create <titles>
        // basic params titles
        const filteredOneParamKeys = this.filteredOneParamKeys
        const basicParamsData = this.basicParamsData
        const comparisonTableData = this.comparisonTableData
        console.log(filteredOneParamKeys)
        console.log(basicParamsData)
        console.log(comparisonTableData)

        if (filteredOneParamKeys && basicParamsData && comparisonTableData) {
            console.log('passed check and render stuff')
            comparisonModuleParams.shownNonScoringParams.forEach((el) => {
                let paramHTML = comparisonModuleParams.paramsTitleHTML.replace("<title>", el)
                paramsHTML += paramHTML
            })
            // featured params titles
            filteredOneParamKeys.forEach((el) => {
                let paramHTML = comparisonModuleParams.paramsTitleHTML.replace("<title>", el)
                paramsHTML += paramHTML
                //console.log(paramHTML)
            })
            // add params: price
            let paramPrice = comparisonModuleParams.paramsTitleHTML.replace("<title>", "價錢")
            paramsHTML += paramPrice

            // create <content>
            // imgs
            basicParamsData.productHandle.forEach((el) => {
                let imgHTML = comparisonModuleParams.tableImgHTML.replace("<handle>", el)
                imgsHTML += imgHTML
            })
            // titles
            basicParamsData.productName.forEach((el) => {
                let trimmedName = el.slice(0, 23) + "..."
                let titleHTML = comparisonModuleParams.tableTitleHTML.replace("<title>", trimmedName)
                titlesHTML += titleHTML
            })

            // tableScores
            // basic params scores
            comparisonModuleParams.shownNonScoringParams.forEach((el) => {
                basicParamsData[el].forEach((el1) => {
                    let scoreHTML = comparisonModuleParams.tableScoreHTML.replace("<score>", el1)
                    scoreHTML = scoreHTML.replace("<key>", el)
                    tableScoresHTML += scoreHTML
                })
            })

            // featured params scores
            filteredOneParamKeys.forEach((el) => {
                comparisonTableData[el].forEach((el1) => {
                    let scoreHTML = comparisonModuleParams.tableScoreHTML.replace("<score>", el1)
                    scoreHTML = scoreHTML.replace("<key>", el)
                    tableScoresHTML += scoreHTML
                })
            })
            // price scores
            basicParamsData.productHandle.forEach((el) => {
                let priceHTML = comparisonModuleParams.tablePriceHTML.replace("<handle>", el)
                tablepricesHTML += priceHTML
            })

            // compile HTML
            contentsHTML = imgsHTML + titlesHTML + tableScoresHTML + tablepricesHTML
            let compiledHTML = comparisonModuleParams.containerHTML.replace("<titles>", paramsHTML)
            compiledHTML = compiledHTML.replace("<contents>", contentsHTML)
            this.compiledHTML = compiledHTML
        }
    }

    renderComparison() {
        console.log(this.renderTarget)
        console.log( this.compiledHTML)
        if (this.renderTarget && this.compiledHTML) {
            this.renderTarget.insertAdjacentHTML("beforeend", this.compiledHTML)
        } else {
            console.log('target for comparison rendering not found')
        }
    }

    async insertAjaxAPIdata() {
        const productImg = document.querySelectorAll(`.productComparison__container__grid2S__table__grid5S__img`) as NodeListOf<HTMLImageElement>
        const productPrice = document.querySelectorAll(`.productComparison__container__grid2S__table__grid5S__price`) as NodeListOf<HTMLElement>
        const productImageArray = Array.from(productImg)

        for (let image of productImageArray) {
            const productHandle = image.dataset.handle
            if (productHandle) {
                // call shopify ajaxAPI to get product data 
                const parsedResponse = await moobiQueries.getPdtDetails(productHandle)
                const obj = parsedResponse.data
                console.log(obj)
                let img_url = obj.image.src
                let index = img_url.indexOf(".jpg")
                let img_url_100x = img_url.slice(0, index) + "_100x" + img_url.slice(index, -1)
                // insert imgUrl from ajaxAPI
                image.src = img_url_100x
                // insert link from ajaxAPI
                const imageWrapper = image.parentElement as HTMLLinkElement
                imageWrapper.href = `/products/${productHandle}`
                productPrice.forEach((el) => {
                    if (el.dataset.handle === productHandle) {
                        el.innerText = "$" + obj.variants[0].price.slice(0, -1)
                    }
                })
            }
        }
    }

    displayCustomizations() {
        const tick = `<i style = "color:#49d900" class="fas fa-check-circle"></i>`
        const cross = `<i style = "color:#666" class="fas fa-times-circle"></i>`
        const scores = document.querySelectorAll(".productComparison__container__grid2S__table__grid5S__score") as NodeListOf<HTMLElement>
        //const titles = document.querySelectorAll(".productComparison__container__grid2S__titles__title")
        scores.forEach((el, ind) => {
            //console.log(el.dataset.key)
            comparisonModuleParams.greenKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText)
                    //console.log(value)
                    if (value === 1) { el.innerHTML = tick }
                    if (value === -1) { el.innerHTML = cross }
                    if (!value) { el.innerHTML = "" }
                }
            })
            comparisonModuleParams.blueKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText)
                    //console.log(value)
                    if (value > 0) { el.innerHTML = tick }
                    if (value <= 0) { el.innerHTML = "" }
                    if (!value) { el.innerHTML = "" }
                }
            })
            comparisonModuleParams.purpleKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText)
                    //console.log(value)
                    if (value === 0) { el.innerHTML = tick }
                    if (value === 1) { el.innerHTML = cross }
                    if (value !== 0 && value !== 1) { el.innerHTML = "" }
                }
            })
            comparisonModuleParams.whiteKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = parseInt(el.innerText)
                    const star = `<i class="fas fa-star"></i>`
                    let stars = ""
                    //console.log(value)
                    if (value > 0) {
                        for (let i = 0; i < value; i++) {
                            stars += star
                        }
                        el.innerHTML = stars
                    }
                    if (!value) { el.innerHTML = "" }
                }
            })
            comparisonModuleParams.yellowKeys.forEach((el1) => {
                if (el.dataset.key === el1) {
                    const value = el.innerText
                    if (value === "null") {
                        el.innerHTML = ""
                    }
                    if (value !== "null") { el.innerHTML = value }
                }
            })
        })
    }

    filterRecommendations(element: { id: string }, params: any[]) {
        let match = false
        params.forEach((el) => {
            const elID = parseInt(element.id)
            el === elID ? match = el : ""
        })
        return !match
    }

    async insertRecommendations(targetSelector: string, id: number, limit: number, imgRes: number) {
        try {
            const target = document.querySelector(`${targetSelector}`)
            const data = await moobiQueries.getRecommendationsbyProductId(id, limit)
            console.log(data)
            const productsData: any[] = data.products
            if (target) {
                productsData.forEach((el, ind) => {
                    const filterResult = this.filterRecommendations(el, comparisonModuleParams.filterParams)
                    if (ind <= limit - 1 && filterResult) {
                        const index = el.images[0].indexOf(".jpg") || el.images[0].indexOf(".png")
                        target.insertAdjacentHTML("beforeend", `
                        <a href = "/products/${el.handle}">
                            <div class = "productreccom__section__container__item">
                                <div class = "productreccom__section__container__item__imgholder">
                                    <img data-src = "${el.images[0].slice(0, index)}_${imgRes}x${el.images[0].slice(index)}" class = "productreccom__section__container__item__imgholder__img lazyload">
                                </div>
                                <div class = "productreccom__section__container__item__txtholder">
                                    <p class = "productreccom__section__container__item__txtholder__title">${el.title}</p>
                                <div class = "productreccom__section__container__item__txtholder__priceholder">
                                    <p class = ${el.compare_at_price ? "productreccom__section__container__item__txtholder__price--red" : "productreccom__section__container__item__txtholder__price"}>$${(Math.round(el.price / 100)).toFixed(2)}</p>
                                    <p class = "productreccom__section__container__item__txtholder__priceatcomparison">${!el.compare_at_price ? "" : "$"}${!el.compare_at_price ? "" : el.compare_at_price / 100}</p>
                                </div>
                                </div>
                            </div>
                        </a>
                `)
                    }
                })
            }
        } catch (e) { console.log(e) }
    }
}

const insertComparison = new ProductionComparison()