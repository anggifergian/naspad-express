module.exports.getAll = async (req, res) => {
    res.send("[Category] getAll")
}

module.exports.getById = async (req, res) => {
    const { id } = req.params

    res.send("[Category] getById " + id)
}

module.exports.create = async (req, res) => {
    const { id } = req.params

    res.send("[Category] INSERT " + id)
}

module.exports.update = async (req, res) => {
    const { id } = req.params

    res.send("[Category] UPDATE " + id)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    
    res.send("[Category] DELETE " + id)
}