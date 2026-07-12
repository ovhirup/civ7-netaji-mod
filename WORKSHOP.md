# Steam Workshop listing — copy & upload checklist

Everything needed to publish — title, description, tags, preview, screenshots.
This file is the source copy to paste in once the upload path is set up.

> **UPLOAD PATH — TBD (verify against current official docs).** Civ VII has NO
> in-game "publish/upload mod" button (the in-game Mods screen only enables/
> disables mods and opens the Steam Workshop to *browse*; verified in the game
> files). Publishing a Civ VII mod to Steam Workshop requires one of: a Firaxis/
> 2K modding SDK/tool, mod.io, or a SteamCMD Workshop upload. Confirm the CURRENT
> method from the official 2K Civ VII Third-Party Mods FAQ / Firaxis modding
> docs before uploading — do not run a blind SteamCMD publish.

---

## Title

**Netaji Subhas Chandra Bose & Bharat**

## Short blurb (one line)

Play as Netaji Subhas Chandra Bose, leader of the Azad Hind Fauj — with the
Modern-Age civilization Bharat.

## Description (paste into the Workshop body)

> **"Give me blood, and I shall give you freedom!"**
>
> This mod adds **Netaji Subhas Chandra Bose** — hero of India's independence
> struggle and commander of the Indian National Army (Azad Hind Fauj) — as a
> playable leader, together with the Modern-Age civilization **Bharat**.
>
> **Leader — Netaji Subhas Chandra Bose** (Militaristic · Diplomatic)
> • **Azad Hind Fauj:** +3 Combat Strength for units in friendly territory; +3
>   Happiness in settlements you did not found; +2 Culture per conquered
>   settlement; +1 Combat Strength for all units while at war; +1 Influence per
>   turn, rising each Age.
> • **Purna Swaraj agenda:** admires nations that rule only what they founded.
> • Historical path: **Maurya → Chola → Bharat**.
>
> **Civilization — Bharat**
> • **Mother Industries:** +5 Production with a Factory; +3 War Support in wars
>   you did not start; +1 Culture in every settlement.
> • **Unique units:** Azad Hind Fauj, Rani of Jhansi Regiment, Azad Hind Nau
>   Sena, and the Bahadur Group scouts.
> • **National Planning Commission** unique quarter, a five-node civics tree
>   (Swadeshi to Purna Swaraj), and full Ashoka Chakra / Springing Tiger art.
>
> Portrayed entirely through the independence struggle — the INA, the Azad Hind
> government, and *Dilli Chalo*. An admiring, good-faith tribute. Unofficial fan
> mod, free; not affiliated with Firaxis or 2K.
>
> *Note: the leader's voice and theme are a synthesised tribute rendition, not
> Bose's authentic recordings.*

## Suggested tags

Leaders · Civilizations · Units · Modern Age · India · Gameplay

## Preview image

`art/workshop_banner.png` (1920×1003) — Netaji with the tricolour, Ashoka Chakra,
and Sarnath Lion Capital behind him.

## Screenshots to capture (in-game, for the gallery)

1. Leader-select screen — Netaji portrait + Azad Hind Fauj ability text.
2. Civilization Details — Bharat, showing the four unique units.
3. In-game leader panel — abilities + Republic of Bharat overview.
4. The BHARAT civics tree tab (five nodes, two-branch converge layout).
5. A Bharat city with the National Planning Commission quarter.
6. Diplomacy screen — Netaji portrait.

## Pre-flight checklist (before uploading)

- [ ] Fully restart the game; confirm the mod loads with **zero** errors in
      `Logs/Database.log` and `Logs/Modding.log`.
- [ ] Enable under Additional Content; start a Modern-Age game as Netaji/Bharat.
- [ ] Verify: leader art on all screens, civ symbol, unit flags, civics tree,
      quarter, player colours.
- [ ] `.modinfo` metadata is current (Name/Description/Authors) — done.
- [ ] README + LICENSE present — done.
- [ ] Decide visibility: **Public / Friends-only / Private** (your call).
- [ ] Upload via the confirmed path (see note at top); attach
      `workshop_banner.png` as the preview and the screenshots to the gallery.
- [ ] (Optional) Add the tribute voice/theme as a linked video on the listing.

## Audio note

In-game custom audio is not possible (engine limitation — see
`chat-project/AUDIO-PLAN.md`). The ElevenLabs tribute voice (`audio/bose_vo_*`)
and the two march themes (`audio/bose_theme_*`) are intended as **Workshop-page
media** (e.g. a short linked video), clearly credited as a tribute rendition —
never as Bose's real voice.
