# /// script
# requires-python = ">=3.12,<3.13"
# dependencies = ["pillow>=10", "numpy>=1.26"]
# ///
"""
process_art.py — turn a Grok Imagine (or any) image into the exact PNG(s) the
Netaji/Bharat mod needs, correctly sized and named.

Run it with uv (handles Python + deps automatically — nothing to install):

    uv run art/process_art.py <asset> art/incoming/<yourfile.png>

Examples:
    uv run art/process_art.py civ         art/incoming/tiger.png
    uv run art/process_art.py yojana      art/incoming/planning.png
    uv run art/process_art.py leader      art/incoming/bose_portrait.png
    uv run art/process_art.py --list

What it does per asset "mode":
  silhouette (civ symbol, unit flag): key out the solid background, flatten the
      shape to pure white on transparent, trim + centre, export at target size.
  icon (building icons): key out the background, trim + centre on a transparent
      square with a small margin, keep colour, export at target size.
  portrait (leader): keep the painted background, centre-crop to square, export
      every size the game needs (the game itself masks to hex / circle).

Background removal:
  Default = colour-key from the image corners. This is the intended path: it is
  clean and instant WHEN THE SUBJECT SITS ON A FLAT, SOLID BACKGROUND — so always
  ask Grok Imagine to generate icons/silhouettes on a plain solid backdrop (see
  ART-BRIEFS). Tune with --fuzz if edges are rough.
  --rembg   = shell out to an AI matting tool `rembg` for busy backgrounds. NOT
              bundled (rembg's deps don't currently resolve on this machine's
              Python); only works if you install a working `rembg` yourself. For
              a busy background, prefer just regenerating on a flat backdrop.
  --keep-bg = input is ALREADY transparent (or you want the background kept);
              skip keying.

Other flags: --fuzz N (key tolerance, default 14), --margin N (percent padding
for icon/silhouette, default 6), --transparent (cut out a portrait too).
Outputs overwrite the real art/<name>.png in place — they're already wired in
netaji-bose.modinfo + data/icons/bharat-icons.xml, so after running, just
restart the game to see them.
"""
import argparse, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image
import numpy as np

ART = Path(__file__).resolve().parent  # the mod's art/ dir

# name -> (mode, [(output_filename, size_px), ...])
ASSETS = {
    "civ":         ("silhouette", [("civ_sym_bharat.png", 256)]),
    "yojana":      ("icon",       [("buildicon_yojana_bhavan.png", 256)]),
    "vaidyashala": ("icon",       [("buildicon_vaidyashala.png", 256)]),
    "commission":  ("icon",       [("buildicon_national_planning_commission.png", 256)]),
    "leader":      ("portrait",   [("lp_hex_bose_256.png", 256), ("lp_hex_bose_128.png", 128),
                                    ("lp_circ_bose_256.png", 256), ("lp_circ_bose_140.png", 140)]),
    "unitflag":    ("silhouette", [("unitflag_azad_hind_fauj.png", 256)]),
    "rani":        ("silhouette", [("unitflag_rani_of_jhansi.png", 256)]),
    "nausena":     ("silhouette", [("unitflag_nau_sena.png", 256)]),
    "bahadur":     ("silhouette", [("unitflag_bahadur.png", 256)]),
}
MASTER = 512  # build a hi-res master, then downscale to each target for crisp small icons


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def rembg_cutout(img: Image.Image) -> Image.Image:
    """Shell out to the `rembg` CLI for AI background removal."""
    with tempfile.TemporaryDirectory() as d:
        i, o = Path(d) / "i.png", Path(d) / "o.png"
        img.save(i)
        try:
            subprocess.run(["rembg", "i", str(i), str(o)], check=True, capture_output=True)
        except (FileNotFoundError, subprocess.CalledProcessError) as e:
            sys.exit(f"--rembg needs a working `rembg` on PATH (not bundled): {e}\n"
                     "Tip: regenerate the image on a flat solid background and use the default colour-key instead.")
        return load_rgba(o)


