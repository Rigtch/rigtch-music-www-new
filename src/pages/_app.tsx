import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'

import '~/styles/globals.css'

import { client } from '~/config'
import { DefaultLayout } from '~/layouts'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </ApolloProvider>
  )
}
