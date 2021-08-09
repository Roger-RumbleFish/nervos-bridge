import { BridgeRPCHandler } from 'nervos-godwoken-integration'

export const getBridgeRPCClient = (): BridgeRPCHandler => {
  const forceBridgeUrl = 'https://bridge-godwoken.rumblefish.dev/'
  const rpcClient = new BridgeRPCHandler(forceBridgeUrl)
  return rpcClient
}

export const bridgeRpcClient = getBridgeRPCClient()
