$baseUrl = "http://localhost:9002/api/orders"
$orderId = "ORD7586"

Write-Host "Fetching UAT Order $orderId..."
try {
    # Get all orders (or by ID but our API is /id)
    $response = Invoke-RestMethod -Uri "$baseUrl/$orderId" -Method Get
    if ($response.success) {
        $order = $response.data
        Write-Host "Order Found: $($order.id)"
        Write-Host "Customer: $($order.customer)"
        Write-Host "Email: $($order.email)"
        
        if ($order.email -eq "uat_test_final@rodela.com") {
            Write-Host "SUCCESS: Order is linked to the correct user!" -ForegroundColor Green
        }
        else {
            Write-Host "FAILURE: Order email mismatch or missing. Got: '$($order.email)'" -ForegroundColor Red
        }
    }
    else {
        Write-Host "Failed to find order: $($response.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
