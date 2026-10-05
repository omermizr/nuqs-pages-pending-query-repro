import 'nuqs/debug'
import { NuqsAdapter } from 'nuqs/adapters/next/pages'

export default function App({ Component, pageProps }) {
  return <NuqsAdapter><Component {...pageProps} /></NuqsAdapter>
}
