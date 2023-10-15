const { ApolloClient, InMemoryCache } = require('@apollo/client/core');
const { deploymentHttpLink } = require('@subql/apollo-links');
const gql = require('graphql-tag');

const options = {
  authUrl: 'https://kepler-auth.subquery.network', // this is for testnet, use https://kepler-auth.subquery.network for kepler
  deploymentId: 'QmQ77QHgkKa81cVXbiChfLCcivucQpVmbim8GnnXxzd2Lu',
  httpOptions: { fetchOptions: { timeout: 5000 } },
  logger: console, // or any other custom logger
  // scoreStore: for web app pass a local storage store to keep indexer scores after page refresh, `createLocalStorageStore({ttl: 86_400_000})`
};

const { link, cleanup } = deploymentHttpLink(options);

async function main() {
    const client = new ApolloClient({
        cache: new InMemoryCache({ resultCaching: true }),
        link,
        defaultOptions: { // for demonstrate purpose, remove to utilise cache
            watchQuery: {
            fetchPolicy: 'no-cache',
            },
            query: {
            fetchPolicy: 'no-cache',
            },
        },
    });
    const metadataQuery = gql`
        query Metadata {
            _metadata {
            indexerHealthy
            indexerNodeVersion
            }
        }
    `
    let res;
    for (let i=0;i<10;i++) {
      res = await client.query({ query: metadataQuery });
    }
    console.log(`res: ${JSON.stringify(res,null,2)}`)
    cleanup();
}

main()
