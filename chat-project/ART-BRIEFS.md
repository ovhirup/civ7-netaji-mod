# Art-direction briefs — Netaji / Bharat assets

Per-asset direction for creating the mod's art (image generator or artist).
Specs (filenames, sizes, formats) are in ../ASSET-MANIFEST.md; this is the
*creative* direction. Global rules apply to every asset:

- **Match Civ VII's art style:** painterly, warm, slightly stylized realism —
  not photoreal, not cartoon. Look at the game's own leader portraits / civ
  symbols for reference.
- **Original artwork only** — never trace or reproduce a photograph of Bose.
- **Iconography limited to** the INA "Springing Tiger" and the Azad Hind
  tricolour (saffron-white-green with the springing tiger). **No Axis imagery.**
- **Framing:** dignified independence-leader, composite-nationalist. Not
  religious iconography.

---

## 1. Bharat civ symbol — `civ_sym_bharat.png` (CONFIRMED makeable)
A single, instantly-readable **monochrome silhouette emblem** (like every civ
symbol — think a clean white glyph that reads at 32px). Best subjects, pick one:
- The **Springing Tiger** (INA insignia) — a leaping tiger silhouette. Strong,
  distinctive, on-brand for Bose.
- Alternatively the Ashoka **Sarnath lion capital** simplified — but that's the
  Mughal/India establishment symbol; the Springing Tiger is more Netaji.
Recommendation: **Springing Tiger.** Flat, centered, symmetrical-ish, pure
white on transparent, no gradients or text. Must read as a tiny chip.

## 2. Leader portrait — `lp_hex_bose_*` / `lp_circ_bose_*` (NEEDS feasibility test)
A **painted bust portrait of Netaji**: three-quarter view, dignified and
resolute. Wardrobe: **INA field uniform with peaked cap** (the iconic look), or
alternatively a dark sherwani; **round spectacles** are essential to
recognizability. Warm, dramatic lighting; dark neutral background (the game
crops these into a hexagon and a circle, so keep the head/shoulders centered
with margin). Deliver the master at 256×256, downscaled copies at 128 and 64;
the circle version is the same art masked to a circle (256 + a 140 for the
diplomacy overlay). Expression: calm determination. (Do NOT invest final effort
here until the feasibility test confirms the mod can display a custom portrait.)

## 3. Azad Hind Fauj unit flag — `unitflag_azad_hind_fauj.png` (NEEDS test)
A **unit-flag emblem** in the game's flag style (small, high-contrast, reads on
the map). Subject: the **Springing Tiger** insignia again (it was the INA's
actual emblem) OR crossed rifles under the tiger. Keep it simpler/bolden than
the civ symbol since it renders small on unit banners.

## 4. Yojana Bhavan icon — `buildicon_yojana_bhavan.png` (CONFIRMED)
Building icon (painterly, ~256², reads at menu size). Subject: a **modernist
planning-ministry building** / a stylized factory-and-blueprint motif — the
"planned industry" theme (gears, a five-year-plan chart, a dam/turbine). Warm
industrial palette.

## 5. Vaidyashala icon — `buildicon_vaidyashala.png` (CONFIRMED)
Building icon. Subject: an **Ayurvedic clinic / house of healing** — mortar and
pestle, healing herbs, a caduceus-free traditional-medicine motif, or Sushruta's
surgical instruments stylized. Calm green/ochre palette (health + growth).

## 6. (Optional) National Planning Commission quarter — `buildicon_national_planning_commission.png`
If a distinct quarter icon is shown, a composite motif combining the industry +
health themes of its two buildings; otherwise it can reuse Yojana Bhavan's.

## 7. (Optional, later) Loading backgrounds / Workshop banner
- Loading background (`lsbg_bharat_*`, NEEDS test): a wide painterly scene —
  the INA on the march, the tricolour, "Dilli Chalo" energy; 1920×1080.
- Workshop banner (any size, for the mod page): Netaji + Bharat title treatment.

---

### Suggested generation prompt seed (adapt per asset)
"Painterly stylized-realistic [subject], in the visual style of a Sid Meier's
Civilization VII [leader portrait / civ emblem / building icon], warm dramatic
lighting, [palette], centered composition, [transparent background / dark
neutral background], no text." — then add the asset-specific detail above.
