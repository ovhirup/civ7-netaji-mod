/**
 * [BoseMod] bose-leader-select-portrait.js — shell scope <UIScripts>
 *
 * v3 — after UI.log proved the create-game flow NEVER calls
 * LeaderSelectModelManager (zero diagnostic hits while browsing leaders):
 * the create-game screens are the ui-next stack (SolidJS-style).
 * - core/ui-next/screens/create-game/leader-select-screen.js renders the 3D
 *   via Model3d components bound to leaders[].model = `${leaderID}_GAME_ASSET`
 *   (leader-select-model.js:136). Bose's asset doesn't exist, so the engine
 *   keeps whatever model was last shown (the stale-previous-leader bug) or
 *   the initial cloaked LEADER_RANDOMIZED figure.
 * - LeaderSelectModel is ModelRegistry-registered with .get() ->
 *   .selectedLeader() — our script reads the SAME registry and drives a
 *   portrait overlay (with an opaque backdrop to mask any stale model) from
 *   a light poll. No reactive plumbing required.
 * - create-game-hub.js builds the Overview LEADER card as inline style
 *   url('blp:lsl_subhas_chandra_bose.png') — blp: misses do NOT fall through
 *   to loose fs files (proven in UI.log), so a CSS attribute-substring rule
 *   with !important redirects any lsl_subhas_chandra_bose consumer to our
 *   imported PNG.
 * - Icon.getLeaderPortraitIcon gets the same .png.png fix as game scope.
 * The old LeaderSelectModelManager patches are kept (harmless; that manager
 * may serve other shell flows).
 */
import LeaderSelectModelManager from '/core/ui/shell/leader-select/leader-select-model-manager.js';
import { LeaderSelectModel } from '/core/ui-next/screens/create-game/leader-select-model.js';
import { Icon } from '/core/ui/utilities/utilities-image.js';

console.warn("[BoseMod] bose-leader-select-portrait.js v4 loaded (shell scope)");

// --- 0. Stop the previous leader's mesh + AUDIO persisting behind Netaji -----
// scene-3d.js Model3d creates ONE model object per slot on mount, then only
// calls model.setAssetName(name) on leader change. For Bose the asset doesn't
// exist, so the swap silently no-ops and the PREVIOUS leader's mesh keeps
// animating + playing VO (the "sound running behind" bug). Fix at the factory:
// wrap WorldUI.createModelGroup so every group's addModel returns a model whose
// setAssetName, when handed a Bose/missing asset, swaps to the character-less
// lighting asset (clears mesh + silences VO) and hides it. Factory-wrap
// survives the group recreation that defeated the earlier instance patch.
const LIGHTING_ASSET = "LEADER_LIGHTING_SCENE_CHAR_SELECT_GAME_ASSET";
function isBoseAsset(name) {
	return typeof name === "string" && name.toUpperCase().indexOf("SUBHAS") >= 0;
}
try {
	if (typeof WorldUI === "object" && WorldUI && typeof WorldUI.createModelGroup === "function" && !WorldUI.__boseWrapped) {
		const origCreate = WorldUI.createModelGroup;
		WorldUI.createModelGroup = function (name) {
			const grp = origCreate.call(this, name);
			try {
				if (grp && typeof grp.addModel === "function") {
					const origAdd = grp.addModel;
					grp.addModel = function (assetName, ...rest) {
						const bose = isBoseAsset(assetName);
						const model = origAdd.call(this, bose ? LIGHTING_ASSET : assetName, ...rest);
						if (model && typeof model.setAssetName === "function" && !model.__boseWrapped) {
							const origSet = model.setAssetName.bind(model);
							model.setAssetName = function (newName) {
								if (isBoseAsset(newName)) {
									console.warn("[BoseMod] neutralized leader model for Bose (mesh+VO)");
									try { model.setAlpha && model.setAlpha(0); } catch (e) { /* host */ }
									return origSet(LIGHTING_ASSET);
								}
								try { model.setAlpha && model.setAlpha(1); } catch (e) { /* host */ }
								return origSet(newName);
							};
							model.__boseWrapped = true;
						}
						return model;
					};
				}
			} catch (e) {
				console.error("[BoseMod] model-group wrap failed: " + e);
			}
			return grp;
		};
		WorldUI.__boseWrapped = true;
		console.warn("[BoseMod] WorldUI.createModelGroup wrapped OK");
	} else {
		console.warn("[BoseMod] WorldUI.createModelGroup not wrappable (already wrapped or absent)");
	}
} catch (e) {
	console.error("[BoseMod] WorldUI wrap failed: " + e);
}

