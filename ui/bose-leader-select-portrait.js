/**
 * [BoseMod] bose-leader-select-portrait.js — shell scope <UIScripts>
 *
 * Leader-select (game setup): suppress the dark fallback figure and show
 * Netaji's painted portrait for LEADER_SUBHAS_CHANDRA_BOSE.
 *
 * v2 (after first shell test): v1 "patched OK" but never matched — either the
 * create-game flow passes a different leaderId format or a different call
 * path adds the model (pickLeader uses addModelAtPos, which the v1
 * instance-level addModel wrap never covered). Changes:
 * - Suppression moved to the getFallbackAssetName PROTOTYPE seam (covers
 *   every add path: addModel and addModelAtPos, survives group recreation).
 * - Tolerant leader matching: any id containing SUBHAS.
 * - Diagnostic beacon logs EVERY showLeaderModels(leaderId) call so UI.log
 *   reveals the actual id format used by the create-game flow.
 */
import LeaderSelectModelManager from '/core/ui/shell/leader-select/leader-select-model-manager.js';

console.warn("[BoseMod] bose-leader-select-portrait.js v2 loaded (shell scope)");

const PORTRAIT_URL = "fs://game/diplo_bose.png";
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
		removeOverlay();
		const el = document.createElement("div");
		el.id = OVERLAY_ID;
		el.style.position = "fixed";
		el.style.bottom = "0";
		el.style.right = "8vw";
		el.style.width = "34vw";
		el.style.height = "90vh";
		el.style.pointerEvents = "none";
		el.style.backgroundImage = "url('" + PORTRAIT_URL + "')";
		el.style.backgroundRepeat = "no-repeat";
		el.style.backgroundSize = "contain";
		el.style.backgroundPosition = "bottom center";
		document.body.insertBefore(el, document.body.firstChild);
		console.warn("[BoseMod] leader-select portrait overlay shown");
	} catch (e) {
		console.error("[BoseMod] leader-select showOverlay failed: " + e);
	}
}

try {
	const proto = Object.getPrototypeOf(LeaderSelectModelManager);

	// Suppression seam: covers addModel AND addModelAtPos fallback sites.
	const origGetFallback = proto.getFallbackAssetName;
	if (typeof origGetFallback === "function") {
		proto.getFallbackAssetName = function (...args) {
			if (suppressFallback) {
				console.warn("[BoseMod] leader-select: suppressed fallback model (asset-name seam)");
				return "BOSE_SUPPRESSED_NO_ASSET";
			}
			return origGetFallback.apply(this, args);
		};
		console.warn("[BoseMod] leader-select getFallbackAssetName wrapped OK");
	} else {
		console.warn("[BoseMod] leader-select: getFallbackAssetName not found");
	}

	const origShow = proto.showLeaderModels;
	if (typeof origShow === "function") {
		proto.showLeaderModels = function (leaderId, ...rest) {
			currentIsBose = isBoseId(leaderId);
			suppressFallback = currentIsBose;
			console.warn("[BoseMod] leader-select showLeaderModels('" + leaderId + "') bose=" + currentIsBose);
			try {
				const result = origShow.call(this, leaderId, ...rest);
				if (currentIsBose) {
					showOverlay();
				} else {
					removeOverlay();
				}
				return result;
			} catch (e) {
				console.error("[BoseMod] leader-select showLeaderModels threw: " + e);
				return origShow.call(this, leaderId, ...rest);
			} finally {
				suppressFallback = false;
			}
		};
	} else {
		console.warn("[BoseMod] leader-select: showLeaderModels not found");
	}

	const origClear = proto.clearLeaderModels;
	if (typeof origClear === "function") {
		proto.clearLeaderModels = function (...args) {
			const result = origClear.apply(this, args);
			currentIsBose = false;
			removeOverlay();
			return result;
		};
	}

	// pickLeader (selected-leader zoom): keep the overlay when Bose is picked;
	// suppress its fallback re-add too (addModelAtPos path — now covered by
	// the asset-name seam).
	const origPick = proto.pickLeader;
	if (typeof origPick === "function") {
		proto.pickLeader = function (...args) {
			suppressFallback = currentIsBose;
			console.warn("[BoseMod] leader-select pickLeader bose=" + currentIsBose);
			try {
				const result = origPick.apply(this, args);
				if (currentIsBose) {
					showOverlay();
				}
				return result;
			} finally {
				suppressFallback = false;
			}
		};
	}

	console.warn("[BoseMod] leader-select-model-manager patched OK (v2)");
} catch (e) {
	console.error("[BoseMod] failed to patch leader-select-model-manager: " + e);
}
