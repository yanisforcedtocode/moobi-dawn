'use strict';
let client = new Typesense.SearchClient({
    'nodes': [{
            'host': '2y9h70d3prw6uv8jp-1.a1.typesense.net',
            'port': '443',
            'protocol': 'https' // For Typesense Cloud use https
        }],
    'apiKey': 'itq7jicFo1XypYg2paZKPQx0qxJFgbG6',
    'connectionTimeoutSeconds': 2
});
// === TS search handlers
//   searchFn()
class TSSearchWidget {
    constructor(params) {
        // states
        this.initStates = {
            // searchParams:[...params.searchParams],
            // searchFields:[...params.searchFields],
            // facetFields:[...params.facetFields],
            searchParams: false,
            query: false,
            isSearchSubmited: false,
            search: {
                query: false,
                params: false,
                res: false
            }
        };
        /*this.currentState = {...this.initStates}
        // targets
        this.section = document.querySelector(".TSClient__section")
        this.query = document.querySelector("#query")
        this.params = document.querySelector("#params")
        this.response = document.querySelector("#response")
        this.searchBtn = document.querySelector("#submitsearch")*/
    }
}
