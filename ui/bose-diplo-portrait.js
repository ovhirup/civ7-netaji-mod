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

console.warn("[BoseMod] bose-diplo-portrait.js v2 loaded (game scope)");

const BOSE = "LEADER_SUBHAS_CHANDRA_BOSE";
const FALLBACK_ASSET = "LEADER_FALLBACK_GAME_ASSET";
const PORTRAIT_URL = "fs://game/diplo_bose.png";
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
		if (side === "left") {
			el.style.left = "3vw";
		} else {
			el.style.right = "3vw";
		}
		el.style.width = "34vw";
		el.style.height = "92vh";
		el.style.pointerEvents = "none";
		el.style.backgroundImage = "url('" + PORTRAIT_URL + "')";
		el.style.backgroundRepeat = "no-repeat";
		el.style.backgroundSize = "contain";
		el.style.backgroundPosition = "bottom center";
		// First body child: above the engine-composited 3D, below UI panels.
		document.body.insertBefore(el, document.body.firstChild);
		console.warn("[BoseMod] portrait overlay shown (" + side + ")");
	} catch (e) {
		console.error("[BoseMod] showOverlay(" + side + ") failed: " + e);
	}
}

// wrap(obj, name, {before, after}) — before runs pre-original (may set the
// suppression flag), after runs post-original; flag always reset in finally.
function wrap(obj, name, hooks) {
	const orig = obj[name];
	if (typeof orig !== "function") {
		console.warn("[BoseMod] method not found to wrap: " + name);
		return;
	}
	obj[name] = function (...args) {
		try {
			if (hooks.before) {
				hooks.before(...args);
			}
			const result = orig.apply(this, args);
			if (hooks.after) {
				hooks.after(...args);
			}
			return result;
		} catch (e) {
			console.error("[BoseMod] wrapped " + name + " threw: " + e);
			return orig.apply(this, args);
		} finally {
			suppressFallback = false;
		}
	};
}

try {
	const proto = Object.getPrototypeOf(LeaderModelManager);

	// Intercept the model group's addModel: only while a static Bose show-call
	// is in flight, and only for the fallback asset. Engine host object —
	// property assignment may not stick; verify and beacon either way.
	try {
		const grp = LeaderModelManager.leaderModelGroup;
		if (grp && typeof grp.addModel === "function") {
			const origAdd = grp.addModel;
			grp.addModel = function (assetName, ...rest) {
				if (suppressFallback && assetName === FALLBACK_ASSET) {
					console.warn("[BoseMod] suppressed fallback 3D model");
					return null;
				}
				return origAdd.call(this, assetName, ...rest);
			};
			if (grp.addModel !== origAdd) {
				console.warn("[BoseMod] leaderModelGroup.addModel intercepted OK");
			} else {
				console.warn("[BoseMod] addModel interception did NOT stick (host object) — Franklin will be covered, not removed");
			}
		} else {
			console.warn("[BoseMod] leaderModelGroup.addModel not found — cover-only mode");
		}
	} catch (e) {
		console.error("[BoseMod] addModel interception failed: " + e + " — cover-only mode");
	}

	wrap(proto, "showLeftLeaderModel", {
		before: (playerID) => {
			suppressFallback = isBose(playerID);
		},
		after: (playerID) => {
			if (isBose(playerID)) {
				showOverlay("left");
			}
		},
	});
	wrap(proto, "showRightLeaderModel", {
		before: (playerID) => {
			suppressFallback = isBose(playerID);
		},
		after: (playerID) => {
			if (isBose(playerID)) {
				showOverlay("right");
			}
		},
	});
	wrap(proto, "showLeaderModels", {
		before: (p1, p2) => {
			suppressFallback = isBose(p1) || isBose(p2);
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
	// MEET/WAR advancement. Overlay only.
	wrap(proto, "showLeaderSequence", {
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

	console.warn("[BoseMod] leader-model-manager patched OK (v2)");
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
