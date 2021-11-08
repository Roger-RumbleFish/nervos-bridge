import { providers } from 'ethers'
import Web3 from 'web3'

import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'

import { EthereumForceBridge } from './bridge'
import { BridgeToken } from '@interfaces/data'

export const fetchBalances = async (
  tokens: BridgeToken[],
  provider: providers.Web3Provider,
): Promise<void> => {
  const accounts = await provider?.listAccounts()
  const userAddress = accounts[0]

  const web3 = new Web3(Web3.givenProvider)

  const bridge = await new EthereumForceBridge(web3, provider, {
    forceBridgeUrl: 'https://testnet.forcebridge.com/api/force-bridge/api/v1'
  }).init()


  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    console.log('[token][addres]', token.shadow.id)
    const shadow = {
      address: token.shadow.id,
      network: token.shadow.network
    }
    const tokenBalance = await bridge.getBalance(userAddress, { shadow })

    const balanceDisplayValue = getDisplayValue(
      tokenBalance,
      2,
      token.model.decimals,
    )
    console.log(
      '%c[bridge]%c[l1-l2]%c[user]%c[balance]%c[token]',
      'background: #222; color: #bada55',
      'background: #700560; color: #caca55',
      'background: #333; color: #caca55',
      'background: #333; color: #caca55',
      'background: #333; color: #caca55',
      token.model.symbol,
      balanceDisplayValue.displayValue,
    )
  }
}
