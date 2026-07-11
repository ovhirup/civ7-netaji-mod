# Netaji Subhas Chandra Bose — Civilization VII Leader Mod

Adds Netaji Subhas Chandra Bose, hero of the Indian independence movement,
as a playable leader. See [DESIGN.md](DESIGN.md) for the full design.

**Status: skeleton.** The structure and localization are real; several data
values are `TODO_` placeholders that must be validated against the game's
own files before the mod will load cleanly (see below).

## Layout

```
netaji-bose.modinfo        Mod manifest (entry point)
config/config.xml          Setup-screen registration (TODO — see file header)
data/leaders.xml           Leader definition + civ pairings
data/traits.xml            Leader ability (modifiers)
data/agendas.xml           AI agenda
text/en_us/leader-text.xml English localization
assets/                    Art requirements (nothing ships yet)
```

## Finishing the TODOs

Every `TODO_` value must be replaced with a real string from the game's data.
Ground truth lives in the game install:

- macOS (Steam): `~/Library/Application Support/Steam/steamapps/common/Sid Meier's Civilization VII/`
  → look under `Base/modules/base-standard/data/` for `leaders*.xml`,
  trait/modifier definitions, and agenda tables.
- Search those files for an existing leader with a similar effect
  (e.g. combat strength in friendly territory) and copy its
  `ModifierType` / `SubjectRequirementSetId` / `BehaviorType` strings.
- `config/config.xml` is easiest to fill by copying a working Workshop
  leader mod's config and renaming the types.

Alternative: generate the boilerplate with
[civ7-modding-tools](https://github.com/izica/civ7-modding-tools)
(`npm install civ7-modding-tools`) and diff against these files.

## Installing for local testing

Copy this folder to the Civ VII Mods directory and enable it under
**Additional Content** in-game:

- macOS: `~/Library/Application Support/Civilization VII/Mods/`
- Windows: `Documents\My Games\Civilization VII\Mods\`

## Publishing

Upload via the official Modding SDK (added with game update 1.2.2) to
Steam Workshop. Keep the mod data-only per the
[2K third-party mods FAQ](https://support.civilization.com/hc/en-us/articles/44037954953235-Civilization-VII-Third-Party-Party-Mods-FAQ).
