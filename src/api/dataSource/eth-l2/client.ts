import { BridgeRPCHandler } from 'nervos-godwoken-integration'

import { DEFAULT_BRIDGE_RPC } from './constant'

export const getBridgeRPCClient = (url?: string): BridgeRPCHandler => {
  const forceBridgeUrl = url ?? DEFAULT_BRIDGE_RPC
  const rpcClient = new BridgeRPCHandler(forceBridgeUrl)
  return rpcClient
}
