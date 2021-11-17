import { BigNumber, providers } from 'ethers'
import { AddressTranslator } from 'nervos-godwoken-integration'

import { IDisplayValue, Token } from '@interfaces/data'
import { ApiNetworks, Networks } from '@utils/constants'
import { IConfigContext } from '@utils/hooks'
import {
  convertDecimalToIntegerDecimal,
  convertIntegerDecimalToDecimal,
  truncateDecimals,
} from '@utils/stringOperations'

import { getBridgeRPCClient } from './client'

const convertFeeToFeeModel = (
  value: BigNumber,
  fee: string,
  decimals: number,
) => {
  const exchangeValue = value.sub(fee)

  const exchangeResult: IDisplayValue = {
    value: exchangeValue,
    displayValue: truncateDecimals(
      convertIntegerDecimalToDecimal(exchangeValue, decimals),
      2,
    ),
    decimals: decimals,
  }

  const percentageFee = convertIntegerDecimalToDecimal(
    BigNumber.from(fee).mul(100),
    decimals,
  )

  return {
    fee: exchangeResult,
    percentage: percentageFee,
  }
}

export const calculateFee = async (
  provider: providers.Web3Provider,
  baseToken: Token,
  quoteToken: Token,
  amount: string,
  network: string,
  config?: IConfigContext['config'],
): Promise<{
  fee: IDisplayValue
  percentage: string
}> => {
  try {
    const bridgeRpcClient = getBridgeRPCClient(config?.rpcBridgeUrl)
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

      const fee = nervosBridgeFee.fee.amount
      return convertFeeToFeeModel(value, fee, decimals)
    }

    if (network === Networks.NervosL1) {
      const addressTranslator = new AddressTranslator(config?.addressTranslator)
      const accounts = await provider?.listAccounts()

      if (!accounts || accounts.length === 0) {
        const tokensDecimalsDiff = baseToken.decimals - quoteToken.decimals
        let exchangeValue = value

        if (tokensDecimalsDiff < 0) {
          exchangeValue = value.div(10 * Math.abs(tokensDecimalsDiff))
        } else if (tokensDecimalsDiff > 0) {
          exchangeValue = value.mul(10 * Math.abs(tokensDecimalsDiff))
        }

        const exchangeResult: IDisplayValue = {
          value: exchangeValue,
          displayValue: truncateDecimals(
            convertIntegerDecimalToDecimal(exchangeValue, quoteToken.decimals),
            2,
          ),
          decimals: decimals,
        }

        return {
          fee: exchangeResult,
          percentage: '0.00',
        }
      }

      const fee = await addressTranslator.calculateLayer1ToLayer2Fee(
        provider as any,
        accounts[0],
        '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e',
        amount,
      )
      // 0x265566D4365d80152515E800ca39424300374A83
      console.log(
        fee.getFee(),
        provider as any,
        accounts[0],
        '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e',
        amount,
      )

      const fee2 = fee.getFee().toHexString()
      console.log(fee2)

      return convertFeeToFeeModel(value, fee2, decimals)
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
        fee: exchangeResult,
        percentage: percentageFee,
      }
    }
  } catch (error) {
    console.error(error)
  }

  return {
    fee: null,
    percentage: null,
  }
}
