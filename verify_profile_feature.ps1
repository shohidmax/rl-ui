$baseUrl = "http://localhost:9002/api"
$testEmail = "testuser@example.com"

Write-Host "1. Creating Order linked to $testEmail..."
$orderData = @{
    customer = "Test Profile User"
    email    = $testEmail
    phone    = "01700000000"
    address  = "Test Address"
    amount   = "1200"
    products = @(
        @{ name = "Test Item"; quantity = 1; price = 1200 }
    )
    date     = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json -Depth 3

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderData -ContentType "application/json"
    Write-Host "   Success: Created Order $($createResponse.data.id)" -ForegroundColor Green
}
catch {
    Write-Host "   Failed to create order: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Fetching Orders for $testEmail..."
try {
    $fetchResponse = Invoke-RestMethod -Uri "$baseUrl/orders?email=$testEmail" -Method Get
    if ($fetchResponse.success) {
        $count = $fetchResponse.data.Count
        Write-Host "   Success: Found $count orders for this email." -ForegroundColor Green
        if ($count -gt 0) {
            Write-Host "   Order ID: $($fetchResponse.data[0].id) - Email: $($fetchResponse.data[0].email)"
        }
        else {
            Write-Host "   Warning: No orders found (unexpected)." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   Failed: $($fetchResponse.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   Error fetching orders: $_" -ForegroundColor Red
}
