# Components TODO

- [ ] **DataTable:** Fix animations during pagination. Currently, rows only animate correctly when sorting within a single page. When changing pages, the "spring" layout transition is lost because the DOM nodes are replaced. Investigate shared layout IDs or better exit/entry staggered animations to maintain the "Fancy Minimal" feel during page transitions.
