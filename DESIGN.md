# Design: Netaji Subhas Chandra Bose — Civ VII Leader

## Framing
Bose is presented entirely through the lens of the Indian independence
struggle: the Indian National Army (Azad Hind Fauj), the Azad Hind provisional
government, "Give me blood, and I shall give you freedom," Dilli Chalo.
No Axis-alliance mechanics or iconography — visual language is the INA
Springing Tiger and the Azad Hind tricolour only.

## Leader ability — Azad Hind Fauj
1. **+5 Combat Strength** for units fighting in friendly territory
   (homeland defense / liberation).
2. **No unhappiness penalty** in captured settlements (liberated peoples
   rally to the cause).
3. **Culture burst** on capturing a settlement founded by another player.

Scale via age-gated requirements so the ability peaks in the Modern Age.

## Attributes
Starting points in **Militaristic** and **Diplomatic** trees — military
organizer and coalition-builder (Congress president, Azad Hind diplomacy).

## Agenda — Purna Swaraj (Complete Self-Rule)
Likes civs that control only settlements they founded; strongly dislikes
civs occupying other players' original settlements.

## Civ pairings (historical-choice highlights)
Maurya (Antiquity) → Chola (Exploration) → Mughal (Modern) *today*; the
planned Bharat civ (below) becomes the Modern-age historical pairing, so the
arc becomes Maurya → Chola → **Bharat**, with Mughal demoted to a geographic
choice.

## Mementos (implemented 2026-07-12)
- **Springing Tiger** — +1 Combat Strength while at war. (Original idea was
  "when at war with a larger empire", but the engine has no empire-size
  combat requirement — simplified to a plain at-war gate at official
  minor-memento magnitude.)
- **Azad Hind Radio** — +1 Influence per turn, increasing each Age.
  (Renamed from "Tokyo Radio Broadcast": the framing rule applies to
  internal names too.)

## Next major milestone — Bharat (Modern Age civilization)

### Why (thematic, not a gap-fill)
Mughal *does* exist as a playable Modern Age Indian civ (base game,
age-modern), so this is not "there's no Indian civ." The case is thematic:
Mughal is an imperial dynasty; Netaji fought to *end* imperial rule and build
an independent, self-reliant nation. Bharat represents that nation — the thing
he was fighting to create. It completes the arc Maurya → Chola → Bharat and
gives Bose a Modern pairing that matches who he was.

### Identity — industry + composite unity
State-planned self-reliance (Netaji's actual economic program: the National
Planning Committee he convened as Congress president in 1938 — Nehru chaired
it — "Mother Industries") as the mechanical core, plus a unity bonus across
diverse settlements reflecting the INA's
deliberately composite Hindu-Muslim-Sikh composition. Chosen so it
*complements* rather than duplicates Bose's military-flavored leader kit.

### Framing rule (extends the leader's)
Frame Bharat around **civilizational knowledge + composite nationalism**, not
religious identity. "Jai Hind" as a unifying greeting; INA composite units as
the unity theme. Ancient heritage (Aryabhata, Sushruta, Wootz steel, the Iron
Pillar) belongs in Civilopedia/flavor and unlock names, NOT stacked as modern
science bonuses. Reject the Grok research's Vimana/Vaimanika-Shastra aerospace
angle entirely (pseudoscientific; a Workshop-comments liability). No Axis
references anywhere, code or text.

### Anatomy of a Modern civ (from the Mughal template — age-modern/config/config.xml)
A full civ is ~5–10× the leader. Required pieces, each with a Mughal precedent:
1. **Civilizations row** — type, name, full name, description, civ symbol
   icon (`civ_sym_*.png`), loading intro text. (Mughal line 11.)
2. **Civ ability trait** registered per age with age-specific descriptions
   (`TRAIT_*_ABILITY`), plus its modifiers in a GameEffects data file — same
   format as our leader ability. (Mughal lines 29–31.)
3. **Two unique units** with unit-flag icons. (Mughal: Sepoy, Zamindar.)
4. **Unique improvement or building/quarter** with icon. (Mughal: Stepwell.)
5. **Attribute tags** (`TAG_TRAIT_*`) + `TAG_APEX_AGE_MODERN`. (Mughal lines
   98, 114–115.)
