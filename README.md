# Netaji Subhas Chandra Bose & Bharat — Civilization VII Mod

**▶ [Play it on the Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3763580219)**

Adds **Netaji Subhas Chandra Bose**, hero of India's independence struggle, as a
playable leader, together with the Modern-Age civilization **Bharat**. Data-only
plus UI scripting — no core game files are replaced.

> **Framing.** Bose is portrayed solely through the Indian independence struggle
> — the Indian National Army / Azad Hind Fauj, the Azad Hind government, *"Give
> me blood, and I shall give you freedom,"* and *Dilli Chalo*. There are no
> Axis-alliance references, mechanics, or iconography anywhere in the mod. The
> leader art is an original painted tribute portrait, not a photograph.

**Status:** complete and tested in-game (leader, civ, units, quarter, civics
tree, art, player colours, localisation). Balance is tuned to base-game
comparators but will evolve with playtesting.

## What it adds

**Leader — Netaji Subhas Chandra Bose** (Militaristic + Diplomatic)
- **Azad Hind Fauj** (leader ability): +3 Combat Strength for units in friendly
  territory; +3 Happiness in settlements you did not found; +2 Culture per
  conquered settlement; +1 Combat Strength for all units while at war; +1
  Influence per turn, increasing each Age.
- **Purna Swaraj** (agenda): favours civilizations that rule only what they
  founded; disfavours those who hold many conquered settlements.
- Historical civ path highlighted: **Maurya → Chola → Bharat**.

**Civilization — Bharat** (Modern Age)
- **Mother Industries** (civ ability): +5 Production in settlements with a
  Factory; +3 War Support in wars you did not start; +1 Culture in all
  settlements.
- **Unique units:** Azad Hind Fauj (infantry), Rani of Jhansi Regiment (ranged),
  Azad Hind Nau Sena (naval), Bahadur Group (reconnaissance).
- **Unique quarter:** National Planning Commission (Yojana Bhavan + Vaidyashala).
- **Civics tree:** Swadeshi · Purna Swaraj · Forward Bloc · Azad Hind · National
  Planning, each unlocking a tradition.
- **Iconography:** 24-spoke Ashoka Chakra civ emblem, INA Springing Tiger unit
  flag, Sarnath Lion Capital, saffron/navy player colours.

## Install (local)

Symlink or copy this folder into the Mods directory, then enable it under
**Additional Content** in game:

```sh
ln -s ~/dev/civ7-netaji-mod \
  "$HOME/Library/Application Support/Civilization VII/Mods/civ7-netaji-mod"
```

Windows: `Documents\My Games\Sid Meier's Civilization VII\Mods\`.
Fully restart the game after adding or changing the mod (manifests are read at
startup).

## Layout

```
netaji-bose.modinfo   Manifest — game + shell action groups, ImportFiles
config/               Setup-screen registration (leader, civ, unlocks, traditions)
data/                 Gameplay: leader, civ ability, units, quarter, civics, colours, icons
text/en_us/           English localisation (LeaderText.xml, BharatText.xml)
ui/                   UI scripts — 2D leader portrait, icon/asset seams
art/                  Raw PNGs (emblem, icons, unit flags, portraits, loading, banner)
audio/                Tribute voice + theme tracks (Workshop-page media)
DESIGN.md             Design and roadmap
```

## Notes on the 2D leader

Civilization VII has no pipeline for custom rigged/animated 3D leaders. Netaji
therefore appears as a hand-framed 2D painted portrait, composited over the UI
on the diplomacy, leader-select, loading, pause, and setup screens via the mod's
UI scripts. This is the same approach used by other 2D-leader mods.

## Credits & licensing

- **Code / data / scripts:** MIT (see `LICENSE`).
- **Art:** original AI-assisted illustrations generated and composited for this
  mod; the Ashoka Chakra is drawn to the constitutional 24-spoke geometry. The
  Sarnath Lion Capital appears as ancient sculpture only, never as the State
  Emblem lockup.
- **Audio:** a *tribute rendition* — synthesised voice and an original
  "in-the-spirit" march, never presented as Bose's authentic recordings.
- Netaji Subhas Chandra Bose is a revered historical figure; this mod is an
  admiring tribute made in good faith.

Intended for the Steam Workshop. Note: Civ VII has no in-game publish button; confirm the current upload method (Firaxis/2K modding SDK, mod.io, or SteamCMD) from the official Civ VII mods documentation.
