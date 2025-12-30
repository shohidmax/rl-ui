$baseUrl = "http://localhost:9002/api"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "qa_user_$timestamp@example.com"

Write-Host "=== STARTING PROFILE SUITE QA ===" -ForegroundColor Cyan

# 1. SETUP: Register User
Write-Host "`n[1/3] SETUP USER"
$userData = @{ name = "QA User"; email = $email; password = "password123" } | ConvertTo-Json
$reg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $userData -ContentType "application/json"
if (-not $reg.success) { Write-Host "   Registration Failed" -ForegroundColor Red; exit }
Write-Host "   User Registered: $email" -ForegroundColor Green

# 2. TEST PROFILE EDIT (Logic for /profile/edit)
Write-Host "`n[2/3] TEST PROFILE EDIT"
$updateData = @{
    email    = $email
    name     = "QA User Updated"
    gender   = "female"
    birthday = "2000-01-01"
    phone    = "01999999999"
} | ConvertTo-Json

try {
    $update = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body $updateData -ContentType "application/json"
    if ($update.success -and $update.data.gender -eq "female" -and $update.data.name -eq "QA User Updated") {
        Write-Host "   SUCCESS: Profile Updated (Name, Gender, Birthday)" -ForegroundColor Green
    }
    else {
        Write-Host "   FAILURE: Profile Update Failed. Data: $($update.data | ConvertTo-Json -Depth 1)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}

# 3. TEST ADDRESS BOOK (Logic for /profile/address-book)
Write-Host "`n[3/3] TEST ADDRESS BOOK"
# A. Add Address
$address1 = @{
    fullName          = "QA Recipient"
    phone             = "01700000000"
    address           = "123 QA Lane"
    city              = "Dhaka"
    postcode          = "1000"
    isDefaultShipping = $true
}
# API replaces the array, so we send the new list (which is just this one)
$addrData = @{
    email       = $email
    addressBook = @($address1)
} | ConvertTo-Json

try {
    $addAddr = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body $addrData -ContentType "application/json"
    if ($addAddr.success -and $addAddr.data.addressBook.Count -eq 1 -and $addAddr.data.addressBook[0].city -eq "Dhaka") {
        Write-Host "   SUCCESS: Address Added." -ForegroundColor Green
    }
    else {
        Write-Host "   FAILURE: Add Address Failed." -ForegroundColor Red
    }
}
catch {
    Write-Host "   ERROR Adding Address: $_" -ForegroundColor Red
}

# B. Add 2nd Address (Update list)
$address2 = @{
    fullName         = "QA Office"
    phone            = "01800000000"
    address          = "456 Office Rd"
    city             = "Chittagong"
    isDefaultBilling = $true
}
$addrData2 = @{
    email       = $email
    addressBook = @($address1, $address2)
} | ConvertTo-Json

try {
    $addAddr2 = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body $addrData2 -ContentType "application/json"
    if ($addAddr2.success -and $addAddr2.data.addressBook.Count -eq 2) {
        Write-Host "   SUCCESS: Second Address Added." -ForegroundColor Green
    }
    else {
        Write-Host "   FAILURE: Second Address Failed." -ForegroundColor Red
    }
}
catch {
    Write-Host "   ERROR Adding 2nd Address: $_" -ForegroundColor Red
}

# C. Delete Address (Send list without the first one)
$addrDataDel = @{
    email       = $email
    addressBook = @($address2)
} | ConvertTo-Json

try {
    $delAddr = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body $addrDataDel -ContentType "application/json"
    if ($delAddr.success -and $delAddr.data.addressBook.Count -eq 1 -and $delAddr.data.addressBook[0].city -eq "Chittagong") {
        Write-Host "   SUCCESS: Address Deleted (List updated)." -ForegroundColor Green
    }
    else {
        Write-Host "   FAILURE: Delete Address Failed." -ForegroundColor Red
    }
}
catch {
    Write-Host "   ERROR Deleting Address: $_" -ForegroundColor Red
}

Write-Host "`n=== QA COMPLETE ===" -ForegroundColor Cyan
