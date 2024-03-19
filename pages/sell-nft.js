import { Form, useNotification, BannerStrip, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import WrongNetworkBanner from "../components/WrongNetworkBanner"

export default function Home() {
    let marketplaceAddress
    const [showErrorWrongNetwork, setShowErrorWrongNetwork] = useState(false)
    const { runContractFunction } = useWeb3Contract()
    const { isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()
    const { chainId } = useMoralis()
    useEffect(() => {
        const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
        try {
            marketplaceAddress = networkMapping[chainIdString].NftMarketplace[0]
        } catch {
            setShowErrorWrongNetwork(true)
        }
    }, [chainId])
    useEffect(() => {
        if (!isWeb3Enabled) {
            setShowErrorWrongNetwork(false)
        }
    }, [isWeb3Enabled])

    async function approveAndList(data) {
        if (!isWeb3Enabled) {
            handleErrorNotConnected()
            return
        }

        console.log("Approving...")
        const nftAddress = data.data[0].inputResult.replace(/^\s+|\s+$/gm, "")
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                handleErrorApproving()
                console.log(error)
            },
        })
    }
    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => {
                console.log(error)
                handleErrorListing(error)
            },
        })
    }
    function handleListSuccess() {
        dispatch({ type: "success", message: "NFT listing", title: "Nft listed", position: "topR" })
    }
    function handleErrorNotConnected() {
        dispatch({
            type: "error",
            message: `Connect your Wallet`,
            title: "No wallet detected",
            position: "topR",
        })
    }
    function handleErrorApproving(error) {
        dispatch({
            type: "error",
            message: `Error approving the marketplace address to use the nft : ${error}`,
            title: "Error",
            position: "topR",
        })
    }
    function handleErrorListing(error) {
        dispatch({
            type: "error",
            message: `Error listing the nft on the marketplace ${error}`,
            title: "Error",
            position: "topR",
        })
    }

    return (
        <div className="container mx-auto ">
            <div className="w-[100%] max-w-[650px]">
                {showErrorWrongNetwork && <WrongNetworkBanner chainId={chainId} />}
                <Form
                    onSubmit={approveAndList}
                    data={[
                        { name: "NFT Address", type: "text", inputWidth: "100%", value: "" },
                        {
                            name: "Token ID",
                            type: "number",
                            value: "",
                            key: "tokenId",
                        },
                        { name: "Price (in ETH)", type: "number", value: 0, key: "price" },
                    ]}
                    title="Sell your NFT!"
                    id="Main Form"
                />
            </div>
        </div>
    )
}
