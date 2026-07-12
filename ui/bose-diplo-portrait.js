/**
 * [BoseMod] bose-diplo-portrait.js — game scope <UIScripts>
 *
 * Replaces the Benjamin Franklin FPO fallback with Netaji's 2D painted
 * portrait in the in-game diplomacy scene, for LEADER_SUBHAS_CHANDRA_BOSE.
 *
 * v2 (after first in-game test):
 * - STATIC contexts (own-leader panel, other-leader panel, hub pair view):
 *   the fallback 3D model is now SUPPRESSED entirely (no Franklin peeking
 *   over the portrait, no idle animation, no Franklin audio). Mechanism: the
 *   show methods only add "LEADER_FALLBACK_GAME_ASSET" after the real leader
 *   asset returns null, so we intercept leaderModelGroup.addModel and return
 *   null for the fallback while a Bose show-call is in flight. Static paths
 *   are null-safe (playLeaderAnimation and trigger handling bail on null).
 * - SEQUENCE contexts (first meet / declare war / peace): the fallback model
 *   is KEPT (its animation triggers gate sequence advancement) and only
 *   covered by the overlay.
 * - The portrait PNG now has a baked feathered-alpha edge, so it blends into
 *   the scene instead of floating as a hard rectangle.
 *
 * Beacons use console.warn/error — console.log is NOT captured in UI.log.
 */
import LeaderModelManager from '/base-standard/ui/diplomacy/leader-model-manager.js';
import { Icon } from '/core/ui/utilities/utilities-image.js';

console.warn("[BoseMod] bose-diplo-portrait.js v4 loaded (game scope)");

const BOSE = "LEADER_SUBHAS_CHANDRA_BOSE";
const FALLBACK_ASSET = "LEADER_FALLBACK_GAME_ASSET";
// Directional variants: each is FLUSH against its screen edge and bottom
// (opaque there) with a wide feather on the inward edge + top, so the portrait
// melts into the 3D scene instead of floating as a soft-cornered poster.
const PORTRAIT_URLS = {
	left: "fs://game/diplo_bose_left.png",
	right: "fs://game/diplo_bose_right.png",
};
const IDS = { left: "bose-portrait-left", right: "bose-portrait-right" };

// While true, addModel calls for the fallback asset return null (static
// contexts only — never set during showLeaderSequence).
let suppressFallback = false;

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
		el.style.top = "0";
		if (side === "left") {
			el.style.left = "0";
			el.style.backgroundPosition = "left bottom";
		} else {
			el.style.right = "0";
			el.style.backgroundPosition = "right bottom";
		}
		el.style.width = "40vw";
		el.style.pointerEvents = "none";
		el.style.backgroundImage = "url('" + PORTRAIT_URLS[side] + "')";
		el.style.backgroundRepeat = "no-repeat";
		el.style.backgroundSize = "auto 100vh";
		// First body child: above the engine-composited 3D, below UI panels.
		document.body.insertBefore(el, document.body.firstChild);
		console.warn("[BoseMod] portrait overlay shown (" + side + ")");
	} catch (e) {
		console.error("[BoseMod] showOverlay(" + side + ") failed: " + e);
	}
}

// wrap(obj, name, {before, after, managesSuppression}) — before runs
// pre-original (may set the suppression flag), after runs post-original.
// v4 BUGFIX: ONLY methods that SET the flag reset it (managesSuppression) —
// v3 reset it in a universal finally, and since show* internally call the
// (also-wrapped) clear(), the nested clear reset the flag BEFORE the
// fallback-add ran. That is why Franklin survived v3.
function wrap(obj, name, hooks) {
	const orig = obj[name];
	if (typeof orig !== "function") {
		console.warn("[BoseMod] method not found to wrap: " + name);
		return;
	}
	obj[name] = function (...args) {
		if (hooks.before) {
			try {
				hooks.before(...args);
			} catch (e) {
				console.error("[BoseMod] before-hook " + name + " failed: " + e);
			}
		}
		let result;
		try {
			result = orig.apply(this, args);
		} finally {
			if (hooks.managesSuppression) {
				suppressFallback = false;
			}
		}
		if (hooks.after) {
			try {
				hooks.after(...args);
			} catch (e) {
				console.error("[BoseMod] after-hook " + name + " failed: " + e);
			}
		}
		return result;
	};
}