const PORTRAIT_URL = "fs://game/diplo_bose_right.png"; // flush right edge, feathered left+top
const LSL_URL = "fs://game/lsl_subhas_chandra_bose.png";
const OVERLAY_ID = "bose-leader-select-portrait";

// --- 0.5 Engine icon seams (recon-proven) -----------------------------------
// The ui-next leader GRID TILE (leader-select-button.js LeaderPortrait) gets
// its image from UI.getIconCSS(leaderID, "PORTRAIT_MASK") — NOT from
// Icon.getLeaderPortraitIcon and NOT from an lsl_ inline style. Our icon-DB
// PORTRAIT_MASK row was being outranked by the default (hex) row, so the tile
// showed the full-bleed hex. Wrap the engine call: Bose + circle contexts get
// the padded circle (base tiles have inner margin; full-bleed reads oversized).
// The Overview CIVILIZATION card's rich art layer is UI.getIconBLP(civID,
// "BACKGROUND_VERT") — base civs have CG_<name>_VERT art, Bharat had none
// (hence the bare rectangle). Point it at our Lion Capital vertical art.
try {
	if (typeof UI === "object" && UI) {
		if (typeof UI.getIconCSS === "function" && !UI.__boseIconCssWrapped) {
			const origGetIconCSS = UI.getIconCSS.bind(UI);
			UI.getIconCSS = function (name, context, ...rest) {
				try {
					if (typeof name === "string" && name.toUpperCase().indexOf("SUBHAS") >= 0) {
						if (context === "PORTRAIT_MASK") {
							return "url('fs://game/lp_circ_bose_grid.png')";
						}
						if (context === "CIRCLE_MASK") {
							return "url('fs://game/lp_circ_bose_256.png')";
						}
					}
				} catch (e) { /* fall through */ }
				return origGetIconCSS(name, context, ...rest);
			};
			UI.__boseIconCssWrapped = true;
			console.warn("[BoseMod] UI.getIconCSS wrapped OK (grid tile seam)");
		}
		if (typeof UI.getIconBLP === "function" && !UI.__boseIconBlpWrapped) {
			const origGetIconBLP = UI.getIconBLP.bind(UI);
			UI.getIconBLP = function (name, context, ...rest) {
				try {
					if (typeof name === "string" && name.toUpperCase().indexOf("BHARAT") >= 0) {
						if (context === "BACKGROUND_VERT") {
							return "fs://game/cg_bharat_vert.png";
						}
						// Civ-select card art (base civs use their lsbg here).
						if (context === "BACKGROUND") {
							return "fs://game/lsbg_bharat_1080.png";
						}
					}
				} catch (e) { /* fall through */ }
				return origGetIconBLP(name, context, ...rest);
			};
			UI.__boseIconBlpWrapped = true;
			console.warn("[BoseMod] UI.getIconBLP wrapped OK (civ card seam)");
		}
	} else {
		console.warn("[BoseMod] UI global not available for icon seams");
	}
} catch (e) {
	console.error("[BoseMod] icon seam wrap failed: " + e);
}

