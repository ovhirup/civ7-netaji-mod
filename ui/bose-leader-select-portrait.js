/**
 * [BoseMod] bose-leader-select-portrait.js — shell scope <UIScripts>
 *
 * Leader-select (game setup): leaders without a real 3D asset render as the
 * dark fallback figure. For LEADER_SUBHAS_CHANDRA_BOSE, suppress that model
 * and show Netaji's painted portrait on the right side instead.
 *
 * Shell counterpart of ui/bose-diplo-portrait.js: the shell has its OWN
 * manager singleton, core/ui/shell/leader-select/leader-select-model-manager
 * (showLeaderModels(leaderId:string) / pickLeader() / clearLeaderModels()),
 * with the same addModel(assetName)->null-check->fallback pattern.
 * - showLeaderModels: suppress fallback + overlay (browse view; null-safe).
 * - pickLeader: NO suppression (the selected-sequence advances on animation
 *   triggers) — the overlay simply stays on top.
 * - LEADER_RANDOM_GAME_ASSET is never suppressed (Random's figure is correct).
 */
import LeaderSelectModelManager from '/core/ui/shell/leader-select/leader-select-model-manager.js';

console.warn("[BoseMod] bose-leader-select-portrait.js loaded (shell scope)");

const BOSE = "LEADER_SUBHAS_CHANDRA_BOSE";
const FALLBACK_ASSET = "LEADER_FALLBACK_GAME_ASSET";
const PORTRAIT_URL = "fs://game/diplo_bose.png";
const OVERLAY_ID = "bose-leader-select-portrait";

let suppressFallback = false;
let currentIsBose = false;

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

	try {
		const grp = LeaderSelectModelManager.leaderSelectModelGroup;
		if (grp && typeof grp.addModel === "function") {
			const origAdd = grp.addModel;
			grp.addModel = function (assetName, ...rest) {
				if (suppressFallback && assetName === FALLBACK_ASSET) {
					console.warn("[BoseMod] leader-select: suppressed fallback model");
					return null;
				}
				return origAdd.call(this, assetName, ...rest);
			};
		} else {
			console.warn("[BoseMod] leader-select: addModel not found — cover-only mode");
		}
	} catch (e) {
		console.error("[BoseMod] leader-select addModel interception failed: " + e);
	}

	const origShow = proto.showLeaderModels;
	if (typeof origShow === "function") {
		proto.showLeaderModels = function (leaderId, ...rest) {
			currentIsBose = ("" + leaderId) === BOSE;
			suppressFallback = currentIsBose;
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

	// pickLeader re-adds models for the selected-leader zoom sequence; keep
	// the overlay if Bose is the pick (no suppression — triggers gate it).
	const origPick = proto.pickLeader;
	if (typeof origPick === "function") {
		proto.pickLeader = function (...args) {
			const result = origPick.apply(this, args);
			if (currentIsBose) {
				showOverlay();
			}
			return result;
		};
	}

	console.warn("[BoseMod] leader-select-model-manager patched OK");
} catch (e) {
	console.error("[BoseMod] failed to patch leader-select-model-manager: " + e);
}
