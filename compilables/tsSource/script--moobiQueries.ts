
class MoobiQueries {
    hostName: string

    constructor() {
        this.hostName = 'https://moobinavi.df.r.appspot.com'
    }

    public async getPdtDetails(handle: string) {
        try {
            const requestOptions: RequestInit = {
                method: 'GET',
                redirect: 'manual'
            };
            const res = await fetch(`${this.hostName}/api/v00/dynamicHP/getOnepdt?handle=${handle}`, requestOptions)
            const text = await res.text()
            const data = await JSON.parse(text)
            return data
        } catch (err) { console.log(err) }
    }

    public async getPdtCpr(handle: string) {
        try {
            // return resdata or false
            let requestOptions: RequestInit = {
                method: 'GET',
                redirect: 'manual'
            };
            const res = await fetch(`${this.hostName}/api/v00/comparisons/param?handle=${handle}`, requestOptions)
            const text = await res.text()
            const data = await JSON.parse(text)
            if (data.results) {
                return data
            } else {
                return false
            }
        } catch (err) { console.log(err) }
    }

    public async getPdtLists(tags: string[]) {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const raw = JSON.stringify({ tags: tags });
            const requestOptions: RequestInit = {
                mode: 'cors',
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'manual'
            };
            const res = await fetch(`${this.hostName}/api/v00/dynamicHP/getPdtListsByTags`, requestOptions)
            const text = await res.text()
            const data = await JSON.parse(text)
            return data.data
        } catch (err) { console.log(err) }
    }

    public async getProductListbyCollectionId(id: string) {
        try {
            const requestOptions: RequestInit = {
                method: 'GET',
                redirect: 'manual'
            };
            const response = await fetch(`${this.hostName}/api/v00/dynamicHP/getPdtListsById?id=${id}`, requestOptions)
            const result = await response.text()
            const data = await JSON.parse(result)
            return data;
        } catch (err) {
            console.log(err);
        }
    }


    public async getRecommendationsbyProductId(id: number, limit: number) {
        try {
            const requestOptions: RequestInit = {
                method: 'GET',
                redirect: 'manual'
            };
            const response = await fetch(`/recommendations/products.json?product_id=${id}&limit=${limit}`, requestOptions)
            const result = await response.text()
            const data = await JSON.parse(result)
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    public async changeCartItem(id: string, quantity: number) {
        // line is an index starting with 1
        const body = {
            'id': id,
            'quantity': quantity
          }
        const bodyString = JSON.stringify(body)

        try {
            console.log(bodyString)
            const requestOptions: RequestInit = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
                redirect: 'manual',
                body: bodyString
            };
            const response = await fetch(`/cart/change.js`, requestOptions)
            const result = await response.text()
            const data = await JSON.parse(result)
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    public async renderSection(sectionId: string[]) {
        const sections = sectionId.join(',')
        const urlQuery = `/?sections=${sections}`

        try {
            console.log(urlQuery)
            const requestOptions: RequestInit = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
                redirect: 'manual',
            };
            const response = await fetch(`/cart/change.js`, requestOptions)
            const result = await response.text()
            const data = await JSON.parse(result)
            return data;
        } catch (err) {
            console.log(err);
        }
    }
}

const moobiQueries = new MoobiQueries()