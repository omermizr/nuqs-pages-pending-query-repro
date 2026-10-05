# nuqs Pages Router pending-query reproduction

A standalone, fictional widgets page demonstrating a stale query snapshot with
nuqs 2.10.1, Next.js 16.3.5 (Pages Router), and React 19.2.4.
No backend, authentication, environment variables, or external data are required.

## Run manually

```sh
npm ci
npm run dev
```

Open http://localhost:3027/widgets/red?count=1 and click **Update and read snapshot**.
The handler is:

```js
const first = await setQuery({ count: 2 })
const second = await setQuery({})
```

Expected: both returned query objects contain `count=2`.
Observed: `first` contains `2`; `second` contains the old `1`.
At that point the browser URL still contains `count=1`; it subsequently becomes `count=2`.

Reload the initial URL and click **Update and navigate**. This additionally runs:

```js
await router.replace(`/widgets/blue?${second}`, undefined, { shallow: true })
```

Expected: `/widgets/blue?count=2`.
Observed: `/widgets/blue?count=1`.

The first button reproduces the stale snapshot without any application-issued
router navigation. The second demonstrates how reusing the returned query can
undo the preceding update.

## Automated regression

```sh
npm ci
npx playwright install chromium
npm test -- --repeat-each=3
```

These are intentionally failing regression tests: assertions describe expected
behavior. Each of the two cases failed all three repetitions on unpatched 2.10.1.

To reproduce against a production build:

```sh
npm run build
REPRO_PRODUCTION=1 npm test -- --repeat-each=3
```

The same six failures were reproduced under `next start`, not just development mode.

## Optional candidate fix

`candidate.patch` changes only the installed nuqs Pages adapter. It preserves a
copy of the pending query until the corresponding Next navigation settles, and
exposes it through a stable `getSearchParamsSnapshot`. An older completion cannot
clear a newer pending snapshot.

```sh
git apply candidate.patch
npm test -- --repeat-each=3
```

The six development-mode regression cases pass with this candidate patch. This is
a small experiment for maintainers to evaluate, not a claim that every possible
navigation interleaving is covered. `npm ci` restores the unpatched dependency.

## Debug logging

The app imports `nuqs/debug`. Enable logs in the browser console, then reload:

```js
localStorage.setItem('debug', 'nuqs')
```
