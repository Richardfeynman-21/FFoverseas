import os
from PIL import Image, ImageDraw

def create_squarcle_icon(src_path, size):
    # 1. Load the original JPEG
    logo = Image.open(src_path)
    
    # 2. Calculate the logo size (80% of target size for a comfortable padding)
    logo_size = int(size * 0.80)
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # 3. Create a white background canvas of the target size with full opacity
    canvas = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    
    # 4. Paste the logo in the center
    padding = (size - logo_size) // 2
    canvas.paste(logo_resized, (padding, padding))
    
    # 5. Create a mask for the squarcle (rounded corners)
    # The mask is a grayscale image: 0 for transparent, 255 for opaque
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    
    # 22% corner radius makes a perfect squarcle (iOS style)
    rx = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size, size], radius=rx, fill=255)
    
    # 6. Apply the mask to the canvas's alpha channel
    canvas.putalpha(mask)
    
    return canvas

def main():
    print("Generating squarcle-shaped search-engine optimized favicons via Python...")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    public_dir = os.path.join(project_root, 'public')
    src_logo_path = os.path.join(public_dir, 'browser-logo.jpeg')
    
    if not os.path.exists(src_logo_path):
        print(f"Error: Original logo not found at {src_logo_path}")
        return

    # Generate PNG files
    sizes = [48, 192, 512]
    png_images = {}
    for size in sizes:
        img = create_squarcle_icon(src_logo_path, size)
        out_path = os.path.join(public_dir, f'icon-{size}.png')
        img.save(out_path, format='PNG')
        print(f"✔ Generated squarcle icon-{size}.png")
        png_images[size] = img

    # Generate proper multi-size ICO favicon (16x16, 32x32, 48x48)
    ico_path = os.path.join(public_dir, 'favicon.ico')
    
    # Save the ICO file using Pillow's native multi-frame ICO support,
    # calling save on the 512x512 image which is large enough to downscale to all target sizes.
    png_images[512].save(
        ico_path,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("✔ Generated multi-size squarcle favicon.ico (containing 16x16, 32x32, and 48x48 frames)")
    print("Favicon generation completed successfully!")

if __name__ == '__main__':
    main()
