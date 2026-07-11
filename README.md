# Netaji Subhas Chandra Bose — Civilization VII Leader Mod

Adds Netaji Subhas Chandra Bose, hero of the Indian independence movement,
as a playable leader. See [DESIGN.md](DESIGN.md) for the full design.

**Status: skeleton, schema-validated.** Every table, effect, requirement, and
trait name was verified against the local game install — specifically the
official `ashoka-himiko-alt` leader DLC (the closest first-party template for
a leader-only mod) and `base-standard`. Not yet load-tested in game.

## Layout

```
netaji-bose.modinfo             Mod manifest (game + shell action groups)
config/config.xml               Setup-screen registration, civ pairing biases
data/leaders.xml                Leader, trait, attribute + victory-bias traits
data/leaders-gameeffects.xml    Ability modifiers + agenda (GameEffects format)
text/en_us/LeaderText.xml       English localization
assets/                         Art requirements (nothing ships yet)
```

## What the leader does

- **Azad Hind Fauj (ability):** +5 Combat Strength in friendly territory;
  +5 Happiness in settlements you did not found; +2 Culture per conquered
  settlement.
- **Attributes:** Militaristic + Political (Diplomatic tree) starting points.
- **Purna Swaraj (agenda):** relations worsen with players holding many
  captured settlements, improve with those holding fewest.
- **Pairings:** Maurya → Chola → Mughal highlighted as historical choices.

## Testing locally

Copy (or symlink) this folder into the Mods directory and enable it under
**Additional Content** in-game:

```sh
ln -s ~/dev/civ7-netaji-mod "$HOME/Library/Application Support/Civilization VII/Mods/civ7-netaji-mod"
```

Windows equivalent: `Documents\My Games\Civilization VII\Mods\`.

Known gaps to expect on first load:
1. **No leader icon/portrait** — setup screen will show a fallback icon, and
   in-game the leader will use a placeholder 3D model (Civ VII has no custom
   3D-leader pipeline; see assets/README.md for the 2D-portrait workaround).
2. **Agenda WeightType** is the ideology-scoped captured-settlements compare —
   verify it fires outside the Modern Age; swap if inert (options listed in
   base-standard).
3. Balance numbers are first guesses.

## Ground truth for further work

Official data files to copy schema from (local install):

```
~/Library/Application Support/Steam/steamapps/common/Sid Meier's Civilization VII/
  CivilizationVII.app/Contents/Resources/Base/modules/base-standard/   # core schema
  CivilizationVII.app/Contents/Resources/DLC/ashoka-himiko-alt/        # leader DLC template
```

## Publishing

Upload via the official Modding SDK (added with game update 1.2.2) to Steam
Workshop. Keep the mod data-only per the
[2K third-party mods FAQ](https://support.civilization.com/hc/en-us/articles/44037954953235-Civilization-VII-Third-Party-Party-Mods-FAQ).
