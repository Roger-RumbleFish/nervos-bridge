import { BridgeFeature } from '@interfaces/data'

import { messages } from './BridgeContainer.messages'

export const BRIDGE_FEATURES_LABELS = {
  [BridgeFeature.Deposit]: messages.DEPOSIT_LABEL,
  [BridgeFeature.Withdraw]: messages.WITHDRAW_LABEL,
}
