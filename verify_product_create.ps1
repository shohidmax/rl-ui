$baseUrl = "http://localhost:9002/api"

$productData = @{
    name        = "Test Product New"
    description = "A great new product"
    price       = 1500
    image       = "/images/products/new-shirt.jpg"
    images      = @("/images/products/new-shirt-1.jpg", "/images/products/new-shirt-2.jpg")
    category    = "Men"
    stock       = 50
    highlights  = "New Arrival, Premium Quality"
    size        = "M, L, XL"
} | ConvertTo-Json -Depth 3

Write-Host "Creating Product..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $productData -ContentType "application/json"
    Write-Host "Response Status: 201 Created (Assumed if no error)"
    Write-Host "Product ID: $($response.data.id)"
    Write-Host "Product Name: $($response.data.name)"
}
catch {
    Write-Host "Failed to create product. $_"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorBody = $reader.ReadToEnd()
    Write-Host "Error Body: $errorBody"
    exit 1
}
