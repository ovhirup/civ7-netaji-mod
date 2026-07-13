# Grok Imagine — ready-to-paste prompt library

**Why this file exists:** Grok *Imagine* (the desktop app / image product) is
**prompt-driven** — it has no place to store a persistent "meta prompt" or
upload knowledge files (that's a grok.com Chat/Projects feature, a different
surface). So the framing + style + technical rules from `PROJECT-INSTRUCTIONS.md`
are **baked into each prompt below.** Paste one into "Type to imagine," generate,
then run the result through `art/process_art.py`.

**Universal rules already embedded in every prompt:** painterly Civ VII style;
independence-struggle framing only (INA Springing Tiger + Azad Hind tricolour,
**no Axis imagery**, original art not traced photos, round spectacles on Bose);
**flat solid background** on icons/silhouettes so the key-out is clean; no text.

Generate **large** (use the highest quality setting). For emblem/flag/node-icon
set aspect **1:1**; building icons **1:1**; leader portrait **2:3** or **1:1**.

---

## 1. Civ emblem — `civ` → `civ_sym_bharat.png`
> A bold heraldic emblem of a springing tiger: a single Bengal tiger leaping in
> mid-pounce, side profile, powerful and dynamic, rendered as a clean symmetrical
> **flat solid-white silhouette centered on a plain solid black background**.
> Minimal, iconic, high-contrast, like a national military insignia or crest that
> reads clearly at small size. Smooth vector-like edges. No text, no border, no
> gradient, no extra elements.

Process: `uv run art/process_art.py civ art/incoming/<file>`

## 2. Civic-tree node badge — `commission`/reuse → `cult_bharat.png`
> A small circular badge emblem combining a springing tiger silhouette over a
> subtle saffron-white-green tricolour band, clean and simple, **centered on a
> flat solid black background**, high contrast, reads at tiny size like an app
> icon. Painterly-clean. No text.

(Process with `civ` mode if you want a white silhouette, or `commission` mode to
keep colour. Real `cult_bharat` art replaces the current placeholder.)

## 3. Building icon — Yojana Bhavan — `yojana` → `buildicon_yojana_bhavan.png`
> A painterly Civilization VII style building icon of a grand modernist Indian
> planning-ministry building — clean 1950s civic architecture with a stylized
> hydroelectric dam and factory motifs and a faint five-year-plan chart behind
> it, warm steel-and-ochre industrial palette with saffron accents. Centered,
> **on a flat solid dark teal background**, dramatic lighting, iconic, reads at
> menu size. No text.

Process: `uv run art/process_art.py yojana art/incoming/<file>`

## 4. Building icon — Vaidyashala — `vaidyashala` → `buildicon_vaidyashala.png`
> A painterly Civilization VII style building icon of a traditional Indian house
> of healing (Ayurvedic clinic): a serene stone-and-timber pavilion with mortar
> and pestle, healing herbs, and stylized ancient surgical instruments, calm
> green-and-ochre palette, soft warm light. Centered, **on a flat solid dark teal
> background**, iconic, reads at menu size. Same painterly hand as a companion
> industrial building icon. No text.

Process: `uv run art/process_art.py vaidyashala art/incoming/<file>`

## 5. Unit flag — Azad Hind Fauj — `unitflag` → `unitflag_azad_hind_fauj.png`
> A bold, simple military unit-flag emblem: a springing tiger over crossed rifles,
> **flat solid-white on a plain solid black background**, extremely high contrast
> and simplified so it reads at very small size on a map banner. Clean vector-like
> edges. No text, no border.

Process: `uv run art/process_art.py unitflag art/incoming/<file>`

## 6. Leader portrait — Netaji — `leader` → `lp_hex/lp_circ_bose_*.png`
> A dignified painted bust portrait in the style of a Sid Meier's Civilization VII
> leader portrait: an original painterly likeness of an Indian independence leader
> — a resolute man in his forties with **round spectacles**, wearing an olive-green
> Indian National Army field uniform with a peaked cap (alternatively a dark
> sherwani), calm determination, three-quarter view, head and shoulders centered
> with margin, warm dramatic lighting on a **dark neutral painted background**.
> Heroic but human, historical, original artwork (not a photograph). No text.

Process (keeps background; game masks to hex/circle):
`uv run art/process_art.py leader art/incoming/<file>`

---

### Workflow reminder
Grok Imagine → download the image → drop in `art/incoming/` → run the matching
`process_art.py` command → restart Civ VII. The output filenames are already
wired into the mod (`netaji-bose.modinfo` + `data/icons/bharat-icons.xml`).

---

## Ratified visual-identity additions (STYLE-CANON ruling, user-approved 2026-07-12)

Iconography split: LEADER/INA = tiger + Azad Hind tricolour ONLY; CIVILIZATION =
Republic symbols allowed (chakra tricolour, Sarnath Lion Capital). Timeline rule:
never put post-1947 symbols IN Bose's scenes/hands — background emblems only.

### 7. Civ symbol — Ashoka Chakra ✅ DONE PROGRAMMATICALLY (do not generate)
The 24-spoke chakra is drawn mathematically (image models cannot count spokes) —
already shipped as civ_sym_bharat.png + cult_bharat.png. If a painterly-texture
variant is ever wanted, generate texture only and re-cut to the exact geometry.

