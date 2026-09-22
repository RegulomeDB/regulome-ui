import getConfig from "next/config";

/* istanbul ignore file */

const { publicRuntimeConfig } = getConfig();
export const API_URL_GDS = publicRuntimeConfig.BACKEND_URL;
export const API_CATALOG_BASE_URL = "https://api.catalogkg.igvf.org";
export const API_URL_VARIANT = "https://api.catalogkg.igvf.org/api/variants?";
export const API_URL_VARIANT_LD =
  "https://api.catalogkg.igvf.org/api/variants/variant-ld?";
export const API_URL_GDS_SCORE = publicRuntimeConfig.BACKEND_URL + "/summary?";
export const API_URL_GENE =
  "https://api.catalogkg.igvf.org/api/variants/nearest-genes?";
export const API_URL_REGULATORY_REGION =
  "https://api.catalogkg.igvf.org/api/genomic-elements?";

export const ERRORS = ["BAD_REQUEST", "NETWORK", "INTERNAL_SERVER_ERROR"];

// Site title
export const SITE_TITLE = "RegulomeDB";
// Brand color
export const BRAND_COLOR = "#36582e";

// UNICODE entity codes, needed in JSX string templates. Each property named after the equivalent
// HTML entity. Add new entries to this object as needed.
export const UC = {
  newline: "\u000A", // newline
  nbsp: "\u00A0", // non-breaking space
  deg: "\u00B0", // degree symbol
  ndash: "\u2013", // en dash
  mdash: "\u2014", // em dash
  lsquo: "\u2018", // Left single quote
  rsquo: "\u2019", // Right single quote
  ldquo: "\u201c", // Left double quote
  rdquo: "\u201d", // Right double quote
  shift: "\u21E7", // Shift key
  ctrl: "\u2303", // Control key
  cmd: "\u2318", // Place of interest, command key
};

// Keyboard event key codes.
export const KC = {
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
};
