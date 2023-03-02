class TypesenseCore{
    query?:string
    parameter?:{}
    constructor(){}
    setQueryString(){}
    setParameterObj(){}
    returnTSResponse(){}
}

class CollectionProductTSInterface{
    constructor(){}
    static getProductsArray(){}
    static getFiltersArry(){}
    static getInitialQuery(){}
    static getInitialParams(){}
}

class CollectionProductFilterController{
    constructor(){}
    getQueryFromDOM(){}
    getParamsFromDOM(){}
    renderFilters(){}
    renderResults(){}
}