# Bharat civ — writing brief (Chat-project knowledge)

The mod is adding a **Modern Age "Bharat" civilization** for Netaji to lead —
the independent, self-reliant Indian nation-state he fought to create. This
brief is for developing the civ's names and flavor text in the Claude Chat
project. Implementation (schema/XML) happens separately in Claude Code.

## Identity
Industry + composite unity: Netaji's state-planned self-reliance ("Mother
Industries", the National Planning Committee he convened as Congress president
in 1938 — Nehru chaired it), plus the
INA's deliberately composite Hindu-Muslim-Sikh unity. Complements Bose's
military leader kit rather than repeating it.

## Framing rule (strict)
- Frame Bharat around **civilizational knowledge + composite nationalism**,
  NOT religious identity. "Jai Hind" as the unifying greeting; the INA's mixed
  composition as the unity theme.
- Ancient scientific heritage (Aryabhata, Sushruta's surgery, Wootz steel, the
  Iron Pillar, zero/decimal, Sulba Sutras) is welcome as **Civilopedia and
  flavor / unlock-name** material — a continuous civilizational thread — but
  it is NOT to be pitched as literal modern science bonuses.
- **Reject Vimana / Vaimanika Shastra entirely.** It is pseudoscientific and a
  Workshop liability. Do not reference it even as flavor.
- No Axis references anywhere.

## What to write (deliverables)
Deliver each as ready-to-paste XML `<Row Tag="LOC_..."><Text>...</Text></Row>`,
proposing the LOC key. Prefixes: `LOC_CIVILIZATION_BHARAT_*`, unit/building
keys per the component. Match Civ VII's dignified register.

1. **Civilization identity text** — `LOC_CIVILIZATION_BHARAT_NAME` ("Bharat"),
   `_FULLNAME`, `_DESCRIPTION`, `_ADJECTIVE`, and `LOC_LOADING_CIV_INTRO_TEXT_BHARAT`
   (the loading-screen intro spoken over the civ reveal).
2. **Civ ability "Mother Industries"** — name + functional description
   (industry/self-reliance + composite-unity effects; the Code side sets the
   exact numbers, so write it so numbers can be slotted in).
3. **Unique unit "Azad Hind Fauj" (INA infantry)** — name, description,
   historical/Civilopedia blurb.
4. **Unique quarter "National Planning Commission"** — the quarter + its two
   buildings (one planning/production, one Ayurveda/health-and-growth), each
   name + description + short pedia note.
5. **Civic/tradition names** — a short unique civic tree; propose 3–5 civic
   names rooted in the independence movement + self-reliance (e.g. Swadeshi,
   Purna Swaraj, Forward Bloc, National Planning) with one-line flavor each.
6. **Civilopedia entry for Bharat** — ~400–600 words: the independent
   nation-state, composite nationalism, self-reliant industrialization, framed
   as the culmination of the Maurya → Chola → Bharat civilizational thread.
7. **Unlock tooltips** — e.g. `LOC_UNLOCK_PLAY_AS_BOSE_BHARAT_TOOLTIP` and the
   Chola/Maurya → Bharat transition reasons.

## Historical anchors (vetted)
- National Planning Committee, 1938 — Bose convened it as Congress president;
  Nehru chaired it. → "Mother Industries" / state-planned industrialization.
  (Always "convened", never "chaired".)
- INA / Azad Hind Fauj: composite Hindu-Muslim-Sikh regiments; "Jai Hind",
  "Dilli Chalo".
- Forward Bloc (1939); Purna Swaraj (complete independence, 1930 Congress
  declaration — predates Bose's leadership but central to the cause).
- Ancient science for flavor only: Aryabhata (astronomy), Sushruta (surgery),
  Wootz steel & the Iron Pillar (metallurgy), zero/decimal & Sulba Sutras.

## Do NOT
- Do not write gameplay XML (traits, modifiers, unit stats) — the Code side
  owns schema. If a text idea implies a mechanic, describe it in prose.
- Do not invent unit/building icon art — that's a separate art task.
