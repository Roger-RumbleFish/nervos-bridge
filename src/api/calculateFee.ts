import { BigNumber } from 'ethers'

import { IDisplayValue } from '@interfaces/data'
import {
  convertIntegerDecimalToDecimal,
  truncateDecimals,
} from '@utils/stringOperations'

import { bridgeRpcClient } from './client'

export const calculateFee = async (
  id: string,
  amount: IDisplayValue,
  networkName: string,
): Promise<{
  exchangeResult: IDisplayValue
  percentageFee: string
}> => {
  try {
    const payload = {
      amount: amount.value.toString(),
      network: networkName,
      xchainAssetIdent: id,
    }

    const nervosBridgeFee = await bridgeRpcClient.getBridgeInNervosBridgeFee(
      payload,
    )

    const exchangeValue = amount.value.sub(nervosBridgeFee.fee.amount)

    const decimals = amount.decimals ?? 2

    const exchangeResult: IDisplayValue = {
      value: exchangeValue,
      displayValue: truncateDecimals(
        convertIntegerDecimalToDecimal(exchangeValue, decimals),
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
  } catch (error) {
    console.error(error)
  }

  return {
    exchangeResult: null,
    percentageFee: null,
  }
}
