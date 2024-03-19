import NFTBox from "../components/NFTBox"
import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import WrongNetworkBanner from "../components/WrongNetworkBanner"
import GraphQueries from "../components/graphQueries"

export default function Home() {
    let marketplaceAddress
    const [showErrorWrongNetwork, setShowErrorWrongNetwork] = useState(false)
    const { isWeb3Enabled } = useMoralis()
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

    return (
        <div className="container mx-auto">
            {showErrorWrongNetwork && <WrongNetworkBanner chainId={chainId} />}
            <h1 className="py-4 px-4 font-bold text-2xl text-grey">Recently listed</h1>
            <div className="flex flex-wrap">
                <GraphQueries marketplaceAddress={marketplaceAddress} />
            </div>
        </div>
    )
}
