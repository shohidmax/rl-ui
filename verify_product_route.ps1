$baseUrl = "http://localhost:9002/api"
$testId = "TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"
$productData = @{
    name        = "API Test Product $testId"
    description = "A product created via automated API test"
    price       = 9999
    image       = "/images/products/test-image.jpg"
    images      = @("/images/products/test-1.jpg")
    category    = "Men"
    stock       = 100
    highlights  = "Automated Test"
    size        = "L"
} | ConvertTo-Json -Depth 3

Write-Host "1. Testing Product Creation (POST /api/products)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $productData -ContentType "application/json"
    if ($response.success -eq $true) {
        Write-Host "   [PASS] Product created successfully." -ForegroundColor Green
        $createdId = $response.data.id
        Write-Host "   Created ID: $createdId"
    }
    else {
        Write-Host "   [FAIL] Product creation failed. Response success was false." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "   [FAIL] POST Request failed. $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

Write-Host "2. Testing Product Retrieval (GET /api/products)..." -ForegroundColor Cyan
try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    if ($getResponse.success -eq $true) {
        Write-Host "   [PASS] Products retrieved successfully." -ForegroundColor Green
        
        $foundProduct = $getResponse.data | Where-Object { $_.id -eq $createdId }
        
        if ($foundProduct) {
            Write-Host "   [PASS] Created product found in list." -ForegroundColor Green
             
            if ($foundProduct.name -eq "API Test Product $testId") {
                Write-Host "   [PASS] Product Name matches." -ForegroundColor Green
            }
            else {
                Write-Host "   [FAIL] Product Name mismatch. Expected 'API Test Product $testId', got '$($foundProduct.name)'" -ForegroundColor Red
            }
             
            if ($foundProduct.category -eq "Men") {
                Write-Host "   [PASS] Product Category matches." -ForegroundColor Green
            }
            else {
                Write-Host "   [FAIL] Product Category mismatch. Expected 'Men', got '$($foundProduct.category)'" -ForegroundColor Red
            }

        }
        else {
            Write-Host "   [FAIL] Created product ID $createdId NOT found in list." -ForegroundColor Red
        }

    }
    else {
        Write-Host "   [FAIL] GET response success was false." -ForegroundColor Red
    }
}
catch {
    Write-Host "   [FAIL] GET Request failed. $_" -ForegroundColor Red
}

Write-Host "`nTest Sequence Completed." -ForegroundColor Cyan
