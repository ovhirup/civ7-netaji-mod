# Art assets

Nothing in this folder ships yet. **See [../ASSET-MANIFEST.md](../ASSET-MANIFEST.md)**
for the full spec: every asset, its exact filename, format, dimensions, the
icon-definition row, and whether it's confirmed-makeable or needs the in-game
feasibility test.

Quick summary:
- **Makeable now (raw PNG):** Bharat civ symbol, building icons (Yojana Bhavan,
  Vaidyashala, quarter) — these use `fs://game/` references.
- **Needs a feasibility test first:** leader portrait, unit flag, loading
  backgrounds — the base game ships these as compiled `blp:` archives (no
  modder tool); referencing our own `fs://` PNG is the presumed workaround,
  unconfirmed until tested in game.
- **Not achievable:** a custom animated 3D diplomacy leader (engine limit).

Style rules (also in STYLE-CANON / DESIGN.md):
- Original artwork only — never reproduce period photographs.
- Netaji: INA uniform + peaked cap or sherwani; round spectacles. Iconography
  limited to the INA Springing Tiger and the Azad Hind tricolour. No Axis imagery.
- Civ symbol: clean monochrome silhouette, Civ VII style.
