/**
 * [BoseMod] bose-diplo-portrait.js — game scope <UIScripts>
 *
 * Shows Netaji's 2D painted portrait in the diplomacy scene instead of the
 * Benjamin Franklin FPO fallback model, for LEADER_SUBHAS_CHANDRA_BOSE only.
 *
 * How it works (grounded in base-standard/ui/diplomacy/leader-model-manager.js):
 * - The 3D leader is engine-composited BEHIND the transparent HTML UI; any
 *   opaque DOM pixel covers it. Leaders with no LEADER_<X>_GAME_ASSET fall
 *   back to LEADER_FALLBACK_GAME_ASSET (Franklin + FPO watermark) via a pure
 *   JS null-check — nothing data-side can change that.
 * - We do NOT suppress the fallback model (its animation triggers gate the
 *   MEET/WAR sequence advancement). We COVER it: an overlay div prepended as
 *   document.body's first child paints above the 3D scene but below every
 *   later-sibling UI panel/button.
 * - Patch surface: the LeaderModelManager singleton's prototype (the same
 *   cached module instance the game imports), wrapping the show/exit/clear
 *   methods. Pattern proven by installed Workshop mods (bz-map-trix etc.).
 *
 * Beacons use console.warn/error — console.log is NOT captured in UI.log.
 */
import LeaderModelManager from '/base-standard/ui/diplomacy/leader-model-manager.js';

console.warn("[BoseMod] bose-diplo-portrait.js loaded (game scope)");

const BOSE = "LEADER_SUBHAS_CHANDRA_BOSE";
const PORTRAIT_URL = "fs://game/diplo_bose.png";
const IDS = { left: "bose-portrait-left", right: "bose-portrait-right" };

function isBose(playerID) {
	try {
		if (playerID == null || playerID < 0) {
			return false;
		}
		const player = Players.get(playerID);
		if (!player) {
			return false;
		}
		const row = GameInfo.Leaders.lookup(player.leaderType);
		return !!row && row.LeaderType === BOSE;
	} catch (e) {
		console.error("[BoseMod] isBose(" + playerID + ") failed: " + e);
		return false;
	}
}

function removeOverlay(side) {
	const el = document.getElementById(IDS[side]);
	if (el && el.parentNode) {
		el.parentNode.removeChild(el);
	}
}

function removeAllOverlays() {
	removeOverlay("left");
	removeOverlay("right");
}

function showOverlay(side) {
	try {
		removeOverlay(side);
		const el = document.createElement("div");
		el.id = IDS[side];
		el.style.position = "fixed";
		el.style.bottom = "0";
		if (side === "left") {
			el.style.left = "1vw";
		} else {
			el.style.right = "1vw";
		}
		el.style.width = "30vw";
		el.style.height = "82vh";
		el.style.pointerEvents = "none";
		el.style.backgroundImage = "url('" + PORTRAIT_URL + "')";
		el.style.backgroundRepeat = "no-repeat";
		el.style.backgroundSize = "contain";
		el.style.backgroundPosition = "bottom center";
		// First body child => painted below all later UI siblings (panels,
		// buttons) but above the engine-composited 3D scene.
		document.body.insertBefore(el, document.body.firstChild);
		console.warn("[BoseMod] portrait overlay shown (" + side + ")");
	} catch (e) {
		console.error("[BoseMod] showOverlay(" + side + ") failed: " + e);
	}
}

function wrap(obj, name, after) {
	const orig = obj[name];
	if (typeof orig !== "function") {
		console.warn("[BoseMod] method not found to wrap: " + name + " (game patch changed it?)");
		return;
	}
	obj[name] = function (...args) {
		const result = orig.apply(this, args);
		try {
			after(...args);
		} catch (e) {
			console.error("[BoseMod] hook for " + name + " failed: " + e);
		}
		return result;
	};
}

try {
	// The default export is the singleton instance; its methods live on the
	// class prototype. (show* internally call clear() first, so our clear-hook
	// removes overlays, then the show-hook re-adds for the new leader pair.)
	const proto = Object.getPrototypeOf(LeaderModelManager);

	wrap(proto, "showLeftLeaderModel", (playerID) => {
		if (isBose(playerID)) {
			showOverlay("left");
		}
	});
	wrap(proto, "showRightLeaderModel", (playerID) => {
		if (isBose(playerID)) {
			showOverlay("right");
		}
	});
	wrap(proto, "showLeaderModels", (player1, player2) => {
		if (isBose(player1)) {
			showOverlay("left");
		}
		if (isBose(player2)) {
			showOverlay("right");
		}
	});
	wrap(proto, "showLeaderSequence", (params) => {
		if (params && isBose(params.player1)) {
			showOverlay("left");
		}
		if (params && isBose(params.player2)) {
			showOverlay("right");
		}
	});
	wrap(proto, "exitLeaderScene", () => {
		removeAllOverlays();
	});
	wrap(proto, "clear", () => {
		removeAllOverlays();
	});

	console.warn("[BoseMod] leader-model-manager patched OK");
} catch (e) {
	console.error("[BoseMod] failed to patch leader-model-manager: " + e);
}
