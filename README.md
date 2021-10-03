This is an example application that uses [Ceramic](https://ceramic.network), based on [Next.js](https://nextjs.org/).

Fork it freely.

## Getting Started

1. Install dependencies.

2. Create local ENV file with your [web3.storage](https://web3.storage) and [INFURA](https://infura.io) access tokens:

```
WEB3STORAGE_TOKEN=eyJhbGc...
NEXT_PUBLIC_INFURA_TOKEN=b40...
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

Note: this app is not fully static. There is a backend part, that interacts with web3.storage. The backend parts runs automatically,
when you do `npm run dev` or `npm run start`.

## Learn More

To learn more about Ceramic, take a look at the following resources:

- [Ceramic Web Site](https://ceramic.network) - introduction to Ceramic Network,
- [Ceramic Developers Documentation](https://developers.ceramic.network/learn/welcome/) - dig deeper into Ceramic.