// --- 0.6 Legend-Path level so the grid tile gets its XP ring + number badge --
// leader-select-button.js only renders the LeaderXpRing (the ring around the
// portrait + the level number bubble) when leaderInfo.level > 0. That level =
// legendData.currentLevel, where legendData comes from
// Online.Metaprogression.getLegendPathsData() keyed by LEGEND_PATH_<leader>.
// Mod leaders have NO online Legend-Path entry (same profile wall as mementos)
// -> level 0 -> no ring, no badge -> the tile looks/behaves unlike every base
// leader. Inject a level-1 Legend-Path row for Bose so his tile renders the
// identical ring + "1" badge that unplayed base leaders show. Purely cosmetic
// (client-side); does not touch the real online profile.
try {
	if (typeof Online === "object" && Online && Online.Metaprogression &&
		typeof Online.Metaprogression.getLegendPathsData === "function" &&
		!Online.Metaprogression.__boseLegendWrapped) {
		const origGetLegend = Online.Metaprogression.getLegendPathsData.bind(Online.Metaprogression);
		const BOSE_PATH = "LEGEND_PATH_SUBHAS_CHANDRA_BOSE";
		Online.Metaprogression.getLegendPathsData = function (...args) {
			let data;
			try {
				data = origGetLegend(...args);
			} catch (e) {
				data = [];
			}
			try {
				if (Array.isArray(data) && !data.some((d) => d && d.legendPathName === BOSE_PATH)) {
					data = data.concat([{
						legendPathName: BOSE_PATH,
						currentLevel: 1,
						currentXp: 0,
						prevLevelXp: 0,
						nextLevelXp: 100,
						rewards: [],
					}]);
				}
			} catch (e) {
				console.error("[BoseMod] legend inject failed: " + e);
			}
			return data;
		};
		Online.Metaprogression.__boseLegendWrapped = true;
		console.warn("[BoseMod] getLegendPathsData wrapped (level-1 XP ring + badge for Bose)");
	} else {
		console.warn("[BoseMod] Online.Metaprogression.getLegendPathsData not wrappable");
	}
} catch (e) {
	console.error("[BoseMod] Online.Metaprogression wrap failed: " + e);
}

let suppressFallback = false;
let currentIsBose = false;

function isBoseId(leaderId) {
	return String(leaderId).toUpperCase().indexOf("SUBHAS") >= 0;
}

function removeOverlay() {
	const el = document.getElementById(OVERLAY_ID);
	if (el && el.parentNode) {
		el.parentNode.removeChild(el);
	}
}

// --- AUDIO LOOPHOLE PROBE (one-shot) ----------------------------------------
// <audio> doesn't exist in cohtml and Wwise is closed to mods; the ONE
// candidate path for custom audio is a Vorbis/Opus track muxed into a WebM
// played via <video> (the demuxer advertises support; whether the audio
// callback is wired is UNVERIFIED — this probe settles it). Plays the
// placeholder VO once on first Bose selection; tries vorbis, then opus.
// Swap in the real ElevenLabs line later — same filenames.
let voProbeDone = false;
function probeVoiceOver() {
	if (voProbeDone) {
		return;
	}
	voProbeDone = true;
	const tryPlay = (url, label, onFail) => {
		try {
			const v = document.createElement("video");
			v.style.position = "fixed";
			v.style.left = "-9999px";
			v.style.top = "0";
			v.style.width = "8px";
			v.style.height = "8px";
			v.src = url;
			v.volume = 0.7;
			v.addEventListener("error", () => {
				console.warn("[BoseMod] VO probe FAILED (" + label + "): media error");
				if (v.parentNode) { v.parentNode.removeChild(v); }
				if (onFail) { onFail(); }
			});
			v.addEventListener("playing", () => {
				console.warn("[BoseMod] VO probe PLAYING (" + label + ") — audio loophole " + label + " decode OK (listen for sound!)");
			});
			v.addEventListener("ended", () => {
				if (v.parentNode) { v.parentNode.removeChild(v); }
			});
			document.body.appendChild(v);
			const p = v.play();
			if (p && p.catch) {
				p.catch((e) => {
					console.warn("[BoseMod] VO probe play() rejected (" + label + "): " + e);
					if (onFail) { onFail(); }
				});
			}
		} catch (e) {
			console.error("[BoseMod] VO probe threw (" + label + "): " + e);
			if (onFail) { onFail(); }
		}
	};
	// Opus FIRST now: the vorbis probe reported PLAYING but produced no audible
	// sound (decode OK, audio callback likely unwired). Opus is the one codec
	// left to rule out before declaring in-game audio dead.
	tryPlay("fs://game/bose_vo_test_opus.webm", "opus", () => {
		tryPlay("fs://game/bose_vo_test.webm", "vorbis", null);
	});
}

