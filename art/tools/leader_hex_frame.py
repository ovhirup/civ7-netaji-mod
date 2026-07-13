# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow", "numpy"]
# ///
from PIL import Image, ImageDraw
import numpy as np, math
SP = "/private/tmp/claude-501/-Users-abhirupbanerjee/c1087cb7-3738-4c3b-a951-84c97f5f3fb4/scratchpad"
S = 512  # author at 2x then downscale for crisp edges
cx = cy = S//2
def hexpts(R, cx=cx, cy=cy):
    return [(cx + R*math.cos(math.radians(a)), cy - R*math.sin(math.radians(a)))
            for a in (90,150,210,270,330,30)]
def vgrad(top, bot, w, h):
    arr = np.zeros((h,w,3),np.uint8)
    for y in range(h):
        t=y/(h-1)
        arr[y,:,0]=int(top[0]+(bot[0]-top[0])*t)
        arr[y,:,1]=int(top[1]+(bot[1]-top[1])*t)
        arr[y,:,2]=int(top[2]+(bot[2]-top[2])*t)
    return Image.fromarray(arr,"RGB")

R_out = int(S*0.46)      # outer frame edge
R_frame_in = int(S*0.40) # inner edge of gold band
img = Image.new("RGBA",(S,S),(0,0,0,0))
d = ImageDraw.Draw(img)
# drop shadow ring
d.polygon(hexpts(R_out+6),(0,0,0,90))
# outer dark bronze rim
d.polygon(hexpts(R_out),(70,48,18,255))
# gold band (bevel gradient)
band = vgrad((240,214,140),(150,110,48),S,S).convert("RGBA")
bandmask = Image.new("L",(S,S),0); ImageDraw.Draw(bandmask).polygon(hexpts(R_out-3),255)
img.paste(band,(0,0),bandmask)
# inner thin dark line
d.polygon(hexpts(R_frame_in+3),outline=(60,42,16,255),width=4)
# plate (tinted cream-gold to match Bose's banner) inside inner hex
plate = vgrad((232,220,180),(176,150,96),S,S).convert("RGBA")
platemask = Image.new("L",(S,S),0); ImageDraw.Draw(platemask).polygon(hexpts(R_frame_in),255)
img.paste(plate,(0,0),platemask)

# --- bust, clipped to (inner hex + top head opening), head cresting above frame ---
bust = Image.open(f"{SP}/bust_clean2.png").convert("RGBA")
# scale bust to canvas width-ish and position head high
bw = int(S*0.95); bh = int(bust.height*bw/bust.width)
bust = bust.resize((bw,bh))
# cap top in original ~120/1152 of width-height; after resize:
cap_y = int(120*bw/1152)
# want cap crown near y = S*0.02
offy = int(S*0.015) - cap_y
offx = (S-bw)//2
bust_layer = Image.new("RGBA",(S,S),(0,0,0,0))
bust_layer.paste(bust,(offx,offy),bust)
# clip mask: inner hex OR top opening (rect from y0 down to mid, for the head crest)
clip = Image.new("L",(S,S),0)
cd = ImageDraw.Draw(clip)
cd.polygon(hexpts(R_frame_in-2),255)
cd.rectangle([int(S*0.29),0,int(S*0.71),int(S*0.45)],255)  # head column opening at top
bust_clipped = Image.new("RGBA",(S,S),(0,0,0,0))
bust_clipped.paste(bust_layer,(0,0),clip)
img = Image.alpha_composite(img,bust_clipped)

img = img.resize((256,256), Image.LANCZOS)
img.save(f"{SP}/framed_256.png")
img.resize((128,128),Image.LANCZOS).save(f"{SP}/framed_128.png")
print("built")
