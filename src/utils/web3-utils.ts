export class V5SignerAdapter {
    constructor(private v6Wallet: any) { }

    async getAddress() {
        return this.v6Wallet.address;
    }

    async signMessage(msg: string | Uint8Array) {
        return this.v6Wallet.signMessage(msg);
    }

    async _signTypedData(domain: any, types: any, value: any) {
        return this.v6Wallet.signTypedData(domain, types, value);
    }
}
