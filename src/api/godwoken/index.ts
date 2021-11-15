import { BigNumber, providers } from 'ethers'
import {
    AddressTranslator,
    Godwoken as GodwokenRpcHandler,
    GodwokenMessageUtils,
    RawWithdrawalRequest,
    Uint32,
    WithdrawalRequest
} from 'nervos-godwoken-integration'

export class Godwoken {
    private _provider: providers.Web3Provider
    private _godwokenRpcHandler: GodwokenRpcHandler
    private _addressTranslator: AddressTranslator

    constructor(provider: providers.Web3Provider) {
        this._provider = provider
        this._godwokenRpcHandler = new GodwokenRpcHandler('https://godwoken-testnet-web3-rpc.ckbapp.dev')

        this._addressTranslator = new AddressTranslator()
    }

    async withdraw(
        amount: BigNumber,
        someSudtShitHash: string,
        ethAddress: string,
    ) {
        console.log('[bridge][withdraw] amount', amount.toString())
        console.log('[bridge][withdraw] ethAddress', ethAddress)
        console.log('[bridge][withdraw] sudt lock script hash', someSudtShitHash)
        const sudtId = await this._godwokenRpcHandler.getAccountIdByScriptHash(someSudtShitHash);
        console.log('[bridge][withdraw] sudtId', sudtId)
        const layer2EthLock = this._addressTranslator.getLayer2EthLockHash(ethAddress)
        console.log('[bridge][withdraw] layer2EthLock', layer2EthLock)
        const gowokenAddress = this._addressTranslator.ethAddressToGodwokenShortAddress(ethAddress)
        console.log('[bridge][withdraw] gowokenAddress', gowokenAddress)

        const ckbAddress = this._addressTranslator.ethAddressToCkbAddress(ethAddress)
        console.log('[bridge][withdraw] ckbAddress', ckbAddress)
        // Does script hash is eth lock script hash?
        const scriptHash = await this._godwokenRpcHandler.getScriptHashByShortAddress(gowokenAddress)
        console.log('[bridge][withdraw] scriptHash', scriptHash)
        const accountId = await this._godwokenRpcHandler.getAccountIdByScriptHash(scriptHash)
        console.log('[bridge][withdraw] accountId', accountId)
        const l2LockHash = await this._godwokenRpcHandler.getScriptHash(accountId)
        console.log('[bridge][withdraw] l2LockHash', l2LockHash)

        const depositTransactionNonce: Uint32 = await this._godwokenRpcHandler.getNonce(accountId);

        const acoountLock3 = this._godwokenRpcHandler.getScriptHash()
        const accountLock = this._addressTranslator.ckbAddressToLockHash(ckbAddress)

        const HARDCODED_CAPACITY = BigNumber.from(500).mul(BigNumber.from(10).pow(8))

        const rawWithdrawalRequest: RawWithdrawalRequest = GodwokenMessageUtils.createRawWithdrawalRequest(
            depositTransactionNonce,
            HARDCODED_CAPACITY.toBigInt(),
            amount.toBigInt(),
            someSudtShitHash,
            l2LockHash,
            BigInt(0),
            BigInt(100 * 10 ** 8),
            accountLock,
            "0x" + "0".repeat(64),
            {
                sudt_id: 1,
                amount: BigInt(0),
            }
        );
        const godwokenUtils = new GodwokenMessageUtils('0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a');
        const message = godwokenUtils.generateWithdrawalMessageToSign(
            rawWithdrawalRequest
        );

        const signer = this._provider.getSigner()
        const signature = await signer.signMessage(message)
        
        console.log('[bridge][withdraw] signature', signature)
        console.log('[bridge][withdraw] rawWithdrawalRequest', rawWithdrawalRequest)

        const transaction: providers.TransactionRequest = {

        }
        const withdrawalRequest: WithdrawalRequest = {
          raw: rawWithdrawalRequest,
          signature: signature,
        };
      
        console.log("withdrawalRequest:", withdrawalRequest);

        const result = await this._godwokenRpcHandler.submitWithdrawalRequest(withdrawalRequest);
        console.log("result:", result);
      
    }
}