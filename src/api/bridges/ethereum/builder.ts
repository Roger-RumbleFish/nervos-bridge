import { EthereumNetwork } from '@api/network/ethereumAdapter'
import { GodwokenNetwork } from '@api/network/godwokenAdapter'
import { Bridge } from '@interfaces/data'

import { BridgeBuilder } from '../types'
import { ForceBridge } from './bridge'

export class ForceBridgeBuilder implements BridgeBuilder<EthereumNetwork> {
  private _id: Bridge
  private _name: string
  private _forceBridgeUrl: string
  private _godwokenNetwork: GodwokenNetwork
  private _bridgeNetwork: EthereumNetwork

  constructor(url: string) {
    this._forceBridgeUrl = url
  }

  setId(id: Bridge): ForceBridgeBuilder {
    this._id = id
    return this
  }

  setName(name: string): ForceBridgeBuilder {
    this._name = name
    return this
  }

  setGodwokenNetwork(godwokenNetwork: GodwokenNetwork): ForceBridgeBuilder {
    this._godwokenNetwork = godwokenNetwork
    return this
  }

  setBridgeNetwork(bridgeNetwork: EthereumNetwork): ForceBridgeBuilder {
    this._bridgeNetwork = bridgeNetwork
    return this
  }

  build(): ForceBridge {
    return new ForceBridge(this)
  }

  get id(): Bridge {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get url(): string {
    return this._forceBridgeUrl
  }

  get godwokenNetwork(): GodwokenNetwork {
    return this._godwokenNetwork
  }

  get bridgeNetwork(): EthereumNetwork {
    return this._bridgeNetwork
  }
}
