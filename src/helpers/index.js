const fs = require ('fs')

module.exports = {
    response:function (response,status,data,pagination){
        const result ={};
        result.status =status || 200;
        result.data = data
        result.pagination = pagination;
        return response.status(result.status).json(result)
    }
}