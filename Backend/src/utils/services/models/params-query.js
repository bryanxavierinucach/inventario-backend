'use strict'
module.exports = class ParamsQuery {
    constructor(page, limit, search, order){
        this.page=page;
        this.limit=limit;
        this.search=search;
        this.order=order;
    }
}