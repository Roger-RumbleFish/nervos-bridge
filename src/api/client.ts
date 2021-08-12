import { BridgeRPCHandler } from 'nervos-godwoken-integration'

export const getBridgeRPCClient = (url?: string): BridgeRPCHandler => {
  const forceBridgeUrl = url ?? 'https://bridge-godwoken.rumblefish.dev/'
  const rpcClient = new BridgeRPCHandler(forceBridgeUrl)
  return rpcClient
}
