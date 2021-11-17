import { providers } from 'ethers'
import Web3 from 'web3'

import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import { BridgedToken, IDisplayValue } from '@interfaces/data'

import { EthereumForceBridge } from './bridge'

export const fetchBalances = async (
  tokens: BridgedToken[],
  provider: providers.Web3Provider,
): Promise<IDisplayValue[]> => {
  const accounts = await provider?.listAccounts()
  const userAddress = accounts[0]

  const web3 = new Web3(Web3.givenProvider)

  const bridge = await new EthereumForceBridge(web3, provider, {
    forceBridgeUrl: 'https://testnet.forcebridge.com/api/force-bridge/api/v1',
  }).init()

  console.log('[balances][fetchBalances][ethereum] tokens', tokens)

  const balances = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    console.log(
      '[balances][fetchBalances][ethereum] token shadow address',
      token.shadow.address,
    )
    console.log('[balances][fetchBalances][ethereum] user address', userAddress)

    const shadow = {
      address: token.shadow.address,
      network: token.shadow.network,
    }
    const tokenBalance = await bridge.getBalance(userAddress, { shadow })

    const balanceDisplayValue = getDisplayValue(tokenBalance, 2, token.decimals)
    console.log(
      '[balances][fetchBalances][ethereum] balance',
      token.symbol,
      balanceDisplayValue.displayValue,
    )

    balances.push(balanceDisplayValue)
  }

  return balances
}
