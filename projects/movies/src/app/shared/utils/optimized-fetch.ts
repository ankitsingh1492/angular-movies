import { exhaustMap, groupBy, map, mergeAll, Observable, throttleTime } from 'rxjs';

/**
 * **🚀 Perf Tip for TTI, TBT:**
 *
 * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
 *
 * E.g.:
 * Subsequent HTTP get requests to the URLs api/1 -> api/2 -> api/1 can lead to over fetching of api/1 if the first request is still pending.
 * Also the API is not changing that often so we could drop fetche's within a certain timeframe
 * The following logic avoids this.
 */
export function optimizedFetch<T, K, O>(
  keySelector: (value: T) => K,
  fetch: (t: T) => Observable<O>,
  config?: { delay: number}
): (o$: Observable<T>) => Observable<O> {
  const { delay } = config || {delay: 3000};
  return (o$: Observable<T>) => o$.pipe(
    // apply operator's in the map function to the groups separately
    groupBy(keySelector),
    map(t$ => t$.pipe(
      // drop values for N ms for the same url
      throttleTime(delay, undefined, {leading: true, trailing: false}),
      exhaustMap(fetch))
    ),
    mergeAll()
  );
}

