import { BigNumber } from 'ethers'

import { IDisplayValue } from '@interfaces/data'
import { Token } from '@state/types'
import { ApiNetworks, Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'
import {
  convertDecimalToIntegerDecimal,
  convertIntegerDecimalToDecimal,
  truncateDecimals,
} from '@utils/stringOperations'

import { getBridgeRPCClient } from './client'

export const calculateFee = async (
  baseToken: Token,
  quoteToken: Token,
  amount: string,
  network: string,
  config?: IConfigContext['config'],
): Promise<{
  exchangeResult: IDisplayValue
  percentageFee: string
}> => {
  try {
    const bridgeRpcClient = getBridgeRPCClient(config?.rpcFaucetUrl)
    const decimals = baseToken.decimals ?? 2
    const value = convertDecimalToIntegerDecimal(amount, decimals)

    if (network === Networks.Ethereum) {
      const payload = {
        amount: value.toString(),
        network: ApiNetworks.Ethereum,
        xchainAssetIdent: baseToken.address,
      }

      const nervosBridgeFee = await bridgeRpcClient.getBridgeInNervosBridgeFee(
        payload,
      )

      const exchangeValue = value.sub(nervosBridgeFee.fee.amount)

      const exchangeResult: IDisplayValue = {
        value: exchangeValue,
        displayValue: truncateDecimals(
          convertIntegerDecimalToDecimal(exchangeValue, decimals),
          2,
        ),
        decimals: decimals,
      }

      const percentageFee = convertIntegerDecimalToDecimal(
        BigNumber.from(nervosBridgeFee.fee.amount).mul(100),
        decimals,
      )

      return {
        exchangeResult,
        percentageFee,
      }
    }

    if (network === Networks.NervosL1) {
      const tokensDecimalsDiff = baseToken.decimals - quoteToken.decimals
      if (tokensDecimalsDiff < 0) {
        value.div(10)
      }

      return {
        exchangeResult: null,
        percentageFee: '0.00',
      }
    }

    if (network === Networks.NervosL2) {
      const payload = {
        amount: value.toString(),
        network: ApiNetworks.Ethereum, // I dont know why it is the same network but w/e
        xchainAssetIdent: quoteToken.address,
      }

      const nervosBridgeFee = await bridgeRpcClient.getBridgeOutNervosBridgeFee(
        payload,
      )

      const exchangeValue = value.sub(nervosBridgeFee.fee.amount)

      const exchangeResult: IDisplayValue = {
        value: exchangeValue,
        displayValue: truncateDecimals(
          convertIntegerDecimalToDecimal(exchangeValue, decimals),
          2,
        ),
        decimals: decimals,
      }

      const percentageFee = convertIntegerDecimalToDecimal(
        BigNumber.from(nervosBridgeFee.fee.amount).mul(100),
        decimals,
      )
      return {
        exchangeResult: exchangeResult,
        percentageFee: percentageFee,
      }
    }
  } catch (error) {
    console.error(error)
  }

  return {
    exchangeResult: null,
    percentageFee: null,
  }
}
