import { IGodwokenAdapter, INetworkAdapter } from '@api/network/types'
import { Bridge, IBridge } from '@interfaces/data'

export interface BridgeBuilder<T extends INetworkAdapter> {
  setId(id: Bridge): BridgeBuilder<T>
  setName(name: string): BridgeBuilder<T>
  setGodwokenNetwork(godwokenNetwork: IGodwokenAdapter): BridgeBuilder<T>
  setBridgeNetwork(bridgeNetwork: T): BridgeBuilder<T>
  build(): IBridge
}