try {
	const proto = Object.getPrototypeOf(LeaderModelManager);

	// PRIMARY suppression seam (v3): getFallbackAssetName is a plain class
	// method called at every fallback-add site (this.leaderModelGroup.addModel(
	// this.getFallbackAssetName(), ...)). While a static Bose show-call is in
	// flight, return a nonexistent asset name — addModel then returns null and
	// the null-safe static paths simply show nothing. Unlike patching the
	// model-group instance (v2 — "intercepted OK" but never fired; the group
	// object appears to be recreated/replaced between scenes), a prototype
	// method wrap survives everything.
	const origGetFallback = proto.getFallbackAssetName;
	if (typeof origGetFallback === "function") {
		proto.getFallbackAssetName = function (...args) {
			if (suppressFallback) {
				console.warn("[BoseMod] suppressed fallback 3D model (asset-name seam)");
				return "BOSE_SUPPRESSED_NO_ASSET";
			}
			return origGetFallback.apply(this, args);
		};
		console.warn("[BoseMod] getFallbackAssetName wrapped OK");
	} else {
		console.warn("[BoseMod] getFallbackAssetName not found — cover-only mode");
	}

	wrap(proto, "showLeftLeaderModel", {
		managesSuppression: true,
		before: (playerID) => {
			suppressFallback = isBose(playerID);
			console.warn("[BoseMod] showLeftLeaderModel(" + playerID + ") bose=" + suppressFallback);
		},
		after: (playerID) => {
			if (isBose(playerID)) {
				showOverlay("left");
			}
		},
	});
	wrap(proto, "showRightLeaderModel", {
		managesSuppression: true,
		before: (playerID) => {
			suppressFallback = isBose(playerID);
			console.warn("[BoseMod] showRightLeaderModel(" + playerID + ") bose=" + suppressFallback);
		},
		after: (playerID) => {
			if (isBose(playerID)) {
				showOverlay("right");
			}
		},
	});
	wrap(proto, "showLeaderModels", {
		managesSuppression: true,
		before: (p1, p2) => {
			suppressFallback = isBose(p1) || isBose(p2);
			console.warn("[BoseMod] showLeaderModels(" + p1 + "," + p2 + ") bose=" + suppressFallback);
		},
		after: (p1, p2) => {
			if (isBose(p1)) {
				showOverlay("left");
			}
			if (isBose(p2)) {
				showOverlay("right");
			}
		},
	});
	// Sequences: NO suppression — the fallback's animation triggers gate
	// MEET/WAR advancement. Overlay only. (Diagnostic beacon logs the path.)
	wrap(proto, "showLeaderSequence", {
		before: (params) => {
			console.warn("[BoseMod] showLeaderSequence p1=" + (params && params.player1) + " p2=" + (params && params.player2));
		},
		after: (params) => {
			if (params && isBose(params.player1)) {
				showOverlay("left");
			}
			if (params && isBose(params.player2)) {
				showOverlay("right");
			}
		},
	});
	wrap(proto, "exitLeaderScene", {
		after: () => removeAllOverlays(),
	});
	wrap(proto, "clear", {
		after: () => removeAllOverlays(),
	});

	console.warn("[BoseMod] leader-model-manager patched OK (v4)");
} catch (e) {
	console.error("[BoseMod] failed to patch leader-model-manager: " + e);
}

// --- Fix the .png.png leader-portrait bug for our leader -------------------
// Icon.getLeaderPortraitIcon appends ".png" to the icon-def Path; ours already
// ends in .png (required by the fxs-icon consumers, which work), so the
// declare-war popup / call-to-arms / diplomacy header requested
// lp_hex_bose_256.png.png and fell back to the unknown-leader portrait.
try {
	const origGetLeaderPortraitIcon = Icon.getLeaderPortraitIcon;
	Icon.getLeaderPortraitIcon = function (leaderType, size, relationship) {
		try {
			const leader = GameInfo.Leaders.lookup(leaderType);
			if (leader && leader.LeaderType === BOSE) {
				return "fs://game/lp_hex_bose_256.png";
			}
		} catch (e) {
			console.error("[BoseMod] getLeaderPortraitIcon hook failed: " + e);
		}
		return origGetLeaderPortraitIcon.call(this, leaderType, size, relationship);
	};
	console.warn("[BoseMod] Icon.getLeaderPortraitIcon patched OK");
} catch (e) {
	console.error("[BoseMod] failed to patch Icon.getLeaderPortraitIcon: " + e);
}
