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
