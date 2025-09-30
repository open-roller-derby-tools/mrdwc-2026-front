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
  const url = new URL(`${config.public.apiBase}/items/${item}/`);
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
