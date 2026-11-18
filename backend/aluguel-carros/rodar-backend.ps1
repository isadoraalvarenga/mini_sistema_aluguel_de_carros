if (-not (Test-Path .env)) {
  Write-Host "Crie o arquivo .env a partir do .env.example"
  exit 1
}
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#=\s][^=]*)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
  }
}
.\mvnw.cmd spring-boot:run