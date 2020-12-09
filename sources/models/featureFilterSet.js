// These are the feature filters and tree hierarchy we want to use for the thumbnail table */
//REMEMBER The Full Feature name is ROOT: <LEAF>  I removed the duplicative part

export const featureFilters = {
  Dots: ["Regular", "Irregular"],
  "Globules / Clods": [
    "Cobblestone Pattern",
    "Irregular",
    "Milky-red",
    "Regular",
    "Rim of brown globules",
  ],
  Lines: [
    "Angulated lines / Polygons / Zig-Zag",
    "Branched streaks",
    "Pseudopods",
    "Radial streaming",
  ],
  Network: [
    "Atypical pigment network / Reticulation",
    "Broadened pigment network / Reticulation",
    "Delicate pigment network / Reticulation",
    "Typical pigment network / Reticulation",
    "Negative pigment network / Reticulation",
  ],
  Patterns: ["Starburst pattern", "Homogeneous pattern"],
  "Regression structures": [
    "Peppering/granularity",
    "Scar-like depigmentation",
  ],
  "Shint white structures": ["Shiny white straeks"],
  Structureless: [
    "Blue whitish veil",
    "Blotch Regular",
    "Blotch Irregular",
    "Tan (Brown) Peripheral Structureless areas",
    "Milky-red areas",
  ],
  "Vessel morphology, monomorphous": [
    "Dots",
    "Comma",
    "Corkscrew",
    "Linear irregular / Serpentine",
    "Polymorphous",
  ],
};
