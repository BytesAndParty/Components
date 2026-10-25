> Generiert aus der live-docs-collection (skills/live-docs-collection/tanstack-query/tanstack-query.md) am 2026-10-06. Master-Quelle ist dort gepflegt (`/live-docs-update`) — bei Zweifel an der Aktualität zuerst dort nachsehen und diese Datei danach neu generieren, nicht von Hand nachziehen.

> **5.102.8 → 5.104.1 (2026-10-05):** gegengeprüft, wieder **nichts Neues für den React-Adapter oder `query-core`** —
> nur Bugfixes (u. a. isolierte Signals je DevTools-Instanz), Refactoring und Dependency-Pflege. Unten
> Beschriebenes gilt unverändert.
>
> **5.101.4 → 5.102.8 (2026-09-03):** gegengeprüft, keine neuen Features für den React-Adapter —
> reine Bugfixes (Preact/Lit/Angular/Vue-Adapter, DevTools, Key-Matching-Performance). Unten
> Beschriebenes gilt unverändert.

# TanStack Query v5 — Cached Reference

## useMutation defaults (v5)

- `retry`: **`0`** (mutations do NOT retry by default — matches our `retry: 0` policy for cart/checkout)
- `networkMode`: `'online'`
- `gcTime`: inherited from QueryClient defaults
- Callback signatures changed in v5: the rollback value returned from `onMutate` is the 3rd positional arg to `onSuccess` / `onError` / `onSettled` (named `onMutateResult`), with a 4th `context` arg containing `client`, `meta`, `mutationKey`.

```ts
onMutate: (variables, context) => Promise<TOnMutateResult | void> | TOnMutateResult | void
onError:   (err,  variables, onMutateResult, context) => unknown
onSuccess: (data, variables, onMutateResult, context) => unknown
onSettled: (data, error, variables, onMutateResult, context) => unknown
```

`context.client` is the `QueryClient` — use it inside callbacks instead of capturing the client from `useQueryClient()` outside.

## Canonical optimistic-update pattern (cache manipulation)

For state shown in multiple components (e.g. cart badge + cart page + sidebar drawer):

```tsx
const { mutate } = useMutation({
  mutationFn: (newTodo) => api.add(newTodo),
  onMutate: async (newTodo, ctx) => {
    // 1. Cancel outgoing refetches so they don't overwrite our optimistic value
    await ctx.client.cancelQueries({ queryKey: ['todos'] })
    // 2. Snapshot for rollback
    const previous = ctx.client.getQueryData(['todos'])
    // 3. Optimistic write
    ctx.client.setQueryData(['todos'], (old) => [...(old ?? []), newTodo])
    return { previous }
  },
  onError: (_err, _newTodo, onMutateResult, ctx) => {
    ctx.client.setQueryData(['todos'], onMutateResult?.previous)
  },
  onSettled: (_data, _err, _vars, _ctx2, ctx) => {
    ctx.client.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

Rules:
1. Always `cancelQueries` first — otherwise an in-flight refetch can clobber the optimistic state.
2. `onError` rollback uses `onMutateResult` (3rd arg), NOT a re-read of the cache.
3. `onSettled` always invalidates so the server-truth wins eventually.

## Lightweight pattern — `variables` only

For optimistic state visible in **one** component (and you don't need cross-tree updates), just read `variables` / `isPending` / `isError` from the mutation result and render alongside the query data. No cache writes needed.

```tsx
const { mutate, variables, isPending } = useMutation({
  mutationFn: api.add,
  onSettled: () => qc.invalidateQueries({ queryKey: ['todos'] }),
})

return (
  <>
    {todos.map(t => <Row key={t.id} todo={t} />)}
    {isPending && <Row todo={variables} dimmed />}
  </>
)
```

For cross-component access without cache writes, `useMutationState({ filters: { mutationKey: [...], status: 'pending' } })`.

## Query keys

- Convention: array prefix → entity → params. Example: `['cart']`, `['products', 'list']`, `['product', slug]`.
- Mutations that affect a query call `invalidateQueries({ queryKey: ['cart'] })` to retrigger fetch.

## staleTime guidance (project-specific, see ARCHITECTURE.md §3)

| Domain | staleTime |
|---|---|
| Cart | `0` (always fresh after mutation) |
| Stock | `30_000` |
| Search suggestions | `5 * 60_000` |

## Suspense

`useSuspenseQuery` returns data that is never `undefined` — works with `<Suspense>` + `<ErrorBoundary>`. Loading/error branches disappear from the component.
