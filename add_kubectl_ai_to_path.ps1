# PowerShell script to add kubectl-ai to Windows PATH permanently
$User = [EnvironmentVariableTarget]::User
$Path = [Environment]::GetEnvironmentVariable('Path', $User)
$KubectlAIDir = "$env:USERPROFILE\bin"

if (-not $Path.Contains($KubectlAIDir)) {
    [Environment]::SetEnvironmentVariable('Path', $Path + ";$KubectlAIDir", $User)
    Write-Host "kubectl-ai directory added to PATH successfully!"
    Write-Host "Please restart your command prompt or PowerShell for changes to take effect."
} else {
    Write-Host "kubectl-ai directory is already in PATH."
}

Write-Host "Current PATH includes: $KubectlAIDir"