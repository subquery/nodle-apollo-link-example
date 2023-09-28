const { ApolloClient, InMemoryCache } = require('@apollo/client/core');
const { deploymentHttpLink } = require('@subql/apollo-links');
const gql = require('graphql-tag');

const options = {
  authUrl: 'https://kepler-auth.thechaindata.com',
  deploymentId: 'QmStgQRJVMGxj1LdzNirEcppPf7t8Zm4pgDkCqChqvrDKG',
  httpOptions: { fetchOptions: { timeout: 5000 } },
  logger: console, // or any other custom logger
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
    for (let i=0;i<3;i++) {
      res = await client.query({ query: metadataQuery });
    }
    console.log(`res: ${JSON.stringify(res,null,2)}`)
    cleanup();
}

main()
