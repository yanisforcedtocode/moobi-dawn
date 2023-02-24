interface SmartCollection {
    id: number;
    title: string;
    type: string;
    products: Products[];
    handle: string;
    description: string;
}

interface Products {
    id: number;
    title: string;
    vendor: string;
    product_type: string;
    created_at: Date;
    handle: string;
    updated_at: Date;
    published_at: Date;
    template_suffix: string;
    status: string;
    published_scope: string;
    tags: string;
    admin_graphql_api_id: string;
    image: Image;
    price: number;
}

interface Image {
    id: number; 
    product_id: number; 
    position: number; 
    created_at: Date;  
    updated_at: Date; 
    alt: string; 
    width: number; 
    height: number; 
    src: string; 
    variant_ids: number[]; 
    admin_graphql_api_id: string;
}

interface FormatedResponse {
    collection: {
        title: string;
        description: string;
        url: string;
    };
    featuredpdt: {
        id: number;
        handle: string;
        imgUrl: string;
        price: number;
        title: string;
        url: string;
        vendor: string;
    };
    pdtlist: {
        id: number;
        handle: string;
        imgUrl: string;
        price: number;
        title: string;
        url: string;
        vendor: string;
    }[];
}

class GetProductListfromLog {
    initState: {
        key: string
    }
    topProductData?: {
        id: number,
        handle: string,
        tags: string[]
    }
    constructor() {
        this.initState = {
            key: 'moobiPdtLog',
        }
    }

    async initProductListfromLog() {
        try {
            this.getTopProductInfo()
            if(this.topProductData){
                const suggestedProductList = await moobiQueries.getPdtLists(this.topProductData.tags)
                return suggestedProductList as SmartCollection
            }else{
                return false
            }
        } catch (err) {
            console.log(err)
        }
    }
    
    // handlers
    getTopProductInfo(){
        const localObj = this.readLocal()
        if(localObj){
            const topProductKey = this.getTopProductKey(localObj)
            const topProductData = this.getIdHandleTags(topProductKey)
            this.topProductData = topProductData
            return topProductData
        }else{
            return false
        }
    }

    
    // read local storage by key and return the JSON string
    readLocal() {
        const object = localStorage.getItem(this.initState.key)
        if (object) {
            return object
        } else return false
    }

    // sort and return the handle with highest visit time
    getTopProductKey(jsonStr: string) {
        let object: {[x:string]:number} = JSON.parse(jsonStr)
        let entries = Object.entries(object)
        entries.sort(function (a, b) {
            return b[1] - a[1]
        })
        let key = ''
        entries.forEach((el, ind) => {
            if (ind === 0) {
                key = el[0]
            }
        })
        return key
    }

    // getIdandHandlefromKey
    getIdHandleTags(key: string) {
        const keyArr = key.split("_")
        return { id: parseInt(keyArr[0]), handle: keyArr[1], tags: keyArr[2].split(',') } 
    }

    // sort and return the longest product list and tag name
    sortHotPdtList(lists: any[]) {
        //const lists = lists
        lists.sort(function (a, b) {
            return b.length - a.length
        })
        return lists[0]
    }
    
}

class DynamicProductnCollection {
    logSuggestionInstance: GetProductListfromLog
    descriptionLength: number
    featuredProductA: HTMLLinkElement
    featuredProductimg: HTMLImageElement
    featuredProductTitle: HTMLElement
    featuredProductVendor: HTMLElement
    featuredProductPrice: HTMLElement
    featuredCollectionTitle: HTMLElement
    featuredCollectionLink: HTMLLinkElement 
    productListItemTitle: NodeListOf<HTMLElement>
    productListItemLink: NodeListOf<HTMLLinkElement>
    productListItemVendor: NodeListOf<HTMLElement>
    productListItemPrice: NodeListOf<HTMLElement>
    productListItemImg: NodeListOf<HTMLImageElement>
    formatedResponse: FormatedResponse | undefined

    constructor(logBasedSuggestionInstance: GetProductListfromLog ) {
        this.logSuggestionInstance= logBasedSuggestionInstance
        this.descriptionLength = 55
        this.featuredProductA = document.getElementById('dynamic__pdt__grid__pdt__col__A') as HTMLLinkElement
        this.featuredProductimg = document.getElementById('featured_product_img') as HTMLImageElement
        this.featuredProductTitle = document.getElementById('featured_product_title') as HTMLElement
        this.featuredProductVendor = document.getElementById('featured_product_vendor') as HTMLElement
        this.featuredProductPrice = document.getElementById('featured_product_price') as HTMLElement
        this.featuredCollectionTitle = document.getElementById('featured_collection_title') as HTMLElement
        this.featuredCollectionLink = document.getElementById('featured_collection_link') as HTMLLinkElement
        this.productListItemTitle = document.querySelectorAll('#products_list_item_title') as NodeListOf<HTMLElement>
        this.productListItemLink = document.querySelectorAll('#products_list_item_link') as NodeListOf<HTMLLinkElement>
        this.productListItemVendor = document.querySelectorAll('#products_list_item_vendor') as NodeListOf<HTMLElement>
        this.productListItemPrice = document.querySelectorAll('#products_list_item_price') as NodeListOf<HTMLElement>
        this.productListItemImg = document.querySelectorAll('#products_list_item_img') as NodeListOf<HTMLImageElement>
        
        this.initDynamicSection()
    }
    
