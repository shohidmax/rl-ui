$baseUrl = "http://localhost:9002/api/users"
$userData = @{
    name     = "Test User"
    email    = "user@rodela.com"
    password = "user123"
    role     = "user"
} | ConvertTo-Json

Write-Host "Creating/Updating Test User..."
try {
    # Assuming there's a POST /api/users or similar seed route. 
    # Actually, the seed route is usually /api/seed. Let's try that or just use the user service if exposed.
    # Since I can't easily access the internal service from PS, I'll rely on the existing Seed API OR try to register via API if available.
    
    # Let's try to hit the signup API if it exists.
    $signupUrl = "http://localhost:9002/api/auth/register" # Guessing based on common patterns
    
    # Converting check: list auth routes
}
catch {
    Write-Host "Error: $_"
}
