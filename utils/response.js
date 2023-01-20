module.exports.sendResponse = function sendResponse(res, opt) {
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