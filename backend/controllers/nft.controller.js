const Nft = require("../models/nft.model.js")

async function postNft(req, res) {
    try {
        const nft = await Nft.create(req.body)
        console.log(nft)
        res.status(200).json(nft)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
async function getNfts(req, res) {
    try {
        const nfts = await Nft.find({})
        res.status(200).json(nfts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
async function getNftByAddress(req, res) {
    try {
        const { nftAddress, tokenId } = req.params
        const nft = await Nft.find({
            nftAddress: nftAddress.toString(),
            tokenId: tokenId.toString(),
        })

        res.status(200).json(nft)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
async function getNftById(req, res) {
    try {
        const { id } = req.params
        const nft = await Nft.findById(id)
        res.status(200).json(nft)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
async function updateNftByAddress(req, res) {
    try {
        const { nftAddress, tokenId } = req.params
        let newContent = {
            nftAddress: nftAddress,
            tokenId: tokenId,
            imageUrl: req.body.imageUrl,
            name: req.body.name,
            description: req.body.description,
        }
        let nft = await Nft.find({
            nftAddress: nftAddress.toString(),
            tokenId: tokenId.toString(),
        })
        const id = nft[0]?._id.toString()
        if (!id) {
            nft = await Nft.create(newContent)
            return res.status(200).json(nft)
        }
        const imageUrl = nft[0].imageUrl.toString()
        if (imageUrl == req.body.imageUrl) {
            return res.status(200).json({ message: "No need to update, image url is the good one" })
        }
        const response = await Nft.findByIdAndUpdate(id, newContent)
        if (!response) {
            return res.status(404).json({ message: "Nftnot found " })
        }
        const updatedNft = await Nft.findById(id)
        return res.status(200).json(updatedNft)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
async function updateNftById(req, res) {
    try {
        const { id } = req.params
        const nft = await Nft.findById(id)
        if (nft.imageUrl == req.body.imageUrl) {
            res.status(200).json({ message: "No need to update, image url is the good one" })
        }
        const response = await Nft.findByIdAndUpdate(id, {
            nftAddress: nft.nftAddress,
            tokenId: nft.tokenId,
            imageUrl: req.body.imageUrl,
            name: req.body.name,
            description: req.body.description,
        })
        if (!response) {
            return res.status(404).json({ message: "Nftnot found " })
        }
        const updatedNft = await Nft.findById(id)
        res.status(200).json(updatedNft)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
async function deleteByAddress(req, res) {
    try {
        const { nftAddress, tokenId } = req.params
        const nft = await Nft.find({
            nftAddress: nftAddress.toString(),
            tokenId: tokenId.toString(),
        })
        if (!nft[0]) {
            return res.status(404).json({ message: "Nft not found" })
        }
        const id = nft[0]._id.toString()
        console.log(id)
        const response = await Nft.findByIdAndDelete(id)
        if (!response) {
            return res.status(404).json({ message: "Nft not found" })
        }
        res.status(200).json({ message: `Nft with id ${id} deleted` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
async function deleteById(req, res) {
    try {
        const { id } = req.params
        const response = await Nft.findByIdAndDelete(id)
        if (!response) {
            return res.status(404).json({ message: "Nft not found" })
        }
        res.status(200).json({ message: `Nft with id ${id} deleted` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    postNft,
    getNfts,
    getNftByAddress,
    getNftById,
    updateNftByAddress,
    updateNftById,
    deleteByAddress,
    deleteById,
}
