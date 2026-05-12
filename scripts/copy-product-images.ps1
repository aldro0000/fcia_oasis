param(
  [string]$Source = "C:\fotos web fcia",
  [string]$Destination = "public\products"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $Source)) {
  throw "No existe la carpeta origen: $Source"
}

New-Item -ItemType Directory -Force -Path $Destination | Out-Null

$logo = Get-ChildItem -Path $Source -File -Include *.webp,*.png,*.jpg,*.jpeg -Recurse |
  Where-Object { $_.BaseName -like "*LOGO*FARMACIA*" } |
  Select-Object -First 1

if ($null -ne $logo) {
  Copy-Item -Path $logo.FullName -Destination "public\logo-farmacia.webp" -Force
  Write-Host "Copiado logo: $($logo.Name) -> public\logo-farmacia.webp"
} else {
  Write-Warning "No encontré LOGO FARMACIA en $Source"
}

$items = @(
  @{ Pattern = "*Limpieza*Completa*"; Target = "01-kit-limpieza-facial-completa.webp" },
  @{ Pattern = "*Balsamo*Labial*"; Target = "02-balsamo-reparador-labial-vitamina-k-e-15g.webp" },
  @{ Pattern = "*Emulsion*Fitoesteroles*"; Target = "03-emulsion-hidratante-fitoesteroles-fps-30.webp" },
  @{ Pattern = "*Kit Antiage*Completo*"; Target = "04-kit-antiage-completo-dia-noche.webp" },
  @{ Pattern = "*Crema Antiage Noche*"; Target = "05-crema-antiage-noche-oasis-night-repair-50g.webp" },
  @{ Pattern = "*Crema Antiage Dia*"; Target = "06-crema-antiage-dia-oasis-day-balance-50g.webp" },
  @{ Pattern = "*Crema Antiage Día*"; Target = "06-crema-antiage-dia-oasis-day-balance-50g.webp" },
  @{ Pattern = "*Gel Contorno*Ojos*"; Target = "07-gel-contorno-ojos-cafeina-efecto-seda.webp" },
  @{ Pattern = "*Espuma*Limpieza*Facial*"; Target = "08-espuma-limpieza-facial-te-verde-malva.webp" },
  @{ Pattern = "*Exfoliante*Facial*"; Target = "09-exfoliante-facial-suavidad-natural.webp" },
  @{ Pattern = "*Agua Micelar*"; Target = "10-agua-micelar-facial.webp" },
  @{ Pattern = "*Cuello*Escote*"; Target = "11-crema-cuello-escote-40.webp" },
  @{ Pattern = "*Flebotonico*"; Target = "12-gel-flebotonico-250g.webp" },
  @{ Pattern = "*Flebotónico*"; Target = "12-gel-flebotonico-250g.webp" },
  @{ Pattern = "*Agua Termal*"; Target = "13-agua-termal-facial.webp" },
  @{ Pattern = "*Serum tensor*"; Target = "14-serum-tensor-botox-argireline-10.webp" },
  @{ Pattern = "*Serum regenerador*"; Target = "15-serum-regenerador-pepitas-uva.webp" },
  @{ Pattern = "*Serum Vit C*"; Target = "16-serum-vit-c-acido-hialuronico.webp" }
)

foreach ($item in $items) {
  $file = Get-ChildItem -Path $Source -File -Include *.webp,*.png,*.jpg,*.jpeg -Recurse |
    Where-Object { $_.BaseName -like $item.Pattern } |
    Select-Object -First 1

  if ($null -eq $file) {
    Write-Warning "No encontré imagen para $($item.Target) con patrón $($item.Pattern)"
    continue
  }

  Copy-Item -Path $file.FullName -Destination (Join-Path $Destination $item.Target) -Force
  Write-Host "Copiado: $($file.Name) -> $($item.Target)"
}

Write-Host "Listo. Revisá $Destination y después subí esos archivos a GitHub/Vercel."
