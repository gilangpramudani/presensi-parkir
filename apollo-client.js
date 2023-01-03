import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";


const httpLink = new HttpLink({
    uri: "https://together-scorpion-14.hasura.app/v1/graphql",
    headers: {
        "x-hasura-admin-secret": "k2DalLb8lPwDxyA6f028v2GZv278pzPQUAPQ23ouGw2PbPjNsenpe4xuJCKttO0t",
    }
});

const link =
    typeof window !== "undefined"
        ? split(
            ({ query }) => {
                const def = getMainDefinition(query);
                return (
                    def.kind === "OperationDefinition"
                );
            },
            httpLink
        )
        : httpLink;

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});