const { ApolloServer, gql } = require('apollo-server-lambda');
import axios from 'axios';

const typeDefs = gql`
    type Tile {
        id: String!
        name: String
        url: String
        tileImage: String
    }

    type Query {
        getTiles: [Tile]
        getTile(id: ID!): Tile
    }
`;

function tileReducer(tile) {

    const {
        id,
        attributes: {
            currentTileUrl,
            name,
            url,
        },
    } = tile;

    return {
        id,
        name,
        tileImage: currentTileUrl,
        url,
    }
}

const resolvers = {
    Query: {
        getTiles: async (_, __, ___) => {
            let processedData = [];

            await axios.get('https://shop-directory-heroku.laybuy.com/api/tiles')
            .then(({ data }) => {
                processedData =  Array.isArray(data.data) ? data.data.map(tile => tileReducer(tile)) : [];
            });

            return processedData;
        },
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

exports.handler = server.createHandler();