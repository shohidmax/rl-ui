$baseUrl = "http://localhost:9002/api"

# 1. Register User
$email = "dashboard_user_final@example.com"
$userData = @{
    name     = "Dashboard User"
    email    = $email
    password = "password123"
} | ConvertTo-Json

Write-Host "1. Registering User..."
try {
    $reg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $userData -ContentType "application/json"
    if ($reg.success) {
        Write-Host "   User Registered." -ForegroundColor Green
        
        # 2. Update Profile with Address
        Write-Host "2. Updating Profile with Address Book..."
        $profileData = @{
            email       = $email
            addressBook = @(
                @{
                    fullName          = "Dashboard User"
                    phone             = "+880 1711112222"
                    address           = "Test House, Road 1, Block A"
                    city              = "Dhaka"
                    postcode          = "1230"
                    isDefaultShipping = $true
                    isDefaultBilling  = $true
                }
            )
            phone       = "+880 1711112222"
            gender      = "male"
            birthday    = "1995-01-01"
        } | ConvertTo-Json -Depth 5

        $update = Invoke-RestMethod -Uri "$baseUrl/profile" -Method Put -Body $profileData -ContentType "application/json"
        
        if ($update.success -and $update.data.addressBook.Count -gt 0) {
            Write-Host "   Profile Updated successfully with Address." -ForegroundColor Green
        }
        else {
            Write-Host "   Profile Update Failed." -ForegroundColor Red
        }

        # 3. Create an Order
        Write-Host "3. Creating Test Order..."
        $orderData = @{
            email    = $email
            customer = "Dashboard User"
            phone    = "01711112222"
            address  = "Test House"
            amount   = 1500
            date     = (Get-Date).ToString("yyyy-MM-dd")
            products = @(@{ name = "Test Item"; quantity = 1; price = 1500 })
        } | ConvertTo-Json

        $order = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderData -ContentType "application/json"
        if ($order.success) {
            Write-Host "   Order Created: $($order.data.id)" -ForegroundColor Green
        }
        else {
            Write-Host "   Order Creation Failed." -ForegroundColor Red
        }

    }
    else {
        Write-Host "   Registration Failed: $($reg.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}
