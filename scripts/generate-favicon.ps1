Add-Type -AssemblyName System.Drawing

function Draw-MatchflyIcon([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $padding = [Math]::Max(1.0, $size * 0.04)
    $w = $size - ($padding * 2)
    $h = $size - ($padding * 2)
    $radius = $size * 0.22

    # Squircle Path
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc([single]$padding, [single]$padding, [single]$d, [single]$d, [single]180, [single]90)
    $path.AddArc([single]($padding + $w - $d), [single]$padding, [single]$d, [single]$d, [single]270, [single]90)
    $path.AddArc([single]($padding + $w - $d), [single]($padding + $h - $d), [single]$d, [single]$d, [single]0, [single]90)
    $path.AddArc([single]$padding, [single]($padding + $h - $d), [single]$d, [single]$d, [single]90, [single]90)
    $path.CloseFigure()

    # Gradient: Neon Pink to Deep Berry Pink
    $colorTop = [System.Drawing.Color]::FromArgb(255, 255, 45, 141) # #ff2d8d
    $colorBottom = [System.Drawing.Color]::FromArgb(255, 175, 14, 76) # #af0e4c
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF(0, 0)),
        (New-Object System.Drawing.PointF($size, $size)),
        $colorTop,
        $colorBottom
    )
    $g.FillPath($brush, $path)

    # Subtle inner border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), [single][Math]::Max(1.0, $size * 0.02))
    $g.DrawPath($borderPen, $path)

    # Draw Bold "M"
    $mPillarWidth = [single]($size * 0.13)
    $topY = [single]($size * 0.25)
    $bottomY = [single]($size * 0.77)
    $leftX = [single]($size * 0.20)
    $rightX = [single]($size * 0.80 - $mPillarWidth)
    $midX = [single]($size * 0.50)
    $notchY = [single]($size * 0.55)

    [System.Drawing.PointF[]]$points = @(
        (New-Object System.Drawing.PointF($leftX, $bottomY)),
        (New-Object System.Drawing.PointF($leftX, $topY)),
        (New-Object System.Drawing.PointF([single]($leftX + $mPillarWidth), $topY)),
        (New-Object System.Drawing.PointF($midX, $notchY)),
        (New-Object System.Drawing.PointF($rightX, $topY)),
        (New-Object System.Drawing.PointF([single]($rightX + $mPillarWidth), $topY)),
        (New-Object System.Drawing.PointF([single]($rightX + $mPillarWidth), $bottomY)),
        (New-Object System.Drawing.PointF($rightX, $bottomY)),
        (New-Object System.Drawing.PointF($rightX, [single]($topY + ($size * 0.22)))),
        (New-Object System.Drawing.PointF($midX, [single]($notchY + ($size * 0.16)))),
        (New-Object System.Drawing.PointF([single]($leftX + $mPillarWidth), [single]($topY + ($size * 0.22)))),
        (New-Object System.Drawing.PointF([single]($leftX + $mPillarWidth), $bottomY))
    )

    $mPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $mPath.AddPolygon($points)

    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillPath($whiteBrush, $mPath)

    if ($size -ge 32) {
        $tvBoxW = [single]($size * 0.32)
        $tvBoxH = [single]($size * 0.18)
        $tvBoxX = [single]($size * 0.56)
        $tvBoxY = [single]($size * 0.62)

        $tvPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $tvR = [single]($tvBoxH * 0.3)
        $tvd = [single]($tvR * 2)
        $tvPath.AddArc($tvBoxX, $tvBoxY, $tvd, $tvd, [single]180, [single]90)
        $tvPath.AddArc([single]($tvBoxX + $tvBoxW - $tvd), $tvBoxY, $tvd, $tvd, [single]270, [single]90)
        $tvPath.AddArc([single]($tvBoxX + $tvBoxW - $tvd), [single]($tvBoxY + $tvBoxH - $tvd), $tvd, $tvd, [single]0, [single]90)
        $tvPath.AddArc($tvBoxX, [single]($tvBoxY + $tvBoxH - $tvd), $tvd, $tvd, [single]90, [single]90)
        $tvPath.CloseFigure()

        $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 17, 24, 39))
        $g.FillPath($darkBrush, $tvPath)

        $neonPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 45, 141), [single][Math]::Max(1.0, $size * 0.015))
        $g.DrawPath($neonPen, $tvPath)

        $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
        $fontSize = [single]($tvBoxH * 0.65)
        $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
        $tvRect = New-Object System.Drawing.RectangleF($tvBoxX, $tvBoxY, $tvBoxW, $tvBoxH)
        $g.DrawString("TV", $font, $whiteBrush, $tvRect, $sf)

        $font.Dispose()
        $sf.Dispose()
        $darkBrush.Dispose()
        $neonPen.Dispose()
        $tvPath.Dispose()
    }

    $whiteBrush.Dispose()
    $mPath.Dispose()
    $borderPen.Dispose()
    $brush.Dispose()
    $path.Dispose()
    $g.Dispose()

    return $bmp
}

$pubDir = (Resolve-Path "public").Path
$appDir = (Resolve-Path "src/app").Path

$bmp512 = Draw-MatchflyIcon 512
$bmp512.Save("$pubDir\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Save("$pubDir\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Save("$appDir\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Save("$appDir\apple-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp192 = Draw-MatchflyIcon 192
$bmp192.Save("$pubDir\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp48 = Draw-MatchflyIcon 48
$bmp48.Save("$pubDir\favicon-48.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp32 = Draw-MatchflyIcon 32
$bmp32.Save("$pubDir\favicon-32.png", [System.Drawing.Imaging.ImageFormat]::Png)

$bmp16 = Draw-MatchflyIcon 16
$bmp16.Save("$pubDir\favicon-16.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Generate multi-resolution .ICO file (containing 16, 32, 48)
function Save-MultiResIco([string]$icoPath, $images) {
    $fs = [System.IO.File]::Create($icoPath)
    $bw = New-Object System.IO.BinaryWriter($fs)

    $bw.Write([UInt16]0)
    $bw.Write([UInt16]1)
    $bw.Write([UInt16]$images.Count)

    $pngBytesList = @()
    foreach ($img in $images) {
        $ms = New-Object System.IO.MemoryStream
        $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngBytesList += ,$ms.ToArray()
        $ms.Dispose()
    }

    $offset = 6 + ($images.Count * 16)

    for ($i = 0; $i -lt $images.Count; $i++) {
        $img = $images[$i]
        $bytes = $pngBytesList[$i]

        $bWidth = if ($img.Width -ge 256) { [byte]0 } else { [byte]$img.Width }
        $bHeight = if ($img.Height -ge 256) { [byte]0 } else { [byte]$img.Height }

        $bw.Write($bWidth)
        $bw.Write($bHeight)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([UInt16]1)
        $bw.Write([UInt16]32)
        $bw.Write([UInt32]$bytes.Length)
        $bw.Write([UInt32]$offset)
        $offset += $bytes.Length
    }

    foreach ($bytes in $pngBytesList) {
        $bw.Write($bytes)
    }

    $bw.Flush()
    $bw.Close()
    $fs.Close()
}

$icoImages = @($bmp16, $bmp32, $bmp48)
Save-MultiResIco "$pubDir\favicon.ico" $icoImages
Save-MultiResIco "$appDir\favicon.ico" $icoImages

$bmp512.Dispose()
$bmp192.Dispose()
$bmp48.Dispose()
$bmp32.Dispose()
$bmp16.Dispose()

Write-Output "Successfully generated all Matchfly TV favicon PNGs and ICOs!"
