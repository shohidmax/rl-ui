$baseUrl = "http://localhost:9002/api/auth/register"
$userData = @{
    name     = "Test User"
    email    = "user@rodela.com"
    password = "user123"
} | ConvertTo-Json

Write-Host "Registering Test User..."
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $userData -ContentType "application/json"
    if ($response.success) {
        Write-Host "Success: Registered user $($response.data.email)" -ForegroundColor Green
    }
    else {
        Write-Host "Failed: $($response.error)" -ForegroundColor Red
        # If user already exists, that's fine too
    }
}
catch {
    Write-Host "Error (Likely user already exists or server error): $_" -ForegroundColor Yellow
}
