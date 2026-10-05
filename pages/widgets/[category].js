import { useState } from 'react'
import { useRouter } from 'next/router'
import { parseAsInteger, useQueryStates } from 'nuqs'

export async function getServerSideProps() { return { props: {} } }

export default function Widgets() {
  const router = useRouter()
  const [state, setQuery] = useQueryStates({ count: parseAsInteger.withDefault(0) })
  const [report, setReport] = useState(null)

  async function run(navigate) {
    const first = await setQuery({ count: 2 })
    const second = await setQuery({})
    setReport({ first: first.get('count'), second: second.get('count'), browserSearch: location.search })
    if (navigate) {
      await router.replace(`/widgets/blue?${second}`, undefined, { shallow: true })
    }
  }

  return <main>
    <h1>Pages Router pending query reproduction</h1>
    <p>Start at /widgets/red?count=1.</p>
    <p>nuqs count: <output data-testid="count">{state.count}</output></p>
    <button onClick={() => run(false)}>Update and read snapshot</button>
    <button onClick={() => run(true)}>Update and navigate</button>
    <pre data-testid="report">{JSON.stringify(report, null, 2)}</pre>
  </main>
}
