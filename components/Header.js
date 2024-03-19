import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <div className="grid grid-rows-2 min-w-max">
            <nav className="p-5 px-8 flex flex-row justify-between items-center  text-primary bg-lightgreen1">
                <h1 className="text-[30px] font-medium">Nft Marketplace</h1>
                <div className="flex flex-row items-center text-[17px] font-medium">
                    <Link href="/">
                        <a className="mr-4 p-4 hover:bg-lightgreen2 rounded-2xl py-1">Home</a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="mr-4 p-4 hover:bg-lightgreen2 rounded-2xl py-1">Sell Nft</a>
                    </Link>
                    <div className="!font-roboto !text-black">
                        <ConnectButton className="myDiv" />
                    </div>
                </div>
            </nav>
            <div className="customed-gradient"></div>
        </div>
    )
}
