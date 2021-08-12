import { ethers } from 'ethers'

export interface IBridgeContainerProps {
  blacklist: string[]
  provider: ethers.providers.Web3Provider
  accountAddress: string
}
