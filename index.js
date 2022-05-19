const {ethers} = require('ethers')
const ROFI_ABI = require('./rofi-abi.json')
const BULKD_SENDER_CONTRACT_ABI = require('./buldk-sender-abi.json')

const provider_url = 'https://bsc-dataseed1.defibit.io/'
const SENDER_ADDRESS = '' //sender wallet
const SENDER_PRIVATEKEY = '' //sender private key

const BULKD_SENDER_CONTRACT_ADDRESS = '0xF3271e749b4c6f50760f62F6AEECab76E04bbfE3'
const ROFI_TOKEN_ADDRESS = '0x96Fd476daCE603073DaA0Ba41D9440AaFC86336B'
const receivers = ['0x05ea9701d37ca0db25993248e1d8461A8b50f24a',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c',
                    '0x81F403fE697CfcF2c21C019bD546C6b36370458c'
                    ] //demo
const amounts = ['1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000',
                '1000000000000000000'
                ] // = 1 * 10^18

const main = async () => {
    //init provider
    const provider = new ethers.providers.JsonRpcProvider(provider_url);
    const signer = new ethers.Wallet(SENDER_PRIVATEKEY, provider)
    const SENDER_CONTRACT = new ethers.Contract(BULKD_SENDER_CONTRACT_ADDRESS, BULKD_SENDER_CONTRACT_ABI, signer)
    const ROFI_CONTRACT = new ethers.Contract(ROFI_TOKEN_ADDRESS, ROFI_ABI, signer)

    // check allowance approved
    const allowance = await ROFI_CONTRACT.allowance(SENDER_ADDRESS, BULKD_SENDER_CONTRACT_ADDRESS)
    if (allowance.toString() == '0') {
        console.log('approving')
        const a_billion_token = '1000000000000000000000000000'
        await ROFI_CONTRACT.approve(BULKD_SENDER_CONTRACT_ADDRESS, a_billion_token) //approve for contract use token
    }
    // send token
    try {
        const estimateGas = await SENDER_CONTRACT.estimateGas.bulkdSend(ROFI_TOKEN_ADDRESS, receivers, amounts)
        const tx = await SENDER_CONTRACT.bulkdSend(ROFI_TOKEN_ADDRESS, receivers, amounts, {
            gasLimit: estimateGas.toString()
        })
        console.log("Sending ", tx.hash)
        await tx.wait();
        console.log("Sent ", tx.hash)
        return
    } catch (error) {
        console.error("ERROR ", error.reason)
        return
    }
}

main()