import { BigNumber } from 'ethers'

import { IDisplayValue } from '@interfaces/data'
import {
  convertDecimalToIntegerDecimal,
  convertIntegerDecimalToDecimal,
  truncateDecimals,
} from '@utils/stringOperations'

import { bridgeRpcClient } from './client'

export const calculateFee = async (
  id: string,
  amount: string,
  amountDecimals: number,
  networkName: string,
): Promise<{
  exchangeResult: IDisplayValue
  percentageFee: string
}> => {
  try {
    const value = convertDecimalToIntegerDecimal(amount, amountDecimals)
    const decimals = amountDecimals ?? 2

    const payload = {
      amount: value.toString(),
      network: networkName,
      xchainAssetIdent: id,
    }

    const nervosBridgeFee = await bridgeRpcClient.getBridgeInNervosBridgeFee(
      payload,
    )

    const exchangeValue = value.sub(nervosBridgeFee.fee.amount)

    const exchangeResult: IDisplayValue = {
      value: exchangeValue,
      displayValue: truncateDecimals(
        convertIntegerDecimalToDecimal(exchangeValue, decimals),
        6,
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
