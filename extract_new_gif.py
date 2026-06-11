import os
from PIL import Image

gif_path = "/Users/kunsangdorjay/Downloads/Nagi.ai-main/new_search_animation.gif"
out_dir = "/Users/kunsangdorjay/Downloads/Nagi.ai-main/scratch_new_gif"
os.makedirs(out_dir, exist_ok=True)

with Image.open(gif_path) as im:
    print(f"Format: {im.format}, Size: {im.size}, Frames: {im.n_frames}")
    # Extract frames to inspect what is in this gif
    step = max(1, im.n_frames // 10)
    for i in range(0, im.n_frames, step):
        im.seek(i)
        frame = im.convert("RGBA")
        frame.save(os.path.join(out_dir, f"frame_{i:03d}.png"))
    print("New gif frames extracted successfully.")
