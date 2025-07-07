# PowerShell script to run the query server with authentication bypassed
# Usage: .\run-query-with-bypass.ps1

Write-Host "🚀 Starting GraphQL Query Server with Authentication Bypassed" -ForegroundColor Green
Write-Host "⚠️  WARNING: This bypasses authentication - only use for development/testing!" -ForegroundColor Yellow
Write-Host ""

# Set environment variable to bypass authentication
$env:BYPASS_AUTH = "true"

# Start the query server
Write-Host "Starting query server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "GraphQL Playground will be available at: http://localhost:4000/graphql" -ForegroundColor Green
Write-Host "No authentication token required!" -ForegroundColor Green

nx serve query