def colorkey_cutout(img: Image.Image, fuzz: int) -> Image.Image:
    """Soft colour-key: sample the 4 corners, matte out pixels near that colour.
    Soft (distance-ramped) alpha to avoid a hard halo on anti-aliased edges."""
    a = np.asarray(img, dtype=np.float32)
    h, w = a.shape[:2]
    corners = np.stack([a[0, 0, :3], a[0, w - 1, :3], a[h - 1, 0, :3], a[h - 1, w - 1, :3]])
    bg = np.median(corners, axis=0)
    dist = np.sqrt(((a[:, :, :3] - bg) ** 2).sum(axis=2))  # 0..441
    lo = fuzz * 441 / 100.0            # fully background below this
    hi = lo * 2.2                      # fully subject above this
    alpha = np.clip((dist - lo) / max(hi - lo, 1e-3), 0, 1)
    out = a.copy()
    out[:, :, 3] = np.minimum(a[:, :, 3], alpha * 255.0)
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def flatten_white(img: Image.Image) -> Image.Image:
    """Set every visible pixel to pure white, keep the (soft) alpha as the shape."""
    a = np.asarray(img).copy()
    a[:, :, 0:3] = 255
    return Image.fromarray(a, "RGBA")


def trim(img: Image.Image) -> Image.Image:
    """Crop to the bounding box of visible (alpha>10) pixels."""
    alpha = np.asarray(img)[:, :, 3]
    ys, xs = np.where(alpha > 10)
    if len(xs) == 0:
        return img
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def center_on_square(img: Image.Image, side: int, margin_pct: int) -> Image.Image:
    """Scale to fit inside (side - margin), paste centred on a transparent square."""
    inner = int(side * (1 - margin_pct / 100.0 * 2))
    w, h = img.size
    scale = min(inner / w, inner / h)
    img = img.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
    return canvas


def center_crop_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    s = min(w, h)
    return img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))


def main():
    ap = argparse.ArgumentParser(description="Process an image into the mod's named art PNG(s).")
    ap.add_argument("asset", nargs="?", help="asset key (see --list)")
    ap.add_argument("input", nargs="?", help="path to the source image")
    ap.add_argument("--list", action="store_true", help="list asset keys and exit")
    ap.add_argument("--rembg", action="store_true", help="AI background removal (busy backgrounds)")
    ap.add_argument("--keep-bg", action="store_true", help="input is already transparent / keep background")
    ap.add_argument("--transparent", action="store_true", help="also cut out a portrait's background")
    ap.add_argument("--fuzz", type=int, default=14, help="colour-key tolerance percent (default 14)")
    ap.add_argument("--margin", type=int, default=6, help="icon/silhouette padding percent (default 6)")
    args = ap.parse_args()

    if args.list or not args.asset:
        print("Assets:")
        for k, (mode, outs) in ASSETS.items():
            names = ", ".join(f"{n} ({s}px)" for n, s in outs)
            print(f"  {k:12} [{mode}] -> {names}")
        return
    if args.asset not in ASSETS:
        sys.exit(f"Unknown asset '{args.asset}'. Run --list.")
    if not args.input:
        sys.exit("Provide an input image path.")
    src = Path(args.input)
    if not src.exists():
        sys.exit(f"Input not found: {src}")

    mode, outputs = ASSETS[args.asset]
    img = load_rgba(src)

    if mode == "portrait":
        if args.transparent:
            img = rembg_cutout(img) if args.rembg else colorkey_cutout(img, args.fuzz)
            img = center_on_square(trim(img), MASTER, args.margin)
        else:
            img = center_crop_square(img).resize((MASTER, MASTER), Image.LANCZOS)
    else:  # icon or silhouette
        if not args.keep_bg:
            img = rembg_cutout(img) if args.rembg else colorkey_cutout(img, args.fuzz)
        if mode == "silhouette":
            img = flatten_white(img)
        img = center_on_square(trim(img), MASTER, args.margin)

    for name, size in outputs:
        out = img.resize((size, size), Image.LANCZOS)
        dest = ART / name
        out.save(dest)
        print(f"  wrote {dest.relative_to(ART.parent)}  ({size}x{size})")
    print("Done. Restart Civ VII to see it (art is already wired in the modinfo + icons xml).")


if __name__ == "__main__":
    main()
