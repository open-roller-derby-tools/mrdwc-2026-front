/**
 * Build a REST API URL for fetching items from Directus with specified fields.
 *
 * @param item - The name of the item to fetch from the API.
 * @param fields - An object representing the fields to include in the request.
 *                 Nested objects are supported for dot notation:
 *                 {
 *                   name: true,
 *                   members: {
 *                     name: true,
 *                     number: true
 *                   }
 *                 }
 * @returns A URL object with the appropriate query parameters set.
 */
export default <URL>(item: string, fields: object) => {
  const config = useRuntimeConfig();
  let base = config.public.apiBase as string;

  if (!base || typeof base !== "string") {
    throw new Error(
      "NUXT_PUBLIC_API_BASE is not set. When running the built server (e.g. node .output/server/index.mjs), set the Directus API base URL: NUXT_PUBLIC_API_BASE=https://your-directus.example.com node .output/server/index.mjs"
    );
  }

  base = base.trim();
  if (!base) {
    throw new Error(
      "NUXT_PUBLIC_API_BASE is empty. Set the Directus API base URL when running the server."
    );
  }

  // Relative apiBase (e.g. "/api"): resolve against request origin (SSR) or window (client)
  if (!/^https?:\/\//i.test(base)) {
    if (import.meta.server) {
      const requestURL = useRequestURL();
      base = requestURL.origin + (base.startsWith("/") ? base : `/${base}`);
    } else if (typeof window !== "undefined") {
      base = window.location.origin + (base.startsWith("/") ? base : `/${base}`);
    } else {
      throw new Error(
        "NUXT_PUBLIC_API_BASE must be an absolute URL (e.g. https://api.example.com) when not in a request or browser context."
      );
    }
  }

  const path = base.endsWith("/") ? `${base}items/${item}/` : `${base}/items/${item}/`;
  const url = new URL(path);
  const fields_string = getString(fields, "");
  url.searchParams.append("fields", fields_string);
  // console.log(url.href);
  return url;
};

function getString(fields: object, prefix: string) {
  let list: string[] = [];
  for (let key in fields) {
    const value = (fields as any)[key];
    const full_key = prefix !== "" ? `${prefix}.${key}` : key;
    if (value === true) {
      list.push(full_key);
    } else {
      list.push(getString(value, full_key));
    }
  }
  return list.join(",");
}
