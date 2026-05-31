// Optional peer dependency — see COMPONENT.md "Graceful fallback".
// Component loads it via dynamic import().catch(() => null); this shim only
// satisfies tsc when the package is not installed.
declare module '@chenglou/pretext'
