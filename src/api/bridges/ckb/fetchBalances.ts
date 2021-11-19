import { providers } from 'ethers'

// import Web3 from 'web3'
// import { getDisplayValue } from '@components/BigNumberInput/BigNumberInput.utils'
import { BridgedToken, IDisplayValue } from '@interfaces/data'

// import { registry as godwokenTokensRegistry } from '../../godwoken/registry'
// import { CkbBridge } from './bridge'

export const fetchBalances = async (
  tokens: BridgedToken[],
  provider: providers.Web3Provider,
): Promise<IDisplayValue[]> => {
  console.log('[bridges][ckb][fetch balance test] tokens', tokens)
  console.log('[bridges][ckb][fetch balance test] provider', provider)
  // const accounts = await provider?.listAccounts()
  // const userAddress = accounts[0]

  // const web3 = new Web3(Web3.givenProvider)

  // const bridge = await new CkbBridge(web3, {
  //   ckbUrl: 'https://testnet.ckb.dev',
  //   indexerUrl: 'https://testnet.ckb.dev/indexer',
  // }).init(godwokenTokensRegistry)

  const balances: IDisplayValue[] = []
  // for (let i = 0; i < tokens.length; i++) {
  //   const token = tokens[i]
  //   const shadow = {
  //     address: token.shadow.address,
  //     network: token.shadow.network,
  //   }
  //   const tokenBalance = await bridge.getBalance(userAddress, { shadow })

  //   const balanceDisplayValue = getDisplayValue(tokenBalance, 2, token.decimals)
  //   balances.push(balanceDisplayValue)
  // }

  return balances
}
