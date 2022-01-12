import React, { useContext } from 'react'

import Bridge from '@components/Bridge'
import ErrorLabel from '@components/ErrorLabel'
import Toggle from '@components/Toggle'
import {
  AccountBoundToken,
  BridgeFeature,
  IDisplayValue,
} from '@interfaces/data'
import { Button, Paper, Theme, useMediaQuery } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { ConfigContext } from '@utils/hooks'

import { useBridge } from '../../hooks/useBridge'
import { BRIDGE_FEATURES_LABELS } from './BridgeContainer.constants'
import { messages, errorMessages } from './BridgeContainer.messages'

const BridgeContainer: React.FC = () => {
  const isMobile = !useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const { provider, bridge } = useContext(ConfigContext)
  const {
    tokens,
    token,
    setToken,
    setValue,
    value,
    deposit,
    withdraw,
    selectedFeature,
    setSelectedFeature,
  } = useBridge({ bridge, provider })

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