### 8. Quarter icon — Lion Capital of Sarnath — `commission` → `buildicon_national_planning_commission.png`
> A single monochrome emblem for a strategy-game building icon: the ancient Lion
> Capital of Sarnath as weathered Mauryan sculpture — three visible lion heads
> back-to-back atop a circular abacus band with a small carved wheel, resting on
> a bell-shaped inverted lotus base. Flat ivory-white silhouette with painterly
> interior shading, centered on a flat solid dark charcoal background. Simplified
> monumental forms, no plinth, no motto, no text or lettering of any kind, no
> national-emblem framing, legible at 64 pixels. Style of Civilization VII
> official iconography.
(NEVER the official State Emblem lockup / "Satyameva Jayate" — State Emblem Act
2005; ancient sculpture only.)

### 9. Bharat loading still (full-screen, replaces/upgrades lsl art later)
> Painterly widescreen scene in the style of Civilization VII loading-screen art
> — realist oil-painting technique, confident visible brushwork, dramatic warm
> light. Dawn breaks over an independent modern nation: the colossal Lion
> Capital of Sarnath stands as an ancient sandstone monument in the middle
> distance catching first light; behind it a rising skyline of dams, steel
> mills, and factory chimneys under construction; in the foreground a flagstaff
> flies the Indian tricolour — saffron, white, and green horizontal bands with a
> navy-blue 24-spoke wheel at center — lifting in the wind. Palette anchored in
> saffron dawn sky shading toward green-tinged fields, ivory stone, navy
> accents. No faces in close-up, no religious architecture as focal point, no
> text or lettering anywhere, upper third kept as calm open sky.
POST: composite भारत (real Devanagari typography — macOS Devanagari fonts /
Noto Serif Devanagari; NEVER model-generated glyphs) across the reserved sky,
Latin "BHARAT" beneath.

### 10. Workshop banner (wide)
> Painterly widescreen key art in the style of Civilization VII marketing
> illustration. Foreground left: an original painted likeness of Subhas Chandra
> Bose in olive INA field uniform and peaked cap, round wire spectacles,
> resolute three-quarter pose. Sweeping behind and above him to the right, as
> emblematic backdrop rather than objects in his scene: the saffron-white-green
> tricolour with navy chakra unfurling into a dawn sky, the faint monumental
> silhouette of the Sarnath Lion Capital, and an industrial skyline in morning
> haze. Warm heroic light, dignified and hopeful, no other figures, no foreign
> flags or insignia of any kind, no text; clean band reserved along the right
> third.
POST: composite भारत / BHARAT — Republic of Bharat + tagline; जय हिन्द small
beneath. Timeline rule: emblems BEHIND him, never in his hands.

### 11. Unit flag — Rani of Jhansi Regiment → `unitflag_rani_of_jhansi.png`
> A single flat white silhouette on a pure black background, no text, no
> border, vector-flat with no gradients or shading, centered and readable at
> 64 pixels. Subject: a young woman soldier in side profile, standing at
> attention with a bolt-action rifle shouldered; military field cap, a single
> long braid falling down her back (the key identifying cue), fitted tunic,
> jodhpur-style breeches and puttees, chin lifted. Avoid: sari or civilian
> dress, facial detail, any insignia, any background element.

### 12. Unit flag — Azad Hind Nau Sena → `unitflag_nau_sena.png`
> A single flat white emblem silhouette on a pure black background, no text,
> no border, no gradients, centered and readable at 64 pixels. Subject: a
> plain naval anchor, upright, with a leaping tiger arcing across the anchor's
> ring, mid-spring, forepaws extended — one bold combined shape. No rope or
> chain on the anchor. Avoid: flags, stars, lettering, waves, photorealism.
> Fallback if the combined emblem muddies at small size: a clean side-profile
> silhouette of a small warship with a single mast and a bow wave.

### 13. Unit flag — Bahadur Group → `unitflag_bahadur.png`
> A single flat white silhouette on a pure black background, no text, no
> border, no gradients, centered and readable at 64 pixels. Subject: a scout
> crouched low on one knee in side profile, rifle held low in one hand, the
> other hand raised flat to his brow as if scanning the horizon; side cap,
> lean alert posture, kit minimal. Avoid: binocular strap clutter, parachutes,
> any insignia, any terrain.

### 14. Diplomacy portrait v2 (three-quarter length, engaged) — `diplo_bose_left/right.png`
> Fixes a uniformity gap: other leaders' 3D models turn/lean toward the
> opposing leader in diplomacy scenes; Netaji's bust portrait (item #6) faces
> forward/away regardless of which side he's placed on. This is a NEW,
> separate generation — do not replace item #6's grid/hex/circle art, which
> is already approved and wired.
>
> A dignified painted portrait in the style of a Sid Meier's Civilization VII
> diplomacy leader scene: an original painterly likeness of an Indian
> independence leader — a resolute man in his forties with round spectacles,
> wearing an olive-green Indian National Army field uniform, peaked cap with a
> small tiger-and-tricolour badge, a leather Sam Browne belt across the chest.
> Three-quarter length (waist to mid-thigh), standing in a confident three-
> quarter turn, body and gaze angled toward his RIGHT as if addressing someone
> standing to that side — not facing the viewer straight-on. Calm, resolute
> expression, warm dramatic lighting, on a dark neutral painted background
> with generous margin around the figure. Heroic but human, historical,
> original artwork, not a photograph. No text, no weapons in hand.
>
> Processing (custom, not process_art.py's standard modes): feathered-edge
> vignette blend matching the original diplo_bose.png treatment (alpha
> extract, shave, blur, CopyOpacity) → save direct as diplo_bose_left.png,
> horizontally mirror (`magick -flop`) → diplo_bose_right.png. One generation
> yields both sides; if he ends up facing the wrong way in-game, swap which
> file gets the mirror rather than regenerating.
