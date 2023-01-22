module.exports.sendResponse = function (res, opt) {
    if (opt['statusCode'] || (opt['statusCode'] && opt['statusCode'] !== 200)) {
        let status = opt['statusCode'];
        delete opt['statusCode'];
        
        return res
            .status(status)
            .send({
                'success': false,
                'message': opt['message'],
                ...opt,
            });
    }

    return res.send({ 'success': true, ...opt });
}

module.exports.modify = function (value) {
    return String(value).replace(/\"/g, '');
}