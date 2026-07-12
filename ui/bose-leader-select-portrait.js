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

console.warn("[BoseMod] bose-leader-select-portrait.js v3 loaded (shell scope)");

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
		el.style.width = "46vw";
		el.style.height = "100vh";
		el.style.pointerEvents = "none";
		// Opaque-ish backdrop masks any stale 3D model behind the portrait.
		el.style.background = "linear-gradient(to left, rgba(9,11,15,0.96) 62%, rgba(9,11,15,0) 100%)";
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