function showOverlay() {
	try {
		if (document.getElementById(OVERLAY_ID)) {
			return; // already showing
		}
		const el = document.createElement("div");
		el.id = OVERLAY_ID;
		el.style.position = "fixed";
		el.style.bottom = "0";
		el.style.right = "0";
		el.style.width = "52vw";
		el.style.height = "100vh";
		el.style.pointerEvents = "none";
		// NO opaque backdrop. This overlay serves BOTH the leader-select screen
		// (dark scene behind) AND the create-game-hub / "Begin Game" screen
		// (bright Lion-Capital scene behind — recon: the big leader there is a
		// live WorldUI Model3d of ${leaderID}_GAME_ASSET, which is already
		// neutralized by our WorldUI.createModelGroup wrap, so there is no stale
		// 3D model to mask). An opaque dark panel was invisible on the dark
		// screen but showed as a hard-edged slab over the bright hub scene. With
		// no backdrop, the portrait PNG's baked left+top feather blends it into
		// whatever is behind — dark or bright.
		el.style.background = "transparent";
		// Flush to the screen's right edge; the PNG's baked left+top feather
		// does the blending (no gap, no floating-poster look).
		// Width is 69vh, NOT a vw value: the image renders 100vh tall at aspect
		// 700/1024 = 68.4vh wide. A vw-based width is narrower than that on
		// 16:10-ish screens (MacBook 1.54:1), so the element clipped the
		// portrait's left feather mid-ramp — the visible "hard seam" bug.
		const img = document.createElement("div");
		img.style.position = "absolute";
		img.style.bottom = "0";
		img.style.right = "0";
		img.style.width = "69vh";
		img.style.height = "100vh";
		img.style.backgroundImage = "url('" + PORTRAIT_URL + "')";
		img.style.backgroundRepeat = "no-repeat";
		img.style.backgroundSize = "auto 100vh";
		img.style.backgroundPosition = "bottom right";
		el.appendChild(img);
		document.body.insertBefore(el, document.body.firstChild);
		console.warn("[BoseMod] leader-select portrait overlay shown (ui-next)");
		// AUDIO LOOPHOLE = CONFIRMED DEAD (2026-07-12): both vorbis and opus
		// WebM tracks report the "playing" event in UI.log but produce NO
		// audible sound — the cohtml <video> demuxes/decodes audio but the
		// engine never wires the audio callback. Mods cannot add Wwise banks.
		// The probe is disabled; the ElevenLabs VO + march ship as Workshop
		// media instead. Leaving probeVoiceOver() defined but unwired in case a
		// future patch exposes an audio sink.
		// probeVoiceOver();
	} catch (e) {
		console.error("[BoseMod] leader-select showOverlay failed: " + e);
	}
}

// --- 1. CSS remaps: inline background-image is set WITHOUT !important, so a
// stylesheet rule with !important wins. Redirect every Bharat/Bose blp: art
// name the create-game screens build to our shipped PNGs:
//  - lsl_subhas_chandra_bose  : Overview LEADER card + load screen consumers
//  - bg-panel-bharat          : civ-SELECT card art (civ-card.js:159, hyphens,
//                               was a dead texture -> the "gloomy" dark card)
//  - bg_panel_bharat          : create-game-hub small civ card (underscores)
// All Bharat card slots now show the Lion-Capital/dam scene like base civs.
try {
	const CIV_BG = "fs://game/lsbg_bharat_1080.png";
	const style = document.createElement("style");
	style.textContent =
		"[style*='lsl_subhas_chandra_bose'] { background-image: url('" + LSL_URL + "') !important; }" +
		"[style*='bg-panel-bharat'] { background-image: url('" + CIV_BG + "') !important; background-size: cover !important; background-position: center !important; }" +
		"[style*='bg_panel_bharat'] { background-image: url('" + CIV_BG + "') !important; background-size: cover !important; background-position: center !important; }";
	document.head.appendChild(style);
	console.warn("[BoseMod] CSS remaps installed (lsl + civ-card bg)");
} catch (e) {
	console.error("[BoseMod] CSS remap failed: " + e);
}

