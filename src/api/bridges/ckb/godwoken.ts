import { BigNumber, providers } from 'ethers'
import {
  AddressTranslator,
  Godwoken as GodwokenRpcHandler,
  GodwokenMessageUtils,
  RawWithdrawalRequest,
  Uint32,
  WithdrawalRequest,
} from 'nervos-godwoken-integration'

export class Godwoken {
  private _provider: providers.JsonRpcProvider
  private _godwokenRpcHandler: GodwokenRpcHandler
  private _addressTranslator: AddressTranslator

  constructor(
    provider: providers.JsonRpcProvider,
    addressTranslator: AddressTranslator,
    godwokenRpcHandler: GodwokenRpcHandler,
  ) {
    this._provider = provider
    this._godwokenRpcHandler = godwokenRpcHandler

    this._addressTranslator = addressTranslator
  }

  async signMessageEthereum(message: string, address: string): Promise<string> {
    const result = await (window.ethereum as any).request({
      method: 'eth_sign',
      params: [address, message],
    })

    let v = Number.parseInt(result.slice(-2), 16)

    if (v >= 27) v -= 27

    return `0x${result.slice(2, -2)}${v.toString(16).padStart(2, '0')}`
  }

  async withdraw(
    amount: BigNumber,
    sudtIssuerLockHash: string,
    ethAddress: string,
  ): Promise<void> {
    const gowokenAddress = this._addressTranslator.ethAddressToGodwokenShortAddress(
      ethAddress,
    )
    const ckbAddress = this._addressTranslator.ethAddressToCkbAddress(
      ethAddress,
    )
    const scriptHash = await this._godwokenRpcHandler.getScriptHashByShortAddress(
      gowokenAddress,
    )
    const accountId = await this._godwokenRpcHandler.getAccountIdByScriptHash(
      scriptHash,
    )
    const l2LockHash = await this._godwokenRpcHandler.getScriptHash(accountId)
    const depositTransactionNonce: Uint32 = await this._godwokenRpcHandler.getNonce(
      accountId,
    )
    const accountLock = this._addressTranslator.ckbAddressToLockHash(ckbAddress)

    const HARDCODED_CAPACITY = BigNumber.from(0).mul(BigNumber.from(10).pow(8))

    const rawWithdrawalRequest: RawWithdrawalRequest = GodwokenMessageUtils.createRawWithdrawalRequest(
      depositTransactionNonce,
      amount.toBigInt(),
      HARDCODED_CAPACITY.toBigInt(),
      sudtIssuerLockHash,
      l2LockHash,
      BigInt(0),
      BigInt(100 * 10 ** 8),
      accountLock,
      '0x' + '0'.repeat(64),
      {
        sudt_id: 1,
        amount: BigInt(0),
      },
    )
    const godwokenUtils = new GodwokenMessageUtils(
      '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
    )
    const message = godwokenUtils.generateWithdrawalMessageToSign(
      rawWithdrawalRequest,
    )

    const signer = this._provider.getSigner()
    const address = await signer.getAddress()

    const signature = await this.signMessageEthereum(message, address)

    const withdrawalRequest: WithdrawalRequest = {
      raw: rawWithdrawalRequest,
      signature: signature,
    }

    console.log('withdrawalRequest:', withdrawalRequest)

    await this._godwokenRpcHandler.submitWithdrawalRequest(withdrawalRequest)
  }
}
