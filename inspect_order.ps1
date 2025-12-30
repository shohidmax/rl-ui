$baseUrl = "http://localhost:9002/api"
$orderId = "ORD-1766869728266-682" # From previous run

Write-Host "Fetching Order $orderId..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId" -Method Get
    if ($response.success) {
        Write-Host "Order Data:"
        $response.data | ConvertTo-Json -Depth 2
    }
    else {
        Write-Host "Failed: $($response.error)"
    }
}
catch {
    Write-Host "Error: $_"
}
