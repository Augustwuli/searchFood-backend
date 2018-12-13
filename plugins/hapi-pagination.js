// plugins/hapi-pagination.js
const hapiPagination = require('hapi-pagination');

const options = {
    query: {

    },
    meta: {
        name: 'meta'
    },
    results: {
        name: 'result'
    },
    reply: {
        paginate: 'paginate'
    },
    routes: {
        include: [
            '/notes', // 笔记列表支持分页特性
        ],
        exclude: []
    }
}

module.exports = {
    register: hapiPagination,
    options: options
}