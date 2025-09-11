# PowerShell script to add edge runtime to all page.tsx files

$pageFiles = @(
    "app\plans\page.tsx",
    "app\onboarding\page.tsx",
    "app\invoices\page.tsx",
    "app\error\page.tsx",
    "app\settings\page.tsx",
    "app\(auth)\signup\page.tsx",
    "app\(auth)\update-password\page.tsx",
    "app\(auth)\logout\page.tsx",
    "app\(auth)\login\page.tsx",
    "app\(auth)\forgot-password\page.tsx",
    "app\(auth)\accept-invite\page.tsx",
    "app\admin\projects\page.tsx",
    "app\admin\login\page.tsx",
    "app\admin\dashboard\page.tsx",
    "app\admin\users-administration\admin-users\page.tsx",
    "app\admin\users-administration\customers\page.tsx",
    "app\admin\users-administration\customers\[id]\page.tsx",
    "app\admin\compliance-library\controls\page.tsx",
    "app\admin\compliance-library\frameworks\[id]\page.tsx",
    "app\admin\compliance-library\controls\details\page.tsx",
    "app\admin\compliance-library\requirements\page.tsx",
    "app\admin\compliance-library\frameworks\page.tsx",
    "app\admin\compliance-library\controls\create\page.tsx",
    "app\admin\compliance-library\frameworks\create\page.tsx",
    "app\admin\compliance-library\requirements\create\page.tsx",
    "app\admin\compliance-library\requirements\[id]\page.tsx"
)

foreach ($file in $pageFiles) {
    $fullPath = $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Check if it already has edge runtime
        if ($content -notmatch "export const runtime = 'edge';") {
            Write-Host "Adding edge runtime to: $file"
            
            # Handle different patterns
            if ($content -match '^"use client"') {
                # For client components, add after "use client"
                $newContent = $content -replace '^("use client")', "`$1`r`n`r`nexport const runtime = 'edge';"
            } elseif ($content -match '^(import .+?)(\r?\n\r?\n)') {
                # For regular components, add after imports
                $newContent = $content -replace '^((?:import .+?\r?\n)*)', "`$1`r`nexport const runtime = 'edge';`r`n"
            } else {
                # Fallback: add at the beginning
                $newContent = "export const runtime = 'edge';`r`n`r`n" + $content
            }
            
            Set-Content $fullPath $newContent -NoNewline
        } else {
            Write-Host "Edge runtime already exists in: $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Completed adding edge runtime to all page files!"
