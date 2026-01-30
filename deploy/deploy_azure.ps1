# Deploy Warhammer Arena to Azure Container Apps
# Usage: .\deploy\deploy_azure.ps1

$ErrorActionPreference = "Stop"

# --- Configuration ---
$RESOURCE_GROUP = Read-Host "Enter Azure Resource Group Name"
$ENV_NAME = Read-Host "Enter Container Apps Environment Name"
$ACR_SERVER = Read-Host "Enter ACR Login Server"
$MONGO_URI = Read-Host "Enter MongoDB Connection String"
$POSTGRES_URI = Read-Host "Enter PostgreSQL Connection String"
$RABBITMQ_URI = Read-Host "Enter RabbitMQ Connection String"
$JWT_SECRET = Read-Host "Enter JWT Secret"
$JWT_REFRESH_SECRET = Read-Host "Enter JWT Refresh Secret"

# Default Ports
$AUTH_PORT = 5000
$TRAIT_PORT = 5001
$ARMOR_PORT = 5002
$WEAPON_PORT = 5003
$TALENT_PORT = 5004
$SKILL_PORT = 5005
$CHARACTER_PORT = 5006
$FIGHT_PORT = 5007
$GATEWAY_PORT = 8080
$FRONTEND_PORT = 80

# --- Get ACR Credentials ---
Write-Host "Retrieving ACR Credentials..." -ForegroundColor Cyan
$acrName = $ACR_SERVER.Split('.')[0]
try {
    Write-Host "Ensuring Admin User is enabled for $acrName..."
    az acr update -n $acrName --admin-enabled true *>$null
} catch {
    Write-Warning "Failed to enable admin user. Deployment may fail if credentials are not accessible."
}

$ACR_USERNAME = az acr credential show --name $acrName --query username --output tsv
$ACR_PASSWORD = az acr credential show --name $acrName --query passwords[0].value --output tsv

if (-not $ACR_USERNAME -or -not $ACR_PASSWORD) {
    Write-Warning "Automatic credential retrieval failed."
    $ACR_USERNAME = Read-Host "Please enter ACR Username"
    $ACR_PASSWORD = Read-Host "Please enter ACR Password"
}

# --- Helper Function ---
function Deploy-Service {
    param (
        [string]$Name,
        [int]$Port,
        [string]$IngressType = "internal",
        [hashtable]$EnvVars
    )

    Write-Host "Deploying $Name..." -ForegroundColor Cyan

    $envString = ""
    foreach ($key in $EnvVars.Keys) {
        $val = $EnvVars[$key]
        $envString += "$key='$val' "
    }

    # Construct the command
    $cmd = "az containerapp create --name $Name --resource-group $RESOURCE_GROUP --environment $ENV_NAME --image '$ACR_SERVER/$Name`:latest' --registry-server $ACR_SERVER --registry-username $ACR_USERNAME --registry-password $ACR_PASSWORD --ingress $IngressType --target-port $Port --env-vars $envString --query properties.configuration.ingress.fqdn --output tsv"
    
    # Execute
    Invoke-Expression $cmd
}

# --- Deploy Backend Services (Internal) ---

# Auth Service
Deploy-Service -Name "auth-service" -Port $AUTH_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $AUTH_PORT;
    "POSTGRES_URI" = $POSTGRES_URI;
    "JWT_SECRET" = $JWT_SECRET;
    "JWT_REFRESH_SECRET" = $JWT_REFRESH_SECRET
}

# Trait Service
Deploy-Service -Name "trait-service" -Port $TRAIT_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $TRAIT_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# Armor Service
Deploy-Service -Name "armor-service" -Port $ARMOR_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $ARMOR_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# Weapon Service
Deploy-Service -Name "weapon-service" -Port $WEAPON_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $WEAPON_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# Talent Service
Deploy-Service -Name "talent-service" -Port $TALENT_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $TALENT_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# Skill Service
Deploy-Service -Name "skill-service" -Port $SKILL_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $SKILL_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# Character Service
Deploy-Service -Name "character-service" -Port $CHARACTER_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $CHARACTER_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# Fight Service
Deploy-Service -Name "fight-service" -Port $FIGHT_PORT -EnvVars @{
    "NODE_ENV" = "production";
    "PORT" = $FIGHT_PORT;
    "MONGO_URI" = $MONGO_URI;
    "RABBITMQ_URI" = $RABBITMQ_URI
}

# --- Deploy Gateway (External) ---

Write-Host "Deploying Gateway Service..." -ForegroundColor Cyan
$gatewayEnv = @{
    "NODE_ENV" = "production";
    "GATEWAY_PORT" = $GATEWAY_PORT;
    "JWT_SECRET" = $JWT_SECRET;
    "AUTH_SERVICE_PORT" = $AUTH_PORT;
    "TRAIT_SERVICE_PORT" = $TRAIT_PORT;
    "ARMOR_SERVICE_PORT" = $ARMOR_PORT;
    "WEAPON_SERVICE_PORT" = $WEAPON_PORT;
    "TALENT_SERVICE_PORT" = $TALENT_PORT;
    "SKILL_SERVICE_PORT" = $SKILL_PORT;
    "CHARACTER_SERVICE_PORT" = $CHARACTER_PORT;
    "FIGHT_SERVICE_PORT" = $FIGHT_PORT;
    "AUTH_SERVICE_URL" = "http://auth-service/auth";                                                                  
    "TRAIT_SERVICE_URL" = "http://trait-service/traits"; 
    "ARMOR_SERVICE_URL" = "http://armor-service/armors";  
    "WEAPON_SERVICE_URL" = "http://weapon-service/weapons";
    "TALENT_SERVICE_URL" = "http://talent-service/talents";
    "SKILL_SERVICE_URL" = "http://skill-service/skills";
    "CHARACTER_SERVICE_URL" = "http://character-service/characters";
    "FIGHT_SERVICE_URL" = "http://fight-service/fights"       
}

# Capture the Gateway URL
$gatewayFqdn = Deploy-Service -Name "gateway-service" -Port $GATEWAY_PORT -IngressType "external" -EnvVars $gatewayEnv

if (-not $gatewayFqdn) {
    Write-Error "Failed to retrieve Gateway FQDN. Exiting."
}

$gatewayUrl = "https://$gatewayFqdn"
Write-Host "Gateway deployed at: $gatewayUrl" -ForegroundColor Green

# --- Deploy Frontend (External) ---

Write-Host "Deploying Frontend..." -ForegroundColor Cyan
Deploy-Service -Name "warhammer-arena" -Port $FRONTEND_PORT -IngressType "external" -EnvVars @{
    "GATEWAY_URL" = $gatewayUrl
}

Write-Host "Deployment Complete!" -ForegroundColor Green
