import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import WrongNetworkBanner from "../components/WrongNetworkBanner"
import useVariables from "../hooks/useVariables"

export default function SellNft() {
    const { runContractFunction } = useWeb3Contract()
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")
    const { marketplaceAddress, showErrorWrongNetwork } = useVariables()
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
    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
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
    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    return (
        <div className="container mx-auto space-y-10">
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
            <div className="space-y-6 px-4">
                <div className="text-grey font-bold text-[22px] ">
                    Withdraw {ethers.utils.formatUnits(proceeds, "ether") + " ETH"} proceeds
                </div>
                {proceeds != "0" ? (
                    <Button
                        onClick={() => {
                            runContractFunction({
                                params: {
                                    abi: nftMarketplaceAbi,
                                    contractAddress: marketplaceAddress,
                                    functionName: "withdrawProceeds",
                                    params: {},
                                },
                                onError: (error) => console.log(error),
                                onSuccess: () => handleWithdrawSuccess,
                            })
                        }}
                        text="Withdraw"
                        type="button"
                    />
                ) : (
                    <div className="text-grey">No proceeds detected</div>
                )}
            </div>
        </div>
    )
}
