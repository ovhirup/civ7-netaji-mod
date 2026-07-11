# Civ VII Leader Mod: Netaji Subhas Chandra Bose

Custom leader mod for Sid Meier's Civilization VII (Steam, macOS). Working in
game as of 2026-07-11. Design + roadmap: DESIGN.md. Current status: README.md.

## Non-negotiable framing rule

Bose is framed through the Indian independence struggle only (INA / Azad Hind
Fauj, Azad Hind government, "Give me blood, and I shall give you freedom",
Dilli Chalo). No Axis-alliance mechanics, references, or iconography anywhere
— code, text, or art. Visual language: INA Springing Tiger, Azad Hind tricolour.

## Ground truth (never trust community docs over these)

- Official leader-DLC template (schema source for this mod):
  `~/Library/Application Support/Steam/steamapps/common/Sid Meier's Civilization VII/CivilizationVII.app/Contents/Resources/DLC/ashoka-himiko-alt/`
- Core schema: `.../CivilizationVII.app/Contents/Resources/Base/modules/base-standard/`
  and SQL schemas in `.../Resources/Base/Assets/schema/` (frontend + gameplay).
- Community docs describe Civ VI-style `Agendas`/`HistoricalAgendas` tables —
  those DO NOT exist in Civ VII. Abilities and agendas are `<GameEffects>`
  modifiers; agendas use `EFFECT_DIPLOMACY_AGENDA_TIMED_UPDATE`.

## Hard-won schema facts

- Frontend `Leaders` config table: `LeaderIntroText` is NOT NULL. Any missing
  required column silently rolls back the ENTIRE shell config.xml — the mod
  loads but the leader never appears. Check SQL schemas before adding rows.
- `.modinfo` `Name`/`Description` must be plain text; LOC keys display raw
  for user mods (no DLC text bootstrap).
- Grep base-standard for real `EFFECT_*` / `REQUIREMENT_*` /
  `DIPLOMACY_AGENDA_COMPARE_*` names — never invent them.
- Attribute trees: `TRAIT_LEADER_ATTRIBUTE_POLITICAL` is the Diplomatic tree.

## Test / debug loop

1. Repo is symlinked into `~/Library/Application Support/Civilization VII/Mods/`
   — edits are live, but the game must be FULLY restarted to re-read manifests.
2. After a failed load, read
   `~/Library/Application Support/Civilization VII/Logs/Database.log` (exact SQL
   errors) and `Modding.log` (discovery + which action group rolled back).
3. SQLite reports only the FIRST constraint failure — check the schema for all
   required columns, not just the one in the log.
4. Validate XML parse before handing back to the user for in-game testing.

## Mementos: don't (settled)

Custom mementos are a DEAD END and were removed. They load and display, but
cannot be made *equippable*: the equip gate reads online-profile reward state
(`Online.UserProfile.isRewardUnlocked`) that mod data can't write, and a
`<UIScripts>` monkeypatch silently never executed (confirmed: zero `[BoseMod]`
lines in `~/Library/Application Support/Civilization VII/Logs/UI.log`, where JS
console output lands). The only working method is `<ImportFiles>`-replacing the
core UI model files — version-fragile, conflicts with other UI mods. Rejected.
The two memento effects are refolded into the leader ability. Don't re-attempt
custom mementos without a new engine capability. (Aside: `<UIScripts>` in a mod
modinfo did NOT run for us — treat mod UI-JS as unproven here.)

## Conventions

- Type names: `LEADER_SUBHAS_CHANDRA_BOSE`, `TRAIT_LEADER_BOSE_ABILITY`,
  modifier ids prefixed `BOSE_MOD_`, loc keys `LOC_*_BOSE_*`.
- Yield/icon markup in strings: `[icon:YIELD_CULTURE]`, `[icon:COMBAT_MELEE]`.
- Commit after each verified milestone; commit messages explain the schema
  lesson learned, not just the change.

## Division of labor

Implementation, schema work, log debugging, balance → Claude Code (here).
Creative writing, historical research, art briefs, Workshop copy → the user's
Claude Chat project (context pack in `chat-project/`). Outputs from Chat come
back as `LocalizedText` rows to wire in here.
