# Audio plan — "goosebumps" Netaji voice + theme (SuperGrok research, 2026-07-12)

Research verdicts (user-run SuperGrok DeepSearch), banked for execution.

## Pipeline (decided)

- **Voice — PRIMARY: ElevenLabs Voice Design** (Starter tier). Description-based
  voice (no cloning of a real sample) = safest ToS for a deceased historical
  figure + strongest dramatic/oratorical delivery. Fallback: Google Gemini-TTS
  (excellent native Hindi, expressive style prompts, permissive commercial terms).
- **Music — PRIMARY: Suno v4+/Udio** paid tier (commercial rights): original
  orchestral march *in the spirit of* Kadam Kadam Badhaye Ja. Fallback: Stable
  Audio. **The real songs are OFF LIMITS**: "Kadam Kadam Badhaye Ja" and "Subh
  Sukh Chain" are copyrighted (composer Ram Singh Thakuri d. 2002; life+60 —
  into the 2060s).
- **Archival Bose recordings** (AIR/Prasar Bharati, 1943 Azad Hind speeches):
  authentic and the highest-goosebumps ceiling, but require Prasar Bharati
  rate-card licensing (vintage premium, fees even non-commercial) — GREY for a
  free worldwide Steam mod without written approval. Parked unless the user
  pursues the license.

## Delivery direction (paste into the voice tool)

Base voice description:
> "Commanding 1940s Bengali/Hindustani orator, fiery passionate independence
> speech, intense building emotion, rising fervor, slight authoritative radio
> texture optional, clear powerful enunciation, Hindustani-accented
> English/Hindi mix, dignified rousing tone only."

Per line:
- **"Give me blood, and I shall give you freedom!"** — defiant rallying cry,
  emphatic build on *sacrifice* and *freedom*.
- **"Dilli Chalo!"** — urgent inspiring call-to-action, marching resolve.
- **"Jai Hind!"** — proud triumphant salute, explosive energy.

Music prompt:
> "Stirring 1940s INA-style orchestral instrumental march, patriotic heroic
> theme in spirit of Kadam Kadam Badhaye Ja, brass/drums/strings, determined
> uplifting build, 60s seamless loop, period-appropriate, no vocals."

Deliver as WAV masters (48 kHz/24-bit ideal); Code side converts to Vorbis.

## Red flags (canon — enforce at ship time)

1. NO archival Bose audio without a Prasar Bharati license (copyright claim →
   Steam takedown).
2. NO cloning of the real voice without rights (ToS/deepfake exposure).
3. NO output that is disrespectful, caricatured, or Axis-framed.
4. Music must be original "in spirit" — never interpolate the copyrighted songs.
5. NEVER claim synthetic audio is Bose's real/authentic voice — label it as a
   tribute rendition in the mod description.

## Technical delivery (Code side)

Engine truth: `<audio>` does not exist in cohtml; `Audio.playSound` = Wwise
event names only (mods can't add Wwise banks). The ONE candidate path was
Vorbis/Opus audio muxed into a WebM played via an HTML `<video>` element.

**VERDICT (2026-07-12): in-game WebM audio is DEAD.** Tested both codecs with
real ElevenLabs VO muxed in. UI.log reports `VO probe PLAYING (vorbis)` AND
`VO probe PLAYING (opus)` — the `<video>` element demuxes and decodes the
audio track and fires the `playing` event — but produces NO audible sound.
The cohtml video pipeline renders frames but never wires the audio callback to
an output sink, and mods cannot add Wwise banks. This is a hard engine limit,
not a mod bug. The probe is disabled (bose-leader-select-portrait.js).

**Shipping decision:** the ElevenLabs VO (3 takes) + "The Dawn March" (15s cue)
+ "The Dawn of Freedom" (2:45 theme) ship as **Workshop-page media** — an
embedded video/audio preview on the mod's Steam Workshop listing, credited as a
tribute rendition (never claimed as Bose's real voice). The muxed webms stay in
`audio/` in case a future engine patch exposes an audio sink. No in-game audio.
