$baseUrl = "http://localhost:9002/api"

# 1. Register a Test User
$userData = @{
    name     = "Role Test User"
    email    = "roletest@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "1. Registering Test User..."
try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $userData -ContentType "application/json"
    if ($regResponse.success) {
        $userId = $regResponse.data._id
        if (-not $userId) { $userId = $regResponse.data.id }
        Write-Host "   Created User ID: $userId" -ForegroundColor Green
        
        # 2. Promote to Manager
        Write-Host "`n2. Promoting to 'manager'..."
        $updateData = @{
            userId = $userId
            action = "update_role"
            role   = "manager"
        } | ConvertTo-Json
        
        try {
            $updateResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method Put -Body $updateData -ContentType "application/json"
            if ($updateResponse.success -and $updateResponse.data.role -eq "manager") {
                Write-Host "   SUCCESS: Role updated to 'manager'" -ForegroundColor Green
            }
            else {
                Write-Host "   FAILURE: Role update failed. Got: $($updateResponse.data.role)" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "   Error updating role: $_" -ForegroundColor Red
        }

        # 3. Change to Editor
        Write-Host "`n3. Changing to 'editor'..."
        $updateDataEditor = @{
            userId = $userId
            action = "update_role"
            role   = "editor"
        } | ConvertTo-Json
        
        try {
            $editorResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method Put -Body $updateDataEditor -ContentType "application/json"
            if ($editorResponse.success -and $editorResponse.data.role -eq "editor") {
                Write-Host "   SUCCESS: Role updated to 'editor'" -ForegroundColor Green
            }
            else {
                Write-Host "   FAILURE: Role update failed. Got: $($editorResponse.data.role)" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "   Error updating role: $_" -ForegroundColor Red
        }
        
    }
    else {
        Write-Host "   Registration failed: $($regResponse.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   Error during test: $_" -ForegroundColor Red
}
