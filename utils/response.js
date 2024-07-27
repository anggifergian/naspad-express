module.exports.sendResponse = function (res, { statusCode = 200, status = 'success', message = '', data = null, meta = null }) {
    const response = {
        status,
        message
    };

    if (data != null) {
        response.data = data;
    }

    if (meta != null) {
        response.meta = meta;
    }

    return res
        .status(statusCode)
        .json(response);
}

module.exports.modify = function (value) {
    return String(value).replace(/\"/g, '');
}