import { providers } from 'ethers'

import { IConfigContext } from '@utils/hooks'

export type IBridgeTokenHandler = (
  amount: string,
  tokenAddress: string,
  userAddress: string,
  provider: providers.Web3Provider,
  network: string,
  config?: IConfigContext['config'],
) => Promise<void>
