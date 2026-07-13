# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow", "numpy"]
# ///
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
SP = "/private/tmp/claude-501/-Users-abhirupbanerjee/c1087cb7-3738-4c3b-a951-84c97f5f3fb4/scratchpad"
GEN = "/Users/abhirupbanerjee/dev/civ7-netaji-mod/art/incoming/grok-06f6c974-c4c1-4bec-a497-58e8d8a12250.jpg"
a = np.array(Image.open(GEN).convert("RGB")).astype(np.int16)
R,G,B = a[:,:,0], a[:,:,1], a[:,:,2]
# "pinkish" = blue exceeds green AND red exceeds green (magenta/pink/purple).
# Skin (G>B), olive uniform (G>B), lips (red, G>B), badge — all excluded.
pink = (B > G + 8) & (R > G + 6)
H,W = pink.shape
outside = np.zeros((H,W), bool); dq=deque()
for x in range(W):
    for y in (0,H-1):
        if pink[y,x]: outside[y,x]=True; dq.append((y,x))
for y in range(H):
    for x in (0,W-1):
        if pink[y,x]: outside[y,x]=True; dq.append((y,x))
while dq:
    y,x=dq.popleft()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny,nx=y+dy,x+dx
        if 0<=ny<H and 0<=nx<W and pink[ny,nx] and not outside[ny,nx]:
            outside[ny,nx]=True; dq.append((ny,nx))
interior_pink = pink & (~outside)
print("outer:", int(outside.sum()), "interior pink:", int(interior_pink.sum()))
out = np.dstack([a.astype(np.uint8), np.full((H,W),255,np.uint8)])
out[outside,3]=0
# neutralise interior pink to a dark glass/eye tone
out[interior_pink,0]=58; out[interior_pink,1]=50; out[interior_pink,2]=44
img = Image.fromarray(out,"RGBA")
img.putalpha(Image.fromarray(np.array(img.split()[3])).filter(ImageFilter.MinFilter(3)))
img.save(f"{SP}/bust_clean2.png")
print("saved")
