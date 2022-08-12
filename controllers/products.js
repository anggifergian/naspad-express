module.exports.getAll = async (req, res) => {
    res.send("[Product] getAll")
}

module.exports.getById = async (req, res) => {
    const { id } = req.params

    res.send("[Product] getById " + id)
}

module.exports.create = async (req, res) => {
    console.log(req.body)

    res.send("[Product] INSERT " + id)
}

module.exports.update = async (req, res) => {
    const { id } = req.params

    res.send("[Product] UPDATE " + id)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    
    res.send("[Product] DELETE " + id)
}