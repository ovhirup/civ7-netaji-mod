# Toolchain & division of labor — Netaji / Bharat mod

Which AI tool does what, and the workflows that connect them. Updated when
Grok Premium (Imagine + latest model + agent) joined the stack.

## The one-line split

| Tool | Owns | Why |
|---|---|---|
| **Claude Code** (here) | Implementation, schema/XML, log debugging, balance, git, art **post-processing + wiring**, in-game test loop | Only tool touching the repo + the game files; deterministic, verifiable. |
| **Claude Chat project** | Creative writing, historical accuracy, framing-rule guardianship, Workshop copy, the STYLE-CANON ratification loop | Holds the context pack + the "settled decisions" memory. Source of truth for text + framing. |
| **Grok Imagine** | **All 2D art generation** (civ symbol, leader portrait, unit flag, building icons, loading art, Workshop banner) | Neither Claude tool can generate painterly art. This is Grok's headline job here. |
| **Grok (latest model)** | Real-time web/X research, reference-gathering, Workshop-publishing research, competitor-mod benchmarking | Live web + X access Claude Chat lacks. Output must pass the accuracy guardrail below. |
| **Grok agent** | Multi-step web tasks: publishing-process walkthroughs, scanning existing Civ VII leader mods for art-style + technical patterns | Autonomous browsing. Use for legwork, not for repo/game changes. |

## Workflow A — Art production (the big one, unblocks Stage 5)

The spec (filenames, sizes, IDs) is in `ASSET-MANIFEST.md`; the creative
direction is in `chat-project/ART-BRIEFS.md`. The loop:

1. **Grok Imagine generates** each asset from the ART-BRIEFS direction.
   - Generate **large** (1024²+) then downscale — sharper icons than generating at 256².
   - Generate the subject on a **solid, contrasting background** (silhouettes on
     black/white; portraits on a flat neutral) so keying is clean — gen-AI does
     not reliably output transparency.
   - Keep one **consistent style seed** across assets (the seed is in ART-BRIEFS)
     so the set looks like one hand.
2. **User drops candidates** into `art/incoming/` (any size/format).
3. **Claude Code post-processes**: background removal → crop/center → resize to
   the exact manifest sizes → PNG with alpha → the correct `art/<name>.png`.
4. **Claude Code wires**: `<ImportFiles>` line + the `data/icons/*.xml` row
   already exists for every ID — usually just dropping the file in place.
5. **In-game test**, then iterate on the ones that don't read well at size.

**Priority order (ROI vs risk):**
- **First — CONFIRMED-makeable, guaranteed to work:** civ symbol (Springing
  Tiger silhouette), Yojana Bhavan + Vaidyashala building icons. These use the
  same raw-PNG path already proven in game.
- **Second — very likely, confirm with a placeholder first:** leader portrait
  (hex + circle), unit flag. The raw-PNG icon mechanism is proven; these
  specific contexts are individually unverified, so validate display before
  investing final effort.
- **Later / optional:** loading-screen background, Workshop banner.

**Hard constraints Grok Imagine must respect (framing rule):**
- Netaji: INA field uniform + peaked cap OR dark sherwani; **round spectacles
  are essential** to recognizability. Dignified, resolute.
- Iconography limited to the **INA Springing Tiger** + **Azad Hind tricolour**.
  **No Axis imagery of any kind.**
- **Original artwork only** — never trace/reproduce a photograph of Bose.
- Not religious iconography; composite-nationalist tone.

**Out of scope even with Grok:** the animated 3D diplomacy leader model. The
game has no custom-model import path (ASSET-MANIFEST §C); a 2D portrait is the
substitute. Don't spend Imagine effort trying to make a "3D leader."

## Workflow B — Research & reference (Grok model / agent)

Grok's live web+X access is genuinely additive for:
- **Reference imagery** of INA uniforms, insignia, the tricolour, period detail
  — as *direction for original art*, not to trace.
- **Workshop publishing research** — the current Civ VII mod-upload process,
  metadata, tags, screenshot requirements (feeds Stage 5 ship).
- **Benchmarking** — how shipped Civ VII leader/civ mods handle art + packaging.

**Accuracy guardrail (non-negotiable):** Grok research does NOT enter the repo
directly. It goes through the Claude Chat project's STYLE-CANON ratification
first. Precedent: the earlier Grok research pack proposed the **Vimana /
Vaimanika Shastra** angle (pseudoscience — rejected) and mislabeled historical
detail (the 1938 Planning Committee). Grok surfaces breadth; the Chat project
filters for accuracy + framing. Treat Grok output as leads, not facts.

## Additional software recommendations

Installed/needed on the Mac (Apple Silicon, brew + Python/uv already set up):

| Need | Recommended | Note |
|---|---|---|
| Background removal | `rembg` (via `uv`/pip) | Local, scriptable; great for portraits/buildings. Claude Code runs it. |
| Resize / format / silhouette keying | **ImageMagick** (`brew install imagemagick`) + Pillow | Batch downscale, threshold silhouettes, alpha. Claude Code runs it. |
| Manual icon touch-up (optional) | **Photopea** (free, browser) or **Pixelmator Pro** (Mac-native, cheap) | For hand-cleaning a silhouette edge or mask when scripting isn't enough. |
| Workshop packaging | Official Civ VII mod tools / Creator workflow | Research via Grok agent; confirm the current path before ship. |
| Backup | Push the repo to **GitHub** (still private) | Do this before the big art drop — protects the hand-built XML. |

**Deliberately NOT recommended yet:**
- **Custom audio / leader VO** (e.g. ElevenLabs for a "Jai Hind" line): the
  engine's support for custom leader audio is unconfirmed and likely as locked
  as the 3D model. Park it until/unless audio moddability is proven — same
  caution as the BLP/3D findings.
- Any BLP authoring tool — we use the `fs://` raw-PNG path, so none needed.

## How this serves the token-optimization goal

Grok absorbs the two things Claude is worst at or can't do — **image
generation** and **live web research** — while Claude Code stays on
implementation/verification and Claude Chat stays on writing/framing. Each tool
runs where it's strongest, nothing is paid for twice.
