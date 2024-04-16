import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification, Button } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import ShowDescriptionModal from "./ShowDescriptionModal"
import useNftUrl from "../hooks/useNftUrl"
import TruncatedString from "./TruncatedString"
import useVariables from "../hooks/useVariables"

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

export default function NFTBox({ price, nftAddress, tokenId, seller }) {
    const { marketplaceAddress } = useVariables()
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showDescriptionModal, setShowDescriptionModal] = useState(false)

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    const dispatch = useNotification()
    const { putNftUrl, getNftUrl } = useNftUrl()

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
            const name = tokenURIResponse.name
            const description = tokenURIResponse.description
            setImageURI(imageURIURL)
            setTokenName(name)
            setTokenDescription(description)

            await putNftUrl(nftAddress, tokenId, {
                imageUrl: imageURIURL,
                name: name,
                description: description,
            })
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

    async function getImageUrlFromDatabase() {
        const nft = await getNftUrl(nftAddress, tokenId)
        console.log(nft)
        if (nft.length > 0) {
            const { imageUrl, name, description } = nft[0]
            setImageURI(imageUrl)
            setTokenName(name)
            setTokenDescription(description)
        }
    }
    useEffect(() => {
        getImageUrlFromDatabase()
    }, [])
    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])
    return (
        <div className="w-full sm:w-[250px] !text-roboto ">
            <Card
            //title={<TruncatedString text={tokenName} maxLength={20} />}
            //description={<TruncatedString text={tokenDescription} maxLength={20} />}
            >
                <div className="flex flex-col ">
                    <div className=" flex flex-col items-end">
                        <div>#{tokenId}</div>
                        <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                    </div>
                    {imageURI ? (
                        <div>
                            <UpdateListingModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                nftAddress={nftAddress}
                                onClose={hideModal}
                            />
                            <ShowDescriptionModal
                                isVisible={showDescriptionModal}
                                tokenId={tokenId}
                                tokenName={tokenName}
                                tokenDescription={tokenDescription}
                                seller={seller}
                                price={price}
                                nftAddress={nftAddress}
                                onClose={() => {
                                    setShowDescriptionModal(false)
                                }}
                            />
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                height="300"
                                width="300"
                                unoptimized
                                priority
                                onClick={() => {
                                    setShowDescriptionModal(true)
                                }}
                            />
                        </div>
                    ) : (
                        <div className="h-[100px] flex items-center justify-center">Loading...</div>
                    )}

                    <div className="flex justify-start text-[15px] font-medium">
                        <TruncatedString text={tokenName} maxLength={22} />
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="!bg-lightgreen1 rounded-full px-3 py-1 text-secondary">
                            <span className="font-semibold text-base">
                                {ethers.utils.formatUnits(price, "ether")}
                            </span>{" "}
                            <span className="text-xs">ETH</span>
                        </p>
                        <Button
                            onClick={handleCardClick}
                            text={isOwnedByUser ? "Update" : "Buy"}
                            type="button"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}
