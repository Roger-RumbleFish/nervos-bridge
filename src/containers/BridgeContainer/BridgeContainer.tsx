import React from 'react'

import { providers } from 'ethers'

import Bridge from '@components/Bridge'
import ErrorLabel from '@components/ErrorLabel'
import Toggle from '@components/Toggle'
import {
  AccountBoundToken,
  BridgeFeature,
  IBridge,
  IDisplayValue,
} from '@interfaces/data'
import { Button, Paper, Theme, useMediaQuery } from '@material-ui/core'
import Box from '@material-ui/core/Box'

import { BRIDGE_FEATURES_LABELS } from './BridgeContainer.constants'
import { messages, errorMessages } from './BridgeContainer.messages'

export interface BridgeProps {
  provider: providers.JsonRpcProvider
  bridge: IBridge
  tokens: AccountBoundToken[]
  token: AccountBoundToken
  setToken: (token: AccountBoundToken) => void
  deposit: () => void
  withdraw: () => void
  value: IDisplayValue
  setValue: (value: IDisplayValue) => void
  selectedFeature: BridgeFeature
  setSelectedFeature: (feature: BridgeFeature) => void
}

const BridgeContainer: React.FC<BridgeProps> = ({
  provider,
  bridge,
  tokens,
  token,
  setToken,
  deposit,
  withdraw,
  value,
  setValue,
  selectedFeature,
  setSelectedFeature,
}) => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const onBaseTokenChange = async (token: AccountBoundToken) => {
    setToken(token)
  }

  const onBaseTokenAmountChange = (newValue: IDisplayValue) => {
    setValue(newValue)
  }

  const bridgeFeatureToggles = [
    {
      name: BRIDGE_FEATURES_LABELS[BridgeFeature.Deposit],
      id: BridgeFeature.Deposit,
    },
    {
      name: BRIDGE_FEATURES_LABELS[BridgeFeature.Withdraw],
      id: BridgeFeature.Withdraw,
    },
  ]

  return (
    <>
      <Box marginBottom={2}>
        <Toggle
          toggles={bridgeFeatureToggles}
          onToggleChange={(bridgeFeature: BridgeFeature) =>
            setSelectedFeature(bridgeFeature)
          }
        />
      </Box>
      <Paper variant="outlined">
        <Box marginY={4} marginX={4}>
          <Bridge
            disableButton={provider === null}
            isCalculating={false}
            baseTokenAmount={value.displayValue}
            baseTokens={tokens}
            selectedBaseToken={token}
            onBaseTokenChange={onBaseTokenChange}
            onBaseTokenAmountChange={onBaseTokenAmountChange}
            onDepositRequest={deposit}
          />
          {selectedFeature === BridgeFeature.Deposit ? (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={
                  provider === null || !bridge?.features[BridgeFeature.Deposit]
                }
                variant="contained"
                color="primary"
                onClick={deposit}
              >
                {messages.DEPOSIT_LABEL}
              </Button>
              {bridge && !bridge.features[BridgeFeature.Deposit] && (
                <Box width="100%">
                  <ErrorLabel
                    message={errorMessages.transactionNotSupportedTemplate(
                      BridgeFeature.Deposit,
                      bridge.getDepositNetwork().name,
                      bridge.getWithdrawalNetwork().name,
                    )}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box
              marginTop={4}
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Button
                style={{ width: isMobile ? '100%' : 'auto', minWidth: '160px' }}
                disabled={
                  provider === null || !bridge?.features[BridgeFeature.Withdraw]
                }
                variant="contained"
                color="primary"
                onClick={withdraw}
              >
                {messages.WITHDRAW_LABEL}
              </Button>
              {bridge && !bridge.features[BridgeFeature.Withdraw] && (
                <Box width="100%">
                  <ErrorLabel
                    message={errorMessages.transactionNotSupportedTemplate(
                      BridgeFeature.Withdraw,
                      bridge.getWithdrawalNetwork().name,
                      bridge.getDepositNetwork().name,
                    )}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default BridgeContainer
