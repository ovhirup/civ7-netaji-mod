# Context — Bharat tech-tree bonuses research

Upload this file to the Grok project as a knowledge document. (The Project
Instructions field holds the meta prompt separately.)

---

## The mod as it exists today

- **Mod:** "Netaji Subhas Chandra Bose & Bharat," a data-only + UI-scripting mod
  for Civ VII (no core files replaced). Live on the Steam Workshop.
- **Leader — Netaji** (Militaristic + Diplomatic), ability "Azad Hind Fauj":
  combat strength in friendly territory, happiness in settlements not founded,
  culture per conquered settlement, +combat while at war, +influence/turn rising
  each Age. Agenda "Purna Swaraj."
- **Civ — Bharat** (Modern Age), ability "Mother Industries": +Production in
  settlements with a Factory, +War Support on the defensive, +Culture in all
  settlements.
- **Unique units:** Azad Hind Fauj (infantry), Rani of Jhansi Regiment (ranged),
  Azad Hind Nau Sena (naval), Bahadur Group (recon).
- **Unique quarter:** National Planning Commission (Yojana Bhavan + Vaidyashala).
- **Already has a unique CIVICS/culture tree** (`TREE_CIVICS_MO_BHARAT`, five
  nodes Swadeshi → Purna Swaraj → Forward Bloc → Azad Hind → National Planning,
  each unlocking a Tradition). This is on the **culture** system. The new work is
  the **science / Technology** side, and it should NOT be a new tree — it hooks
  onto the base shared tech tree.
- **Known-good mechanism precedent (from building the civics tree):** the mod
  grants ongoing bonuses via `<GameEffects>` `Modifier` blocks (a `collection`,
  an `effect`, `Argument`s), attached to a trait via a `TraitModifiers`-style row,
  and gated by `Requirement`s. Player/city yield modifiers, combat modifiers, and
  culture-tree reveals were all done this way. Traditions attach modifiers to a
  civ identity trait. Load order and ActionGroup scope/criteria matter (the mod
  splits always-loaded vs Modern-age-gated content).
- **Thematic palette for Bharat bonuses** (all independence-era-safe): Swadeshi
  self-reliance / domestic industry; the National Planning Committee → planned
  industrial + scientific modernisation (dams, steel, "temples of modern India,"
  CSIR/IIT lineage → Science); mass mobilisation & the INA (military logistics,
  production toward units); Azad Hind Radio → communications/influence; public
  health & sanitation (the Vaidyashala theme).

## Design goal

A set of Bharat/Netaji bonuses tied to base Technology-tree progress, such that
reaching or completing specific base technologies grants a thematic bonus, or
makes a unique unlock available. Roughly 4–8 hooks, balanced, thematically tight,
independence-era-safe, and expressed as additive modifiers.

## Research questions

1. **Mechanism:** In Civ VII, what is the actual way a civ/leader gains a bonus
   tied to a specific base Technology? Candidates to investigate and rank by
   likelihood: (a) a `Modifier` gated by a "player has researched tech X"
   requirement, applied via the civ's identity trait; (b) a tech-node "unlock"
   row that grants a modifier/ability; (c) a completion trigger/event. Describe
   the table wiring as best you can from public knowledge, and MARK FOR SCHEMA
   VERIFICATION.
2. **Unique unlocks at tech nodes:** How do base or DLC civs make a unique unit or
   building *available at a specific tech (or civic) node*? Name a concrete base
   example to mirror (ideally a Modern-age civ). Describe the prereq/unlock wiring.
3. **Thematic tech mapping:** List the real base-game **Modern-age** technologies
   (and any relevant earlier-age ones, since Bharat is Modern-apex but the leader
   plays from Antiquity) that fit Bharat's palette (industrialisation, mass
   production, radio/communications, mobilisation/logistics, sanitation/medicine,
   economics/planning, electrification/dams). For each, propose ONE Bharat bonus.
4. **Expressible bonus types:** Which bonus types are cleanly expressible as a
   single modifier in Civ VII, with a real base-game example of each (production,
   science, production-toward-buildings/units, combat strength, influence,
   food/health/happiness)? Avoid effects with no known single-modifier form.
5. **Scope & load order:** Recommend which ActionGroup scope (game vs shell) and
   criteria (always vs modern-age-gated) these tech-hooked modifiers should load
   under, reasoning from the fact that the civics tree's static definitions must
   always load while age-specific reveals are gated. (Implementer will confirm.)
6. **Balance:** For each proposed hook, give a magnitude benchmarked against
   base-game comparators, and note synergy/anti-synergy with the existing Mother
   Industries (factory production, defensive war support, culture) and Azad Hind
   Fauj abilities — avoid double-dipping the same trigger.
7. **Compatibility:** Risks of hooking onto base techs (conflicts with other mods,
   base patches). Recommend the most additive, least-fragile approach.

## Deliverable format (output exactly this)

**A. Mechanism summary** (2–4 short paragraphs): the most likely Civ VII mechanism
for tech-tied bonuses + unique-unlock-at-tech, each claim tagged
`[CONFIDENCE: high/med/low — VERIFY]`.

**B. Proposed hooks table** — one row per hook:

| # | Base tech target | Trigger (research/complete) | Bharat bonus (plain English) | Candidate effect + requirement (words OR real IDs, tagged VERIFY) | Thematic justification (independence-era, cited) | Balance magnitude + comparator | Confidence / what Claude must verify |

**C. Open questions for schema verification** — a bullet list of everything the
implementer (Claude Code) must confirm against the real game files before building.

**D. Framing self-check** — one line confirming no Axis references and all
historical claims are verifiable.
