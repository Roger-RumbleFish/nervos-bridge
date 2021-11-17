import { BridgeRPCHandler as ForceBridgeRPCHandler } from 'nervos-godwoken-integration'

export const getBridgeRPCClient = (url?: string): ForceBridgeRPCHandler => {
  const forceBridgeUrl =
    url ?? 'https://testnet.forcebridge.com/api/force-bridge/api/v1'
  const rpcClient = new ForceBridgeRPCHandler(forceBridgeUrl)
  return rpcClient
}
