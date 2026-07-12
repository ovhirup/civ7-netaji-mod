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

const PORTRAIT_URL = "fs://game/diplo_bose.png";
const LSL_URL = "fs://game/lsl_subhas_chandra_bose.png";
const OVERLAY_ID = "bose-leader-select-portrait";

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
	tryPlay("fs://game/bose_vo_test.webm", "vorbis", () => {
		tryPlay("fs://game/bose_vo_test_opus.webm", "opus", null);
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
		// Fully-opaque core masks any stale/lingering 3D model behind the
		// portrait (the engine keeps the previous leader's model on stage
		// when an asset is missing); only the left edge feathers out.
		el.style.background = "linear-gradient(to left, rgb(9,11,15) 78%, rgba(9,11,15,0) 100%)";
		const img = document.createElement("div");
		img.style.position = "absolute";
		img.style.bottom = "0";
		img.style.right = "6vw";
		img.style.width = "34vw";
		img.style.height = "88vh";
		img.style.backgroundImage = "url('" + PORTRAIT_URL + "')";
		img.style.backgroundRepeat = "no-repeat";
		img.style.backgroundSize = "contain";
		img.style.backgroundPosition = "bottom center";
		el.appendChild(img);
		document.body.insertBefore(el, document.body.firstChild);
		console.warn("[BoseMod] leader-select portrait overlay shown (ui-next)");
		probeVoiceOver();
	} catch (e) {
		console.error("[BoseMod] leader-select showOverlay failed: " + e);
	}
}

// --- 1. CSS remap: any element styled with the canonical lsl still ---------
// (Overview LEADER card and any other blp:lsl_subhas_chandra_bose consumer.)
try {
	const style = document.createElement("style");
	style.textContent =
		"[style*='lsl_subhas_chandra_bose'] { background-image: url('" + LSL_URL + "') !important; }";
	document.head.appendChild(style);
	console.warn("[BoseMod] lsl CSS remap installed");
} catch (e) {
	console.error("[BoseMod] lsl CSS remap failed: " + e);
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
