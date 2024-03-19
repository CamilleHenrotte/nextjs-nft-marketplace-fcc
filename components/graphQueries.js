import { useQuery, gql } from "@apollo/client"
import NFTBox from "./NFTBox"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
export default function GraphQueries({ marketplaceAddress }) {
    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="flex mx-4  gap-4">
            {loading || !listedNfts ? (
                <div>Loading...</div>
            ) : (
                listedNfts.activeItems.map((nft) => {
                    const { price, nftAddress, tokenId, seller } = nft
                    return (
                        <NFTBox
                            price={price}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            seller={seller}
                            key={`${nftAddress}${tokenId}`}
                        />
                    )
                })
            )}
        </div>
    )
}