6. **Age-transition unlock rows** — which prior-age civs unlock this one in
   Modern. Precedent: **Chola → Mughal already exists** (line 140), so
   Chola → Bharat is a direct copy; add Maurya → Bharat too.
7. **Leader-civ bias rows** — repoint Bose's Modern historical pairing to
   Bharat; leave Mughal as a lower-bias geographic choice.
8. A **civic/tradition (progression) tree** in data — the civ's unique civics.

### Proposed content (to be refined in the Chat project)
- **Civ ability — "Mother Industries":** +Production in settlements with a
  factory/industrial building; reduced penalties from being at war or
  isolated (self-reliance); a happiness/unity bonus scaling with the number
  of *different* civilizations' former settlements you hold (composite unity).
  Numbers at official civ-ability magnitudes (calibrate against Mughal's).
- **Unique unit — Azad Hind Fauj (INA infantry):** replaces the standard
  Modern infantry; modest combat edge, and a unity/liberation flavor bonus
  (e.g. bonus when fighting to take a settlement, or reduced war-weariness).
- **Unique quarter — National Planning Commission:** two buildings, one
  Production/planning-themed, one Ayurveda/health-and-growth-themed
  (Sushruta/Ayurveda heritage → happiness/food), forming a unique quarter.
  (Alternative simpler scope: one unique improvement like Mughal's Stepwell.)
- **Tags:** `TAG_TRAIT_ECONOMIC` + `TAG_TRAIT_MILITARISTIC` (or `DIPLOMATIC`).

### Build stages (each its own execute → adversarial-verify pass)
1. **Loadable skeleton** — Civilizations row, empty-ish civ ability, tags,
   Chola/Maurya → Bharat unlocks, Bose bias repointed. Goal: Bharat appears
   in the Modern roster and as Bose's historical pairing, loads clean.
2. **Unique unit** — Azad Hind Fauj, stats + ability + text.
3. **Unique infrastructure** — National Planning Commission quarter (or a
   single improvement first).
4. **Civ ability + civic tree** — full "Mother Industries" effects and the
   unique civics.
5. **Text, icons, balance, ship.**

### Known gaps / risks
- **Art is the hard limit:** a civ needs a civ-symbol icon, two unit-flag
  icons, and building/improvement icons. Placeholders load but look unfinished
  (same class of problem as the leader portrait).
- Civ abilities and civic trees are more schema surface than anything built so
  far — expect more silent-rollback traps; verify each stage against the
  Mughal template and the SQL schemas.
- Multiplayer/compatibility: a new Modern civ interacts with age-transition
  and AI civ selection; test AI-as-Bharat and human age transitions.

## Optional second persona (later phase)
- *Bose, Congress President* — diplomatic/cultural variant.
- *Netaji* — militaristic variant (default).

## Roadmap
1. ~~**Skeleton** — leader loads, working ability + agenda.~~ *(done)*
2. ~~**Depth** — mementos (equip via UI patch), age-scaling, attributes.~~ *(done)*
3. **Bharat civ** — the Modern Age civilization above (largest milestone).
4. **Art & polish** — leader portrait/icons, civ + unit + building icons,
   LeaderUnlocks rows, UI integration, quotes.
5. **Localization** — hi_IN / bn_IN passes of final English text.
6. **Test & ship** — balance, AI + multiplayer compatibility, Steam Workshop
   release via the official Modding SDK.

Template note: the official **Mughal** civ (Base/modules/age-modern) is the
ground-truth schema reference for the Bharat build — an already-shipped
Indian-themed Modern civ with two unique units and an improvement.

## Key references
- Community docs: https://civ7community.mintlify.app/community/documentation-guide
- Leader guide: https://civ7community.mintlify.app/community/guides/general-creating-leaders
- TS toolkit: https://github.com/izica/civ7-modding-tools
- 3D-leader limitation thread: https://forums.civfanatics.com/threads/3d-leader-mods.697062/
- Leader Model Changer: https://forums.civfanatics.com/resources/addon-leader-model-changer.32124/
- 2K mods FAQ: https://support.civilization.com/hc/en-us/articles/44037954953235-Civilization-VII-Third-Party-Party-Mods-FAQ
