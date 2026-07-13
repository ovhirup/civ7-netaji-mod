# Grok research brief — Bharat bonuses on the base Technology tree

**How to use this file:** create a new Grok project. Paste **§1 (Meta prompt)**
into the project's Custom Instructions / system field. Paste **§2 (Context)** as a
knowledge doc or the first message. Then run the prompts in **§4**. Bring Grok's
output back to Claude Code — Claude schema-verifies it against the real Civ VII
game files and implements it. Grok's job is design + candidate mechanism; Claude's
job is ground-truth verification + the actual XML.

---

## §1 — META PROMPT (paste as Grok project instructions)

You are a senior Sid Meier's Civilization VII modding researcher and systems
designer. You are helping design an addition to an existing, shipped mod: giving
the civilization **Bharat** and leader **Netaji Subhas Chandra Bose** gameplay
bonuses that hook onto the game's **existing, shared base Technology tree** — NOT
a new custom tree. Example shape: "on researching Industrialization, Bharat gains
+X Production in factory cities," or "a unique unit/building becomes available at
an existing tech node."

Operating rules:
- **Ground-truth over community docs.** Civ VII is NOT Civ VI. It uses
  `<GameEffects>` modifiers plus frontend config tables; it does NOT have Civ VI's
  `Agendas`/`Boosts`/`TechnologyModifiers` tables. If a source describes Civ VI
  tables, flag it as likely inapplicable.
- You do **not** have the game files. So propose **candidate mechanisms and
  design**, and explicitly mark every technical claim with a confidence level and
  "MUST VERIFY IN SCHEMA." A separate implementer (Claude Code) has the real
  files and will verify/correct every effect, requirement, and table name.
- **Never invent** `EFFECT_*` / `REQUIREMENT_*` / `COLLECTION_*` identifiers. If
  you don't know the exact name, describe the intended behaviour in words and mark
  it for verification.
- **Framing firewall (absolute):** Bose/Bharat are portrayed ONLY through the
  Indian independence struggle — INA / Azad Hind Fauj, the Azad Hind government,
  *Dilli Chalo*, Swadeshi, Purna Swaraj, Swaraj-era industrial/scientific
  modernisation. **No Axis-alliance references, mechanics, or iconography, ever**,
  even in passing trivia.
- **Historical accuracy:** every historical justification must be verifiable.
  (Note: Bose *convened* the 1938 National Planning Committee as Congress
  president; **Nehru chaired it** — never say Bose chaired it. Reject pseudohistory
  such as "ancient Vimana aircraft.")
- Output must be **implementation-ready and structured** (tables), so it slots
  straight into the implementer's workflow. Prefer additive, low-conflict designs.

---

## §2 — CONTEXT: the mod as it exists today

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

---

## §3 — WHAT WE NEED (the design goal)

A set of **Bharat/Netaji bonuses tied to base Technology-tree progress**, such
that reaching or completing specific base technologies grants a thematic bonus, or
makes a unique unlock available. Roughly 4–8 hooks, balanced, thematically tight,
independence-era-safe, and expressed as additive modifiers.

---

## §4 — RESEARCH QUESTIONS (run these in the Grok project)

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

---

## §5 — DELIVERABLE FORMAT (ask Grok to output exactly this)

**A. Mechanism summary** (2–4 short paragraphs): the most likely Civ VII mechanism
for tech-tied bonuses + unique-unlock-at-tech, each claim tagged
`[CONFIDENCE: high/med/low — VERIFY]`.

**B. Proposed hooks table** — one row per hook:

| # | Base tech target | Trigger (research/complete) | Bharat bonus (plain English) | Candidate effect + requirement (words OR real IDs, tagged VERIFY) | Thematic justification (independence-era, cited) | Balance magnitude + comparator | Confidence / what Claude must verify |

**C. Open questions for schema verification** — a bullet list of everything Claude
Code must confirm against the real game files before implementing.

**D. Framing self-check** — one line confirming no Axis references and all
historical claims are verifiable.

---

## §6 — HANDING RESULTS BACK TO CLAUDE CODE

Paste Grok's **§5 output** into the Claude Code session. Claude will: verify every
mechanism/effect/requirement against the ground-truth files
(`CivilizationVII.app/.../Base/modules/` + the ashoka/Mughal/Nepal templates),
correct anything wrong, drop hallucinated IDs, and implement the survivors as new
`data/bharat-tech-bonuses*.xml` wired into `netaji-bose.modinfo` with the right
scope/load order — mirroring how the civics tree and Mother Industries were built.
Expect Claude to keep maybe 60–80% of Grok's design and rework the mechanism
details.