    // Handler
    async initDynamicSection(){
        try {
            const smartCollection = await this.logSuggestionInstance.initProductListfromLog()
            if(smartCollection){
                this.formatedResponse = this.formatAPIResponse(smartCollection)
                this.renderDynamicCollection()
                this.renderDynamicProduct()
                this.renderDynamicProductList()
            }
            setTimeout(() => {
                this.removeHideClasses(this.returnElmForClassesChanges())
                this.removeSkeletonClass(this.returnElmForClassesChanges())
            }, 500);

        } catch (error) {
            console.log(error)
        }
    }

    formatAPIResponse(data: SmartCollection) {
        const stateObj = {
            collection: {
                title: data.title,
                description: data.description.slice(0, this.descriptionLength ) + "...",
                url: `/collections/${data.handle}`,
            },
            featuredpdt: {
                id: data.products[0].id,
                handle: data.products[0].handle,
                imgUrl: data.products[0].image.src,
                price: data.products[0].price,
                title: data.products[0].title,
                url: `products/${data.products[0].handle}`,
                vendor: data.products[0].vendor,
            },
            pdtlist: data.products.map((el) => {
                return {
                    id: el.id,
                    handle: el.handle,
                    imgUrl: el.image.src,
                    price: el.price,
                    title: el.title,
                    url: `products/${el.handle}`,
                    vendor: el.vendor,
                }
            }).filter((el, ind) => {
                return ind > 0
            })
        }
        return stateObj
    }


    changeJpgRes(url: string, res: number) {
        const ind = url.indexOf('.jpg')
        const newUrl = url.slice(0, ind) + `_${res}x` + url.slice(ind)
        return newUrl
    }
    renderMoney(strOrNumber: string | number) {
        // return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'HKD', currencyDisplay:'symbol'}).format(Number(strOrNumber))
        return '$' + Number(strOrNumber).toFixed(2)
    }
    returnElmForClassesChanges(){
        const elmsArray = [this.featuredCollectionTitle,
            this.featuredProductimg,
            this.featuredProductTitle,
            this.featuredProductVendor,
            this.featuredProductPrice,]
            const nodeListsArray = [
                this.productListItemTitle,
                this.productListItemVendor,
                this.productListItemPrice,
                this.productListItemImg
            ]
            return {elmsArray, nodeListsArray}
    }


    // DOM manipulation
    removeHideClasses(elmsBundle:{elmsArray:HTMLElement[], nodeListsArray:NodeListOf<HTMLElement>[]}){
        elmsBundle.elmsArray.forEach((elm)=>{
            elm.classList.remove('hideText')
            elm.classList.remove('hideImage')
        })
        elmsBundle.nodeListsArray.forEach((elm_01)=>{
            elm_01.forEach((elm_02)=>{
                elm_02.classList.remove('hideText')
                elm_02.classList.remove('hideImage')
            })
        })
    }
    removeSkeletonClass(elmsBundle:{elmsArray:HTMLElement[], nodeListsArray:NodeListOf<HTMLElement>[]}){
        elmsBundle.elmsArray.forEach((elm)=>{
            elm.classList.remove('textSkeleton')
        })
        elmsBundle.nodeListsArray.forEach((elm_01)=>{
            elm_01.forEach((elm_02)=>{
                elm_02.classList.remove('textSkeleton')
            })
        })
    }


    renderDynamicCollection() {
        if(this.formatedResponse){
            this.featuredCollectionTitle.innerText = this.formatedResponse.collection.title
            this.featuredCollectionLink.href = this.formatedResponse.collection.url
        }
    }
    renderDynamicProduct() {
        if(this.formatedResponse){
            this.featuredProductimg.src = ""
            this.featuredProductimg.src = this.changeJpgRes(this.formatedResponse.featuredpdt.imgUrl, 500)
            this.featuredProductTitle.innerText = this.formatedResponse.featuredpdt.title
            this.featuredProductVendor.innerText = this.formatedResponse.featuredpdt.vendor
            this.featuredProductPrice.innerText = this.renderMoney(this.formatedResponse.featuredpdt.price)
            this.featuredProductA.href = `/products/${this.formatedResponse.featuredpdt.handle}`
        }
    }
    renderDynamicProductList() {
            this.productListItemTitle.forEach((el, ind,)=>{
                if(this.formatedResponse){
                    el.innerText = this.formatedResponse.pdtlist[ind].title
                }
            })
            this.productListItemLink.forEach((el, ind)=>{
                if(this.formatedResponse){
                    el.href = `/products/${this.formatedResponse.pdtlist[ind].handle}`
                }
            })
            this.productListItemVendor.forEach((el, ind)=>{
                if(this.formatedResponse){
                    el.innerText = this.formatedResponse.pdtlist[ind].vendor
                }
            })
            this.productListItemPrice.forEach((el, ind)=>{
                if(this.formatedResponse){
                    el.innerText = this.renderMoney(this.formatedResponse.pdtlist[ind].price)
                }
            })
            this.productListItemImg.forEach((el, ind)=>{
                if(this.formatedResponse){
                    el.src = ""
                    el.src = this.changeJpgRes(this.formatedResponse.pdtlist[ind].imgUrl, 250)
                }
            })
        }
    }

const getProductListFromLog = new GetProductListfromLog()

const dynamicProductnCollection = new DynamicProductnCollection(getProductListFromLog)
