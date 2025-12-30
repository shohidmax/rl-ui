$baseUrl = "http://localhost:9002/api"

# 1. Create Order
$orderData = @{
    customer = "Test User"
    phone    = "01700000000"
    address  = "Test Address"
    amount   = "1000"
    status   = "Pending"
    products = @(
        @{ name = "Test Shirt"; quantity = 1; price = 1000 }
    )
    date     = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json -Depth 3

Write-Host "Creating Order..."
try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $orderData -ContentType "application/json"
    Write-Host "Create Response: $($createResponse | ConvertTo-Json -Depth 2)"
    $orderId = $createResponse.data.id
    Write-Host "Order ID: $orderId"
}
catch {
    Write-Host "Failed to create order. $_"
    exit 1
}

# 2. Get Orders
Write-Host "`nGetting Orders..."
try {
    $orders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Get
    Write-Host "Orders Count: $($orders.data.Count)"
}
catch {
    Write-Host "Failed to get orders. $_"
}

# 3. Update Order Status
Write-Host "`nUpdating Order Status..."
$updateData = @{ status = "Processing" } | ConvertTo-Json
try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId" -Method Put -Body $updateData -ContentType "application/json"
    Write-Host "Update Response Status: $($updateResponse.data.status)"
}
catch {
    Write-Host "Failed to update order. $_"
}

# 4. Get Order By ID
Write-Host "`nGetting Order By ID..."
try {
    $singleOrder = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId" -Method Get
    Write-Host "Single Order Status: $($singleOrder.data.status)"
}
catch {
    Write-Host "Failed to get single order. $_"
}

# 5. Delete Order
Write-Host "`nDeleting Order..."
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId" -Method Delete
    Write-Host "Delete Response: $($deleteResponse | ConvertTo-Json)"
}
catch {
    Write-Host "Failed to delete order. $_"
}

Write-Host "`nVerification Complete!"