// --- 2. ui-next leader-select: poll the shared model registry --------------
try {
	let lastState = false;
	let getFailedLogged = false;
	setInterval(() => {
		let bose = false;
		try {
			const model = LeaderSelectModel.get();
			const sel = model && typeof model.selectedLeader === "function" ? model.selectedLeader() : null;
			bose = !!(sel && isBoseId(sel.leaderID));
		} catch (e) {
			// Screen/model not active — treat as not-Bose.
			if (!getFailedLogged) {
				getFailedLogged = true;
				console.warn("[BoseMod] LeaderSelectModel.get() not ready yet (normal outside leader-select): " + e);
			}
			bose = false;
		}
		if (bose !== lastState) {
			lastState = bose;
			console.warn("[BoseMod] ui-next leader-select bose=" + bose);
			if (bose) {
				showOverlay();
			} else {
				removeOverlay();
			}
		}
	}, 350);
	console.warn("[BoseMod] ui-next leader-select poller installed");
} catch (e) {
	console.error("[BoseMod] ui-next poller failed: " + e);
}

// --- 3. Shell-side .png.png portrait fix ------------------------------------
try {
	const origGetLeaderPortraitIcon = Icon.getLeaderPortraitIcon;
	Icon.getLeaderPortraitIcon = function (leaderType, size, relationship) {
		try {
			const leader = GameInfo.Leaders.lookup(leaderType);
			if (leader && leader.LeaderType === "LEADER_SUBHAS_CHANDRA_BOSE") {
				return "fs://game/lp_hex_bose_256.png";
			}
		} catch (e) {
			// fall through to original
		}
		return origGetLeaderPortraitIcon.call(this, leaderType, size, relationship);
	};
	console.warn("[BoseMod] shell Icon.getLeaderPortraitIcon patched OK");
} catch (e) {
	console.error("[BoseMod] shell Icon patch failed: " + e);
}

// --- 4. Legacy manager patches (kept; may serve other shell flows) ---------
try {
	const proto = Object.getPrototypeOf(LeaderSelectModelManager);

	const origGetFallback = proto.getFallbackAssetName;
	if (typeof origGetFallback === "function") {
		proto.getFallbackAssetName = function (...args) {
			if (suppressFallback) {
				console.warn("[BoseMod] leader-select: suppressed fallback model (asset-name seam)");
				return "BOSE_SUPPRESSED_NO_ASSET";
			}
			return origGetFallback.apply(this, args);
		};
	}

	const origShow = proto.showLeaderModels;
	if (typeof origShow === "function") {
		proto.showLeaderModels = function (leaderId, ...rest) {
			currentIsBose = isBoseId(leaderId);
			suppressFallback = currentIsBose;
			console.warn("[BoseMod] legacy showLeaderModels('" + leaderId + "') bose=" + currentIsBose);
			try {
				const result = origShow.call(this, leaderId, ...rest);
				if (currentIsBose) {
					showOverlay();
				}
				return result;
			} finally {
				suppressFallback = false;
			}
		};
	}

	const origClear = proto.clearLeaderModels;
	if (typeof origClear === "function") {
		proto.clearLeaderModels = function (...args) {
			const result = origClear.apply(this, args);
			currentIsBose = false;
			return result;
		};
	}

	console.warn("[BoseMod] leader-select-model-manager patched OK (v3)");
} catch (e) {
	console.error("[BoseMod] failed to patch leader-select-model-manager: " + e);
}
