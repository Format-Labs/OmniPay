# OmniPe

[![OmniPe Logo](https://www.canva.com/design/DAFB5oFBnVo/FCeR3f93IHTh6DbZHXDdtQ/view?utm_content=DAFB5oFBnVo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)](https://youtu.be/jxtqWJucd6k)

## Inspiration

Payments is the most fundamental thing to every day life, almost every transaction with value is payments. Over the years there has been evolution in these payments systems to remove the friction when doing payments. With companies such as Visa and Mastercard taking charge best payment processors in the world they all face one problem they are non-censorship resistant yet they are a major backbone of payments but...

**Enter** Bitcoin - When Satoshi set out to build the Bitcoin protocol he envisioned a future where payments occur on the Bitcoin network ... But we all know that never hapenned instead it became the digital Gold.

**State of Crypto Payments today**
Most of crypto payments are fragmented each serving a particular chain or only accepting a particular chain. i.e SolanaPay for Solana, NearPay for Near and planthera of applications enabling payments across other chains.
None of these payments applications have achieved what has be done in traditional payments processors such as Visa and Mastercard.
All traditional payments processors use several moving parts such as TCP/IP and UDP as networking protocols, they also use currency exchanges to facilitate different forms of settlements. Until the past few years Crypto had no interoperability protocols that offer these messaging accross diffrerent chains.

## What OmniPe does.

Omnipe is a cross-chain payments aggragetor protocol that facilitates payments accross different chains easily without having to deploy various chains. Merchants and receiving end users can receive payments with any type of Token as long as it has enough liquidity in the receiving chain. The Merchant can also choose what type of Token they'd like to settle in the destination chain.
With these you get the features offered by payment processors such as Visa where you can spend your Dollars in Europe without having to go through Exchanges to get Euros.

## How OmniPe does this.

Omnipe uses LayerZero as its messaging protocol to coordinate messages accross diffrent chains when a payment is done. It also uses Stargate as it liquidity protocol and Uniswap as it's exchage to perform swaps. Omnipe uses Chainlink Keepers for automation and gas savings by performing bridging of funds every 30 minutes.
[![OmniPe Logo](https://imgur.com/a/Lgh4jdN)]

| Layer             |         stake Holders          |
| ----------------- | :----------------------------: |
| Application Layer | payment providers(Stripe, etc) |
| Liquidity Layer   | Connext, Stargate, Multichain  |
| Messaging Layer   |    LayerZero, Nomad, Axelar    |
| Transport Layer   |        Stargate Routers        |
| Automation        |       Chainlink Keepers        |
| Exchange          |      Uniswap, Match, etc.      |

A merchant has to create an account on the Destination chain `Settler.sol` and enter the setlement token they'd like to settle in.

## What it does

Music streaming is a digital-first technology, which has numerous verifiable data sources, therefore NUSIC bonds are focused on future streaming income, rather than music publishing in its entirety. Any rights owner with a Spotify for Artists account can mint an NFT bond, and by providing a collateral deposit for a single quarter the smart contract is able to offer a face value over the term of the bond, computing a rating based on artist popularity and quarterly collateral deposits.

The artist can fractionalize the bond, so they can offer it up as a collection on their NFT marketplace of choice. By making regular collateral deposits, a NUSIC bond issuer is able to maintain the rating, indicating the risk profile of the asset to the NFT holder. The rating engine is inspired by the work of rating agencies such as Fitch, Moody's and Standard & Poors, but designed for DeFi, meaning that the top ratings or investment grades are only possible through overcollateralization:

## What's next for NUSIC: NFT Music Bonds

There are three important components which will enable NUSIC to become established as powerful DeFi infrastructure for NFT music bonds. The music streaming oracle network itself, the yield maximizer that multiplies returns, and the NUSIC DAO, which has the potential to ground the protocol in the real world and invite contribution from the music industry.

### Music Oracle Network

To maintain reliable music streaming data for processing in the NFT bonds, we propose the following music oracle network, which would see [Chartmetric](https://www.chartmetric.com), [Soundcharts](https://www.soundcharts.com) and [Songstats](https://www.songstats.com) becoming Data Providers in the Chainlink network, delivering aggregated music streaming number feeds from the top music streaming services and social networks:

![Music Oracle Network](https://scontent-mia3-1.xx.fbcdn.net/v/t39.30808-6/260657102_2712631615699661_3010365413079885934_n.png?_nc_cat=108&ccb=1-5&_nc_sid=e3f864&_nc_ohc=sH479qKVTVAAX_SrHao&_nc_oc=AQnVrl6bLmMaIJyCn_BGcoAkuOA2NiDvK6LXsHwbt1u6h2OWgrVFzTnptl8HcNfqxI8&_nc_ht=scontent-mia3-1.xx&oh=f2243b3d30181a4c20862d65102442ac&oe=61A7C316)

Bringing these data providers into the Chainlink network will also enable the existing on-chain music projects to innovate with new use-cases, while artists and tastemakers can complement their web 3.0 presence with their existing web 2.0 data.

### Yield Maximizer

In order to maximize the bond coupon rate for NFT holders while minimizing the further collateral deposits and interest payments from the bond issuers, a portion of the advance can be allocated to the Yield Maximizer. We are looking to leverage Sushi's [Bentobox](https://docs.sushi.com/products/bentobox) vault and/or other strategies/protocols so as to provide maximum yield for market participants.

![Yield Maximizer](https://scontent-mia3-1.xx.fbcdn.net/v/t39.30808-6/261124395_2712638855698937_7479942245748074067_n.png?_nc_cat=100&ccb=1-5&_nc_sid=0debeb&_nc_ohc=iH9NmpwY7TsAX8woVfU&_nc_ht=scontent-mia3-1.xx&oh=85a9f367ff3c4b027535682bb5ac60fe&oe=61A748F5)

### NUSIC DAO

The NUSIC DAO will enable real-world music streaming invoices and/or music catalogs to be provided as collateral, in order to give more security to the bond holders. NUSIC governance will advance the refinement of the bond rating engine, and enable DAO participants to access further music investment opportunities through the strength of the network.

# [Join Us!](https://nusic.fm/join-dao)

## Deployed Addresses on Rinkeby

RatingEngine deployed to: 0x960319ef5663148bd03AbEeaf0EaB00A9C89bc1b <br>
ChainlinkSpotifyListeners deployed to: 0x05cA3e08c871D6CE41AaffdEB59d71088dFD76F0 <br>
ChainlinkYoutubeSubscribers deployed to: 0xc24b4940D52B97F6D2754F51CE40b38e64E81d9B <br>
ChainlinkMetadataRequest deployed to: 0x681Ffe5CCfA0576017e82ab87efBDe130C5930AF <br>
BondNFTGenerator deployed to: 0x9e51efE23277Ed2547c16F502463105db318bdaF <br>
BondNFTManager deployed to: 0x69D6B89B4Ec7F07b81E877772b87e2AD248396Be <br>

#### Deploy All Contracts

```shell
npx hardhat run scripts/01_deploy.ts --network rinkeby
```

#### Fund Chainlink Contracts

Replace Contract Addresses in script then run following command

```shell
npx hardhat run scripts/02_fund-contracts.ts --network rinkeby
```

#### Create Asset Pool

```shell
npx hardhat create-asset-pool --contract < BondNFTManager Address > --network rinkeby
```

#### Read Asset Pool Details

```shell
npx hardhat read-asset-pool --contract < BondNFTManager Address > --asset-pool-creator-address < Asset pool creator Address > --network rinkeby
```

#### Issue NFT Bond

```shell
npx hardhat issue-nft-bond --contract < BondNFTManager Address > --asset-pool-address < Address of Asset Pool received from previous command > --network rinkeby
```

#### Verify Bond Creation

```shell
npx hardhat verify-nft-creation --nft-manager-contract-address < BondNFTManager Address >  --nft-creator-address < Bond NFT creator Address > --network rinkeby
```

#### Verify Bond Details which will be updated from Chainlink Oracle

```shell
npx hardhat verify-nft-bond --bond-contract-address < Bond NFT Address received in previous address > --network rinkeby
```

#### Mint Tokens for Particular NFT Bond

```shell
npx hardhat mint-nft --nft-manager-address < BondNFTManager Address > --nft-bond-address <Bond NFT Token Address> --network rinkeby
```

#### Read Bond NFT Details

```shell
npx hardhat read-token-details --nft-bond-address <Bond NFT Token Address> --network rinkeby
```

#### Set Base URI for NFT Bond Metadata

```shell
npx hardhat set-token-uri --nft-bond-address <Bond NFT Token Address> --uri < UIR Here > --network rinkeby
```
