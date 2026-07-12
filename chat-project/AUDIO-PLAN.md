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
event names only (mods can't add Wwise banks). The ONE candidate path is
Vorbis audio muxed into a WebM played via an HTML `<video>` element (the UI
demuxer advertises V_VP9 + Vorbis support; all shipped webms are silent, so
whether the audio callback is actually wired = 50/50 UNVERIFIED). The repo
ships a placeholder-VO test webm + playback probe in the leader-select UI
script; UI.log beacons report play/error. If the loophole fails, fallback is
video-with-sound in slots that support fxs-movie, or no in-game audio (art
assets only, audio shipped as a bonus track on the Workshop page).
