import ca_es from "./ca-es.lang.js";
import es_es from "./es-es.lang.js";
import en_en from "./en-en.lang.js";
import pl_pl from "./pl-pl.lang.js";

// Exports each language with more locale codes
export default [
  { key: "en", label: en_en.name, value: en_en },
  { key: "en-en", label: en_en.name, value: en_en },
  { key: "en-us", label: en_en.name, value: en_en },
  { key: "en-au", label: en_en.name, value: en_en },
  { key: "ca", label: ca_es.name, value: ca_es },
  { key: "ca-es", label: ca_es.name, value: ca_es },
  { key: "es", label: es_es.name, value: es_es },
  { key: "es-es", label: es_es.name, value: es_es },
  { key: "pl", label: pl_pl.name, value: pl_pl },
  { key: "pl-pl", label: pl_pl.name, value: pl_pl },
];
