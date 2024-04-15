const express = require("express")
const router = express.Router()
const {
    postNft,
    getNfts,
    getNftById,
    getNftByAddress,
    updateNftByAddress,
    updateNftById,
    deleteByAddress,
    deleteById,
} = require("../controllers/nft.controller.js")

router.use(express.json())
router.post("/", postNft)
router.get("/", getNfts)
router.get("/:nftAddress/:tokenId", getNftByAddress)
router.get("/:id", getNftById)
router.put("/:nftAddress/:tokenId", updateNftByAddress)
router.put("/:id", updateNftById)
router.delete("/:nftAddress/:tokenId", deleteByAddress)
router.delete("/:id", deleteById)

module.exports = router
