# Fix malformed backdrop-filter properties in premium-enhancements.css

$filePath = ".\premium-enhancements.css"
$content = Get-Content $filePath -Raw

# Fix the malformed lines
$content = $content -replace '-webkit-backdrop-filter: blur\(var\(--glass-blur\)\);`r`n    backdrop-filter: blur\(var\(--glass-blur\)\);', '-webkit-backdrop-filter: blur(var(--glass-blur));
    backdrop-filter: blur(var(--glass-blur));'

$content = $content -replace '-webkit-backdrop-filter: blur\(5px\);`r`n    backdrop-filter: blur\(5px\);', '-webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);'

# Remove duplicate webkit prefixes
$content = $content -replace '    -webkit-backdrop-filter: blur\(var\(--glass-blur\)\);\s*-webkit-backdrop-filter:', '    -webkit-backdrop-filter:'
$content = $content -replace '    -webkit-backdrop-filter: blur\(5px\);\s*-webkit-backdrop-filter:', '    -webkit-backdrop-filter:'

Set-Content -Path $filePath -Value $content

Write-Host "Fixed malformed backdrop-filter properties in premium-enhancements.css"
