param(
  [Parameter(Mandatory=$true)][string]$InputImage,
  [string]$OutDir = "dp-logo",
  [double]$Padding = 0.08 # 8% padding around the image
)

# Ensure output directory exists
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# Load System.Drawing
Add-Type -AssemblyName System.Drawing

# Target sizes (px)
$sizes = 1024,512,256,128,64,32

# Load source image
$src = [System.Drawing.Image]::FromFile($InputImage)

foreach($s in $sizes){
  $canvas = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.SmoothingMode = 'HighQuality'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.CompositingQuality = 'HighQuality'

  # Transparent background
  $g.Clear([System.Drawing.Color]::Transparent)

  # Compute draw box with padding
  $box = [int]([math]::Round($s * (1 - 2*$Padding)))
  $ratio = [math]::Min($box / $src.Width, $box / $src.Height)
  $dw = [int]($src.Width * $ratio)
  $dh = [int]($src.Height * $ratio)
  $dx = [int](($s - $dw) / 2)
  $dy = [int](($s - $dh) / 2)

  # Draw centered
  $rect = New-Object System.Drawing.Rectangle($dx, $dy, $dw, $dh)
  $g.DrawImage($src, $rect)

  # Save PNG
  $outPath = Join-Path $OutDir ("{0}.png" -f $s)
  $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $g.Dispose(); $canvas.Dispose()
}

$src.Dispose()

# Copy a default logo.png (256x256)
Copy-Item (Join-Path $OutDir "256.png") (Join-Path $OutDir "logo.png") -Force

Write-Host ("Done => {0} (generated: {1})" -f $OutDir, ($sizes -join ', '))
