"use strict";
// === init TS search client
const moobiTypeSenseClient = new Typesense.SearchClient({
    'nodes': [{
            'host': '2y9h70d3prw6uv8jp-1.a1.typesense.net',
            'port': '443',
            'protocol': 'https' // For Typesense Cloud use https
        }],
    'apiKey': 'itq7jicFo1XypYg2paZKPQx0qxJFgbG6',
    'connectionTimeoutSeconds': 2
});
class TypesenseCore {
    constructor() { }
    setQueryString() { }
    setParameterObj() { }
    returnTSResponse() { }
}
class CollectionProductTSInterface {
    constructor() { }
    static getProductsArray() { }
    static getFiltersArry() { }
    static getInitialQuery() { }
    static getInitialParams() { }
}
class CollectionProductFilterController {
    constructor() { }
    getQueryFromDOM() { }
    getParamsFromDOM() { }
    renderFilters() { }
    renderResults() { }
}
