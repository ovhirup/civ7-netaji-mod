# Claude Chat project — setup guide

Claude Code can't create the claude.ai project for you (it's in your claude.ai
account UI). This guide makes it a 3-minute copy-paste job. Everything you need
is already staged in this `chat-project/` folder.

## Step 0 — refresh the upload bundle

Some knowledge files live elsewhere in the repo and change over time. Refresh
the copies first:

```sh
cd ~/dev/civ7-netaji-mod && ./chat-project/sync.sh
```

That fills `chat-project/knowledge/` with the current DESIGN.md, MOD-STATUS.md,
and LeaderText.xml.

## Step 1 — create the project

On claude.ai: **Projects → New project**. Name it e.g.
"Civ VII Netaji Mod — writing & research".

## Step 2 — paste the Instructions (the meta prompt)

Open **`chat-project/PROJECT-INSTRUCTIONS.md`**, copy its entire body, and paste
it into the project's **Instructions / Custom Instructions** field.

> This is the meta prompt — it defines Chat's role, the framing rule, Bose's
> voice, output contracts, and the deliverables backlog. It goes in the
> Instructions field, **not** in Project knowledge.

## Step 3 — upload the knowledge files

Add these to **Project knowledge**:

From `chat-project/`:
- `CONTEXT-TECHNICAL.md`  — string/format rules, art constraints, anchors
- `BHARAT-CIV-BRIEF.md`   — the Bharat civ writing brief (needed for civ work)
- `STYLE-CANON.md`        — ratified-decisions record (the learning loop; grows over time)

From `chat-project/knowledge/` (the synced copies):
- `DESIGN.md`      — the full design + roadmap
- `MOD-STATUS.md`  — current implementation status
- `LeaderText.xml` — every in-game string that exists today

**Do not upload** gameplay XML (`data/*.xml`, `config/*.xml`, `.modinfo`,
`ui/*.js`) — Chat shouldn't write schema, and stale copies invite wrong edits.

## Step 4 — try it

Good first prompts:
- Leader: *"Write the diplomacy dialogue set from the deliverables backlog."*
- Bharat: *"Write the Bharat civilization identity text and loading intro."*

## Keeping it fresh

After each build milestone, re-run `./chat-project/sync.sh` and re-upload the
files in `chat-project/knowledge/` (MOD-STATUS.md and LeaderText.xml drift the
fastest; DESIGN.md occasionally; the `chat-project/*.md` briefs rarely change).

## Round-trip workflow

Chat produces `LocalizedText` rows / briefs / research → paste back to Claude
Code to wire into the mod → sync + re-upload after the milestone.

## Model use (advisor / executor split)

A claude.ai Project runs ONE model per chat (the composer dropdown) — there is
no automatic "plan on Fable, execute on Sonnet" routing, and it can't be set in
the meta prompt (a running model can't downgrade itself). So tiering here is
manual: switch the dropdown per task.
- **Fable / Opus** — judgment: design calls, historical vetting, deciding
  canon, final Civilopedia polish, art-direction calls.
- **Sonnet** — first drafts of dialogue sets, descriptions, localization.
- **Haiku** — mechanical reformatting, bulk strings once the pattern is set.

The genuine, automated advisor→executor→verifier tiering lives on the **Claude
Code side** (mixed-model workflows: cheap recon → Sonnet execution → Fable
verification), which is where the token-heavy work actually happens. The Chat
project is low-volume and mostly wants the strong model, so don't over-optimize
it — reach for a cheaper tier only on genuinely bulk drafting.
