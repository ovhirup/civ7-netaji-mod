// Bose memento unlock patch
//
// WHY THIS EXISTS
// Custom mementos load and display via data alone, but Civ VII gates whether a
// memento can actually be *equipped* on Online.UserProfile.isRewardUnlocked(id).
// That reads the player's online-profile earned-rewards list, which mod data
// (XML) cannot write to. So our mementos show in the picker but the slot resets
// to empty on equip (see core/ui-next/screens/create-game/memento-select-model.js
// and core/ui/shell/create-panels/leader-select-model.js — the
// `if (!Online.UserProfile.isRewardUnlocked(name) || isLocked)` reset).
//
// This is a surgical monkeypatch: it wraps isRewardUnlocked so it returns true
// ONLY for this mod's memento IDs, and defers to the original implementation for
// everything else. It copies no Firaxis files, so it is as patch-resilient as a
// UI mod can be — but it IS the mod's only non-data component. If a future game
// update renames Online.UserProfile.isRewardUnlocked or moves the equip gate into
// native code, this patch may no-op and need revisiting (see CLAUDE.md).

const BOSE_MEMENTO_IDS = new Set([
	"MEMENTO_BOSE_SPRINGING_TIGER",
	"MEMENTO_BOSE_AZAD_HIND_RADIO",
]);

(function patchIsRewardUnlocked() {
	try {
		const profile = globalThis.Online?.UserProfile;
		if (!profile || typeof profile.isRewardUnlocked !== "function") {
			console.warn("[BoseMod] Online.UserProfile.isRewardUnlocked not found; memento unlock patch not applied.");
			return;
		}
		if (profile.__boseMementoPatched) {
			return;
		}
		const original = profile.isRewardUnlocked.bind(profile);
		profile.isRewardUnlocked = function (rewardId) {
			if (BOSE_MEMENTO_IDS.has(rewardId)) {
				return true;
			}
			return original(rewardId);
		};
		profile.__boseMementoPatched = true;
		console.log("[BoseMod] Memento unlock patch applied for: " + Array.from(BOSE_MEMENTO_IDS).join(", "));
	} catch (e) {
		console.error("[BoseMod] Failed to apply memento unlock patch: " + e);
	}
})();
