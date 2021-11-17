import { BridgeRPCHandler as ForceBridgeRPCHandler } from 'nervos-godwoken-integration'

import { DEFAULT_BRIDGE_RPC } from './__constant'

export const getBridgeRPCClient = (url?: string): ForceBridgeRPCHandler => {
  const forceBridgeUrl = url ?? DEFAULT_BRIDGE_RPC
  const rpcClient = new ForceBridgeRPCHandler(forceBridgeUrl)
  return rpcClient
}
