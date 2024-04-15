import { ConnectButton } from "web3uikit"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import useWindowDimensions from "../hooks/useWindowsDimensions"
import { Dropdown } from "flowbite-react"
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi"
export default function Header() {
    const { windowWidth } = useWindowDimensions()

    const router = useRouter()
    return (
        <div>
            {windowWidth > 640 ? (
                <div className="grid grid-rows-2 min-w-max">
                    <nav className="p-5 px-8 flex flex-row justify-between items-center  text-primary bg-lightgreen1">
                        <h1 className="text-[30px] font-medium">Nft Marketplace</h1>
                        <div className="flex flex-row items-center text-[17px] font-medium">
                            <Link href="/">
                                <a className="mr-4 p-4 hover:bg-lightgreen2 rounded-2xl py-1">
                                    Home
                                </a>
                            </Link>
                            <Link href="/sell-nft">
                                <a className="mr-4 p-4 hover:bg-lightgreen2 rounded-2xl py-1">
                                    Sell Nft
                                </a>
                            </Link>
                            <div className="!font-roboto !text-black">
                                <ConnectButton />
                            </div>
                        </div>
                    </nav>
                    <div className="customed-gradient"></div>
                </div>
            ) : (
                <div className="grid grid-rows-2 min-w-max">
                    <nav className="pt-4 px-5 flex flex-row justify-between items-center  text-primary bg-lightgreen1">
                        <h1 className="text-[24px] font-medium">Nft Marketplace </h1>

                        <Dropdown
                            label={
                                <img src="/menu-icon.svg" alt="Example SVG" className="w-[18px]" />
                            }
                            arrowIcon={false}
                            color="primary"
                            className="w-full"
                        >
                            <Dropdown.Item
                                icon={() => <HiViewGrid className="h-6 w-6" />}
                                onClick={() => {
                                    router.push("/")
                                }}
                            >
                                <a className="text-lg p-1 px-3">Home</a>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                icon={() => <HiCurrencyDollar className="h-6 w-6" />}
                                onClick={() => {
                                    router.push("/sell-nft")
                                }}
                            >
                                <a className="text-lg p-1 px-3">Sell Nft</a>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <div className=" m-5 mt-[150px] flex justify-end">
                                <ConnectButton />
                            </div>
                        </Dropdown>
                    </nav>
                    <div className="customed-gradient"></div>
                </div>
            )}
        </div>
    )
}
