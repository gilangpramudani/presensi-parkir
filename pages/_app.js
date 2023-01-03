import { ApolloProvider } from '@apollo/client'
import '../styles/globals.css'
import { client } from "../apollo-client";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
    
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
