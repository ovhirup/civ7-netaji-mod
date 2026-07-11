# Claude Chat project setup

How to build the "Civ VII Netaji Mod" project on claude.ai:

1. Create a Project (claude.ai → Projects → New).
2. **Instructions field** ← paste the contents of `PROJECT-INSTRUCTIONS.md`
   (this is the meta prompt; it does NOT go in knowledge).
3. **Project knowledge** ← upload these four files:
   - `DESIGN.md` (repo root) — the design vision and roadmap
   - `README.md` (repo root) — current implementation status
   - `chat-project/CONTEXT-TECHNICAL.md` — writing/format constraints
   - `text/en_us/LeaderText.xml` — every string that exists today
4. Do NOT upload gameplay XML (`data/*.xml`, `config/*.xml`, `.modinfo`) —
   Chat shouldn't write schema, and stale copies invite wrong edits.

Round-trip workflow: Chat produces `LocalizedText` rows / briefs / research →
paste results back to Claude Code to wire into the mod → after each milestone,
re-upload the changed knowledge files (README.md and LeaderText.xml drift the
fastest; DESIGN.md rarely changes).
