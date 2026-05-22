import React from "react";

const importCache = new Map();

/**
 * Vitest mock for `next/dynamic` — resolves imports on layout effect without
 * suspending sibling sections (matches production loading behavior).
 */
export default function syncDynamic(importFn, options) {
  if (!importCache.has(importFn)) {
    const entry = {
      Component: null,
      promise: importFn().then((mod) => {
        entry.Component = mod.default ?? mod;
        return entry.Component;
      }),
    };
    importCache.set(importFn, entry);
  }

  const entry = importCache.get(importFn);

  function DynamicComponent(props) {
    const [Component, setComponent] = React.useState(entry.Component);

    React.useLayoutEffect(() => {
      if (entry.Component) {
        setComponent(() => entry.Component);
        return;
      }
      let cancelled = false;
      entry.promise.then((Resolved) => {
        if (!cancelled) {
          setComponent(() => Resolved);
        }
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (!Component) {
      return options?.loading ? options.loading() : null;
    }

    return React.createElement(Component, props);
  }

  DynamicComponent.displayName = "DynamicMock";
  return DynamicComponent;
}
