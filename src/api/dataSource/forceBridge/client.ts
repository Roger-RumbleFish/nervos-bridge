import { BridgeRPCHandler } from 'nervos-godwoken-integration'

export const getBridgeRPCClient = (url?: string): BridgeRPCHandler => {
  const forceBridgeUrl =
    url ?? 'https://testnet.forcebridge.com/api/force-bridge/api/v1'
  const rpcClient = new BridgeRPCHandler(forceBridgeUrl)
  return rpcClient
}
