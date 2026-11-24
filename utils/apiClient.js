export class ApiClient {

    constructor(request) {
        this.request = request;
    }

    async get(url, options) {
        return await this.request.get(url, options);
    }

    async post(url, options) {
        return await this.request.post(url, options);
    }

    async put(url, data) {
        return await this.request.put(url, { data });
    }

    async delete(url, data) {
        return await this.request.delete(url, { data });
    }
}