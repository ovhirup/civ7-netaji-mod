# Grok research brief — Bharat heritage overhaul (real history + cultural heritage)

**Purpose:** research content for a larger Bharat overhaul that celebrates India's
genuine, underrepresented civilizational achievements and honestly represents the
documented colonial-era distortion of Indian prosperity — while keeping the mod's
credibility unimpeachable.

**How to use:** create/open a Grok project, paste **§1** into the project's Custom
Instructions, and run **§2** as the research prompt. Bring the output back to Claude
Code, which schema-verifies what's buildable and wires it into the mod.

---

## The accuracy principle (why this brief is scoped the way it is)

This mod's whole credibility — and the respect it pays Netaji and Bharat — rests on
being unassailable. So content is sorted into tiers, and **debunked claims are never
presented as historical/scientific fact.** That is not a limitation on ambition; it
is what makes the proud, real story land. Mythology and epics are welcome and rich —
but as **cultural/literary heritage** (the way Civilization always represents myth),
NOT as suppressed literal science.

- **Lead with the documented story** — it is genuinely underrepresented and strong:
  pre-colonial economic prosperity (~¼ of world GDP), British-era deindustrialisation,
  the "drain of wealth," Chola & Maratha naval power, Sushruta's surgery, Kautilya's
  Arthashastra, Nalanda/Takshashila, zero & Indian mathematics, wootz steel & the
  Iron Pillar.
- **Represent epics/temples/vimana as CULTURE** (Ramayana, Mahabharata, monuments) —
  clearly framed as mythology/literature/heritage.
- **Do NOT present as fact:** vimanas as real ancient aircraft (the "Vaimanika
  Shastra" is an early-1900s text, not ancient); epic "weapons" as literal
  technology; "Sanskrit invented quantum computing" (false — quantum computing is
  20th-century physics). The real, defensible kernel under the last one is
  **Panini's formal Sanskrit grammar** and its documented interest to computational
  linguistics / knowledge representation.

This is consistent with the accuracy standard held throughout this project (e.g. the
"Nehru chaired the National Planning Committee; Bose convened it" correction, and the
earlier rejection of the vimana-as-aircraft angle).

---

## §1 — META PROMPT (paste as Grok project instructions)

You are a rigorous historian of pre-colonial and colonial-era South Asia, with
expertise in economic history, maritime history, and the history of science,
medicine, and mathematics. You help design content for a Civilization VII "Bharat"
mod that celebrates India's genuine, underrepresented civilizational achievements and
honestly represents the documented economic distortion of the colonial period.

Operating rules:
- Accuracy and citations are paramount; the mod's credibility depends on every claim
  being defensible. Prefer peer-reviewed scholarship, standard economic-history
  datasets, and recognised historians.
- Classify every claim into one of four tiers: A = established consensus; B =
  debated/contested (say what's agreed vs disputed, and by whom); C = mythological /
  literary / cultural heritage (real as culture, NOT literal history — label
  clearly); D = debunked-as-fact (never present as historical/scientific truth; note
  the accurate kernel underneath, if any).
- Explicitly flag any claim that rests only on nationalist-revisionist sources OR only
  on colonial-era-dismissive sources; steer between both to the documented record.
- Mythology, epics, and monuments are welcome as Tier C cultural heritage — the way
  Civilization represents myth — never as suppressed literal science/technology.
- Output implementation-ready, structured tables. A separate implementer (Claude
  Code) will schema-verify and build; your job is rigorous history + design.

## §2 — RESEARCH PROMPT

For each topic below, classify every claim into Tier A/B/C/D and CITE sources.

1. India's share of world GDP and manufacturing before ~1750, the textile/handicraft
   economy, British-era DEINDUSTRIALISATION, and the "drain of wealth" (Naoroji and
   modern economic historians). This is the core "colonial distortion of Indian
   prosperity" narrative — establish it rigorously with numbers and sources.
2. Maritime and NAVAL history: Chola naval expeditions (Rajendra Chola, Srivijaya);
   the Maratha navy and Kanhoji Angre; Indian Ocean trade networks; shipbuilding.
3. Medicine and surgery: Sushruta and the Sushruta Samhita (rhinoplasty, cataract,
   instruments); Charaka; what is genuinely attested vs later attribution.
4. Statecraft and economics: Kautilya/Chanakya and the Arthashastra — dating,
   authorship debate, and actual content on economics, administration, espionage.
5. Mathematics, astronomy, metallurgy: the concept of zero and the decimal system;
   Aryabhata/Brahmagupta/Bhaskara; wootz (Damascus) steel; the Delhi Iron Pillar's
   corrosion resistance.
6. Education institutions: Nalanda and Takshashila as centres of learning.
7. Linguistics and the roots of formal computation: Panini's Ashtadhyayi as a
   formal/generative grammar and its documented interest to modern linguistics and
   computer science (e.g. knowledge-representation work). Explicitly CORRECT the false
   "Sanskrit invented quantum computing" claim while identifying the real, defensible
   connection.
8. Civilizational/literary heritage to represent AS CULTURE (Tier C): the Ramayana and
   Mahabharata; the concept of the vimana; major temple/monument achievements (Konark,
   etc.) — mythology, literature, and heritage, NOT literal suppressed technology.

For every Tier A/B/C item, propose how it could appear in a Civilization VII mod — a
Wonder, unique unit/building, civic/tradition, Great Work, or narrative/flavour text —
with the correct framing for its tier. For Tier D items, state plainly why they can't
be presented as fact, and what accurate alternative captures the same spirit.

## §3 — DELIVERABLE FORMAT

A per-topic table:

| Claim | Tier (A/B/C/D) | Evidence & citations | Proposed Civ VII representation | Framing notes |

End with a one-paragraph **credibility statement** confirming the set contains no
claims presented contrary to scholarly consensus, and a short list of the strongest
3–5 items to build first (the deindustrialisation narrative and the naval angle are
expected front-runners).

## §4 — HANDING RESULTS BACK TO CLAUDE CODE

Paste the §3 output into the Claude Code session. Claude verifies feasibility against
the real Civ VII game files (what's expressible as wonders/uniques/civics/modifiers),
keeps the well-sourced Tier A/B and the clearly-framed Tier C heritage, drops or
reframes any Tier D, and implements the survivors — same flow as the tech-tree bonuses
and civics tree.
