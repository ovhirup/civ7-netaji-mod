# Art asset manifest — Netaji / Bharat mod

Every image the mod can use, its exact spec, and how it's wired. Grounded in
the official DLC art pipeline (ashoka-himiko-alt, nepal, great-britain).

## The one thing that governs everything: two art systems

Civ VII references art two ways in the icon-definition XML `Path` field:

- **`fs://game/<name>`** — a **raw file** the mod ships (a PNG on disk named
  `<name>.png`, referenced WITHOUT the extension in XML). The base game uses
  this for civ symbols and building icons. **A mod CAN create these.** ✅
- **`blp:<name>`** — a texture packed into a **pre-compiled BLP archive**
  (`Platforms/Mac/BLPs/StandardAsset.blp`) built by Firaxis's art pipeline.
  **There is no BLP authoring tool in the mod kit**, so a mod cannot produce
  new `blp:` textures. The base game uses `blp:` for leader portraits, unit
  flags, loading backgrounds, banner cards. ⚠️

**Implication:** anything the base game only ships as `blp:` is *uncertain* for
a mod. The icon-def `Path` is ours to set, and community 2D-leader mods exist,
so referencing our own `fs://game/` PNG instead of `blp:` is the presumed
workaround — but this MUST be confirmed by the in-game test below before
committing real art to those slots.

## Wiring — CONFIRMED WORKING (feasibility test passed 2026-07-12)

The magenta placeholder resolved in game, proving this exact recipe for any
raw-PNG icon:
1. **Put the PNG in the mod** (we use `art/<name>.png`).
2. **`<ImportFiles>` it** in the modinfo (path relative to modinfo; it lands in
   the VFS at `fs://game/<basename>`). Only import files that EXIST — importing
   a missing file can break load.
3. **Reference it in `data/icons/*.xml`** with the extension:
   ```xml
   <Row><ID>CIVILIZATION_BHARAT</ID><Path>fs://game/civ_sym_bharat.png</Path></Row>
   ```
4. **Load the icon file via `<UpdateIcons>`** (shell scope for setup-screen art
   like leader/civ; game scope for in-game unit/building).

The earlier failure was solely a missing `.png` extension in the Path.

**This mechanism is the SAME for every icon ID** (leader, unit, building,
civ) — so the whole 2D icon layer is confirmed moddable, not just the civ
symbol. (The leader hex/circle *contexts* and the loading-screen backgrounds
are the same table but individually unverified — confirm each as its art lands.)

To swap the placeholder for real art: just overwrite `art/civ_sym_bharat.png`
(already imported + referenced) — it drops straight in.

---

## A. CONFIRMED makeable (raw PNG via `fs://game/`)

| Asset | Game ID | icon-def Path | File on disk | Size | Notes |
|---|---|---|---|---|---|
| **Bharat civ symbol** | `CIVILIZATION_BHARAT` | `fs://game/civ_sym_bharat` | `civ_sym_bharat.png` | ~256²; game scales. White/mono silhouette on transparent | The emblem on the civ card, city banners, diplomacy. |
| **Yojana Bhavan icon** | `BUILDING_YOJANA_BHAVAN` | `fs://game/buildicon_yojana_bhavan` | `buildicon_yojana_bhavan.png` | ~256² | Building menu + city view. |
| **Vaidyashala icon** | `BUILDING_VAIDYASHALA` | `fs://game/buildicon_vaidyashala` | `buildicon_vaidyashala.png` | ~256² | Building menu + city view. |
| **National Planning Commission** (quarter) | `QUARTER_NATIONAL_PLANNING_COMMISSION` | `fs://game/buildicon_national_planning_commission` | `…png` | ~256² | Quarter tooltip; may reuse a building icon if a quarter icon slot isn't shown. |

## B. Same mechanism — CONFIRMED moddable (icon core proven; contexts/backgrounds verify-as-you-go)

(Base game ships these as `blp:`, but the icon-def Path is ours — `fs://` PNG
works here just as it does for the civ symbol. Provide each PNG + its
`<ImportFiles>` line + the `.png` icon-def row already present in bharat-icons.xml.)

| Asset | Game ID | Base-game path style | Sizes (base) | Where it shows |
|---|---|---|---|---|
| **Leader portrait — hex** | `LEADER_SUBHAS_CHANDRA_BOSE` | `blp:lp_hex_<name>_{256,128,64}` (+ `_h` happy / `_a` angry 128 variants) | 256, 128, 64 | Setup screen, diplomacy negotiation. |
| **Leader portrait — circle** | `LEADER_SUBHAS_CHANDRA_BOSE` (Context CIRCLE_MASK / PORTRAIT_MASK) | `blp:lp_circ_<name>_{256,140,128,64}` | 256/128/64 circle, 140 portrait | Circular leader icon in the top bar / setup. |
| **Azad Hind Fauj unit flag** | `UNIT_AZAD_HIND_FAUJ` (+ `_2`,`_3`) | `blp:unitflag_<name>` | ~256² | Unit flag on the map + unit list. |
| **Loading-screen leader image** | (loading-info.xml `LeaderImage`) | `lsl_subhas_chandra_bose` | full-screen (~1920×1080) | The leader intro loading screen. |
| **Loading-screen civ background** | `CIVILIZATION_BHARAT` (Context BACKGROUND) | `blp:lsbg_bharat_{1080,720}` | 1920×1080 / 1280×720 | Behind the civ reveal / loading. |

## C. NOT achievable by a mod

- **Animated 3D diplomacy leader.** No rig/import pipeline. The talking,
  gesturing model in diplomacy stays a borrowed model (via `BasePersonaType`
  in data/leaders.xml) or the default fallback (currently Benjamin Franklin).
  A static 2D portrait (section B) is the substitute for a custom face.

## Style rules for ALL Bharat/Netaji art (from STYLE-CANON / framing rule)

- Match Civ VII's painterly style; civ symbol is a clean monochrome silhouette.
- Netaji: INA field uniform + peaked cap OR black-gray sherwani; round
  spectacles. Insignia limited to the INA Springing Tiger + Azad Hind tricolour.
- Original artwork only — no direct reproduction of photographs.
- No Axis iconography anywhere.

## Immediate next step: the feasibility test

Before creating final art for section B, confirm whether a mod can supply those
slots as raw `fs://game/` PNGs (vs. the compiled `blp:` the base game uses):
1. Code side wires icon-def rows for the civ symbol (A, confirmed) AND the
   leader portrait (B, the experiment), both pointing at `fs://game/` PNGs.
2. You drop in ANY placeholder PNGs at those names.
3. Restart and check: the civ symbol should show (confirms the pipeline); if
   the leader portrait also shows, section B is unlocked for custom art.
