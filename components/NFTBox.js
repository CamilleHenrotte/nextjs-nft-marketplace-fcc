import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr
    const separator = "..."
    const separatorLength = separator.length
    const charsToShow = strLen - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const isOwnedByUser = seller || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: { nftAddress: nftAddress, tokenId: tokenId },
    })
    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The tokenURI is ${tokenURI}`)
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: () => handleBuyItemSuccess(),
              })
    }
    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            messsage: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }
    const hideModal = () => {
        setShowModal(false)
    }

    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])

    return (
        <div className="w-[200px] !text-roboto">
            <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                <div className="flex flex-col gap-2">
                    <div className=" flex flex-col items-end">
                        <div>#{tokenId}</div>
                        <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                    </div>
                    {imageURI ? (
                        <div>
                            <UpdateListingModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                marketplaceAddress={marketplaceAddress}
                                nftAddress={nftAddress}
                                onClose={hideModal}
                            />
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                height="200"
                                width="200"
                            />
                        </div>
                    ) : (
                        <div className="h-[100px] flex items-center justify-center">Loading...</div>
                    )}
                    <div className=" flex flex-col items-end">
                        {ethers.utils.formatUnits(price, "ether")} ETH
                    </div>
                </div>
            </Card>
        </div>
    )
}
