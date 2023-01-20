module.exports.sendResponse = function (res, opt) {
    if (opt['statusCode'] || (opt['statusCode'] && opt['statusCode'] !== 200)) {
        return res
            .status(opt['statusCode'])
            .send({
                'success': false,
                'message': opt['message']
            });
    }

    return res.send({ 'success': true, ...opt });
}

module.exports.modify = function (value) {
    return String(value).replace(/\"/g, '');
}