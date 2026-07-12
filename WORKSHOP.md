# Steam Workshop listing — copy & upload checklist

Everything needed to publish — title, description, tags, preview, screenshots.
This file is the source copy to paste in once the upload path is set up.

> **UPLOAD PATH (confirmed).** Civ VII has NO in-game publish button. Publishing
> uses the **Sid Meier's Civilization VII Development Tools** (Modding SDK, built-in
> uploader), added in Update 1.2.2 — **Windows-only**. On macOS: do the *first*
> publish from Windows (VM/Boot Camp/another PC), then **SteamCMD** on macOS can
> push *content updates* to the existing item. Steam app id = **1295660**. See
> "Upload procedure" at the bottom.

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

---

## Upload procedure

First, build the clean upload folder (excludes dev files, keeps only what the
game loads — ~9 MB):

```sh
./scripts/package-workshop.sh      # -> build/upload/
```

### Path A — first publish (Windows SDK) — REQUIRED for a new item
1. On a Windows machine with Civ VII: Steam → **Library → filter "Tools"** →
   install **Sid Meier's Civilization VII Development Tools**.
2. Copy `build/upload/` (from the packager) to the Windows machine.
3. Launch the SDK → its **mod uploader**; point it at the `upload` folder.
4. Set **Title** ("Netaji Subhas Chandra Bose & Bharat"), paste the
   **Description** (above), set the **preview** to `art/workshop_banner.png`,
   choose **visibility** (start *Private*, flip to *Public* when happy).
5. Accept Steam's Workshop Legal Agreement (your click) and **Upload**.
6. **Copy the resulting Workshop item ID** — you need it for macOS updates.

### Path B — updates from macOS (SteamCMD) — after the item exists
1. Edit `scripts/workshop_item.vdf`: set `publishedfileid` to your item ID, and
   replace both `REPLACE_WITH_ABSOLUTE_PATH` with the repo's absolute path.
2. Re-run `./scripts/package-workshop.sh` to refresh `build/upload/`.
3. Publish the update (you enter your Steam login / Steam Guard):
   ```sh
   steamcmd +login <your_steam_account> \
            +workshop_build_item "$(pwd)/scripts/workshop_item.vdf" +quit
   ```
   (Install SteamCMD via `brew install --cask steamcmd` if needed.)

Note: `publishedfileid "0"` *attempts* to create a new item via SteamCMD, but
the supported first-publish is the Windows SDK. Do not run a blind create.
