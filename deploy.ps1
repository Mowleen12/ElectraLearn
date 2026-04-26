# deploy.ps1
Write-Host "Preparing to deploy ElectraLearn to Google Cloud Run..." -ForegroundColor Cyan

# 1. Prompt for Gemini API Key
$apiKey = Read-Host "Enter your Gemini API Key (Paste it and press Enter)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "Error: API Key cannot be empty. Deployment aborted." -ForegroundColor Red
    exit 1
}

# 2. Check gcloud auth
$project = gcloud config get-value project 2>$null
if (-not $project) {
    Write-Host "Error: No default project set. Please run 'gcloud init' or 'gcloud config set project YOUR_PROJECT_ID'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Detected project: $project" -ForegroundColor Green
Write-Host "Building and deploying via Cloud Run..." -ForegroundColor Cyan

# 3. Deploy using gcloud
gcloud run deploy electralearn `
    --source . `
    --region us-central1 `
    --allow-unauthenticated `
    --project $project

Write-Host "Deployment finished!" -ForegroundColor Green
