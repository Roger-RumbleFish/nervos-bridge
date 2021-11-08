import { AddressTranslator, BridgeRPCHandler, GetConfigResponse } from 'nervos-godwoken-integration'

import { BigNumber } from '@ethersproject/bignumber'
import { IBridge, BridgedPair } from '@interfaces/data'
import { ethers, providers } from 'ethers'
import { ERC20__factory } from '../../../factories/ERC20__factory'
import Web3 from 'web3'
import { Amount } from '@lay2/pw-core'


interface EthereumBridgeConfig {
    forceBridgeUrl: string
}

const ETHEREUM_ZERO_ADDRESS =
    '0x0000000000000000000000000000000000000000'

export class EthereumForceBridge implements IBridge {
    private _web3: Web3
    private _jsonRpcProvider: providers.JsonRpcProvider
    private _forceBridgeClient: BridgeRPCHandler
    private _forceBridgeAddress: string
    private _addressTranslator: AddressTranslator

    constructor(web3: Web3, provider: providers.JsonRpcProvider, config: EthereumBridgeConfig) {
        this._web3 = web3

        this._jsonRpcProvider = provider

        const forceBridgeClient = new BridgeRPCHandler(config.forceBridgeUrl)
        this._forceBridgeClient = forceBridgeClient


        const addressTranslator = new AddressTranslator()
        this._addressTranslator = addressTranslator
    }

    async init(): Promise<IBridge> {
        const bridgeConfig = await this._forceBridgeClient.getBridgeConfig()
        this._forceBridgeAddress = bridgeConfig.xchains.Ethereum.contractAddress

        return this as IBridge
    }

    _isNativeBridgePair(bridgedPair: BridgedPair): boolean {
        return bridgedPair.shadow.address === ETHEREUM_ZERO_ADDRESS
    }

    async _getBalanceNative(ethereumAddress: string): Promise<BigNumber> {
        const balance = await this._jsonRpcProvider.getBalance(ethereumAddress)

        const balanceString: string = balance.toBigInt().toString()

        console.log('balance string', balanceString)
        return BigNumber.from(balanceString)
    }

    async _getBalanceERC20(
        ethereumAddress: string,
        erc20Address: string,
    ): Promise<BigNumber> {

        return BigNumber.from(0)
    }

    async getBalance(
        ethereumAccountAddress: string,
        bridgedPair: BridgedPair,
    ): Promise<BigNumber> {
        const { address: erc20Address } = bridgedPair.shadow

        if (!this._isNativeBridgePair(bridgedPair)) {
            return this._getBalanceERC20(ethereumAccountAddress, erc20Address)
        }

        return this._getBalanceNative(ethereumAccountAddress)
    }

    async _depositNative(
        amount: BigNumber,
    ): Promise<string> {

        const signer = this._jsonRpcProvider.getSigner()

        return 'no tx for now'
    }

    async _depositERC20(
        amount: BigNumber,
        bridgePair: BridgedPair,
    ): Promise<string> {

        const { shadow: { address: erc20Address } } = bridgePair

        const signer = this._jsonRpcProvider.getSigner()
        const ethereumAccountAddress = signer._address

        const erc20Contract = ERC20__factory.connect(erc20Address, signer)


        const allowedAmount = await erc20Contract.allowance(
            ethereumAccountAddress,
            this._forceBridgeAddress,
        )

        if (!allowedAmount.gte(amount)) {
            const tx = await erc20Contract.approve(
                this._forceBridgeAddress,
                amount,
            )

            await tx.wait()
        }

        const recipient = await this._addressTranslator.getLayer2DepositAddress(
            this._web3,
            ethereumAccountAddress,
        )

        const payload = {
            asset: {
                network: 'Nervos',
                ident: erc20Address,
                amount: amount.toString(),
            },
            recipient: recipient.addressString,
            sender: ethereumAccountAddress,
        }
        const result = await this._forceBridgeClient.generateBridgeInNervosTransaction(
            payload,
        )

        const transaction = await signer.sendTransaction(result.rawTransaction)

        return transaction.hash
    }

    async deposit(
        amount: BigNumber,
        bridgedPair: BridgedPair,
    ): Promise<string> {
        if (!this._isNativeBridgePair(bridgedPair)) {
            return this._depositERC20(amount, bridgedPair)
        }

        return this._depositNative(amount)
    }

    async withdraw(
        amount: BigNumber,
        bridgedPair: BridgedPair,
    ): Promise<string> {
        const { address: sudtIssuerLockHash } = bridgedPair.shadow
        console.log('amount', amount)
        console.log('sudt issuer lock hash', sudtIssuerLockHash)
        return 'withdraw'
    }
}
