$baseUrl = "http://localhost:9002"

Write-Host "1. Testing Database Connection and Seeding..."
try {
    $seedResponse = Invoke-RestMethod -Uri "$baseUrl/api/seed" -Method Post
    Write-Host "   Success: $($seedResponse.message)" -ForegroundColor Green
}
catch {
    Write-Host "   Error: Failed to call /api/seed. Is the server running?" -ForegroundColor Red
    Write-Host "   Details: $_"
}

Write-Host "`n2. Testing GET /api/products..."
try {
    $productsResponse = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get
    if ($productsResponse.success) {
        $count = $productsResponse.data.Count
        Write-Host "   Success: Retrieved $count products" -ForegroundColor Green
        if ($count -gt 0) {
            Write-Host "   Sample Product: $($productsResponse.data[0].name)" -ForegroundColor Gray
        }
        else {
            Write-Host "   Warning: No products found despite seeing success." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   Failed: $($productsResponse.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   Error: Failed to fetch products" -ForegroundColor Red
    Write-Host "   Details: $_"
}

Write-Host "`n3. Manual UI Verification Steps:"
Write-Host "   - Open http://localhost:3000 in your browser."
Write-Host "   - Verify that the Product Catalog loads with a spinner initially."
Write-Host "   - Verify that products appear after loading."
Write-Host "   - Check Browser DevTools > Network tab to see the fetch request to /api/products."
