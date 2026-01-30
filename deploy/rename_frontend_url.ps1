# Rename Frontend URL (by creating a new Container App)
# Usage: .\deploy\rename_frontend_url.ps1

$ErrorActionPreference = "Stop"

# --- Configuration ---
$RESOURCE_GROUP = Read-Host "Enter Azure Resource Group Name"
$ENV_NAME = Read-Host "Enter Container Apps Environment Name"
$ACR_SERVER = Read-Host "Enter ACR Login Server"
$NEW_APP_NAME = "warhammer-arena"

# --- Get Gateway URL ---
Write-Host "Retrieving Gateway URL..." -ForegroundColor Cyan
$gatewayFqdn = az containerapp show --name gateway-service --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv
$GATEWAY_URL = "https://$gatewayFqdn"
Write-Host "Gateway URL: $GATEWAY_URL" -ForegroundColor Gray

# --- Get ACR Credentials ---
$acrName = $ACR_SERVER.Split('.')[0]
$ACR_USERNAME = az acr credential show --name $acrName --query username --output tsv
$ACR_PASSWORD = az acr credential show --name $acrName --query passwords[0].value --output tsv

# --- Deploy New App ---
Write-Host "Deploying new app '$NEW_APP_NAME'..." -ForegroundColor Cyan

az containerapp create `
  --name $NEW_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --environment $ENV_NAME `
  --image "$ACR_SERVER/frontend:latest" `
  --registry-server $ACR_SERVER `
  --registry-username $ACR_USERNAME `
  --registry-password $ACR_PASSWORD `
  --ingress external `
  --target-port 80 `
  --env-vars GATEWAY_URL=$GATEWAY_URL `
  --query properties.configuration.ingress.fqdn `
  --output tsv

Write-Host "New Frontend deployed!" -ForegroundColor Green
Write-Host "You can now delete the old 'frontend' app if you wish." -ForegroundColor Yellow
