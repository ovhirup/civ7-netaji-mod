# Technical context for writers (upload to Chat project knowledge)

Condensed constraints so written work fits the game and the mod without the
author needing the game's schema.

## What exists in the mod today

- Leader: `LEADER_SUBHAS_CHANDRA_BOSE` ("Subhas Chandra Bose"), playable,
  tested in game 2026-07-11.
- Ability "Azad Hind Fauj": +5 Combat Strength for units fighting in friendly
  territory; +5 Happiness in settlements he did not found; +2 Culture per
  conquered settlement.
- Agenda "Purna Swaraj": relations worsen with players holding many captured
  settlements, improve with those holding fewest.
- Attributes: Militaristic + Diplomatic starting points.
- Mementos: "Springing Tiger" (+1 Combat Strength while at war) and
  "Azad Hind Radio" (+1 Influence per turn, increasing each Age). Note the
  radio memento is named for Azad Hind Radio, never "Tokyo Radio" — the
  framing rule applies to names.
- Highlighted civ pairings: Maurya (Antiquity) → Chola (Exploration) →
  Mughal (Modern). In Civ VII the leader stays for the whole match while the
  civilization changes each age — text can reference this arc.

## String/format rules

- LOC key conventions already in use (follow these when proposing new keys):
  - `LOC_LEADER_SUBHAS_CHANDRA_BOSE_*` — name/description-level text
  - `LOC_TRAIT_LEADER_BOSE_ABILITY_*` — ability text
  - `LOC_DIPLOMACY_AGENDA_PURNA_SWARAJ_*` — agenda text
  - `LOC_LOADING_LEADER_INTRO_TEXT_BOSE` — loading-screen intro
  - `LOC_MAIN_CHAR_SELECT_LEADER_SUBHAS_CHANDRA_BOSE_ANY` — selection quote
- Inline icon markup allowed in gameplay text: `[icon:YIELD_CULTURE]`,
  `[icon:YIELD_HAPPINESS]`, `[icon:COMBAT_MELEE]`. Use only in ability/effect
  descriptions, never in dialogue or pedia prose.
- Delivery format for every string:
  `<Row Tag="LOC_..." Language="en_US"><Text>...</Text></Row>`
- Languages: en_US now; hi_IN and bn_IN passes happen after English is final.

## Art constraints (for the portrait brief)

- Civ VII renders leaders as 3D models; mods cannot add custom models. This
  mod will ship a 2D portrait via the community UI workaround, plus a circular
  leader icon used in setup/diplomacy UI.
- Style target: Civ VII official leader-portrait look (painterly realism,
  dramatic single-figure composition, dark neutral background).
- Must be an original artwork — no direct reproduction of photographs.
- Wardrobe reference: INA field uniform with peaked cap OR black-gray
  sherwani; period-accurate round spectacles. Insignia limited to the
  Springing Tiger and Azad Hind tricolour.

## Historical anchors already vetted for the mod

- "Netaji" honorific; Azad Hind provisional government (1943, Singapore);
  INA / Azad Hind Fauj; slogans: "Jai Hind", "Dilli Chalo", "Give me blood,
  and I shall give you freedom" (1944 speech, Burma).
- Congress president 1938 (Haripura) and 1939 (Tripuri, resigned); founded
  Forward Bloc 1939.
- Treat details of his 1945 death as historically standard (plane crash,
  Taihoku) but note it respectfully if written about; avoid conspiracy
  framings in pedia text.
