const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema(
    {
        nftAddress: {
            type: String,
            required: [true, "Please enter the nft address"],
        },
        tokenId: {
            type: String,
            required: [true, "Please enter the token id"],
        },
        imageUrl: {
            type: String,
            required: [true, "Please enter the nft address"],
        },
        name: {
            type: String,
            required: [true, "Please enter the nft address"],
        },
        description: {
            type: String,
            required: [true, "Please enter the nft address"],
        },
    },
    { timestamps: true }
)
const Nft = mongoose.model("Nfts", ProductSchema)

module.exports = Nft
