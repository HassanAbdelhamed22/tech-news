/**
 * Returns the localized field from an article object.
 * Falls back to the English field if the Arabic version doesn't exist.
 *
 * @param {object} item   - The article object from db.json
 * @param {string} field  - The base field name (e.g. "title", "subtitle", "description")
 * @param {string} lang   - Current language code ("en" | "ar")
 * @returns {string}
 */
const getLocalizedField = (item, field, lang) => {
  if (!item) return "";
  if (lang === "ar" && item[`${field}_ar`]) {
    return item[`${field}_ar`];
  }
  return item[field] || "";
};

export default getLocalizedField;
