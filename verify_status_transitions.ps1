$baseUrl = "http://localhost:9002/api"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$rand = Get-Random
$userEmail = "trans_user_$timestamp`_$rand@example.com"
$adminEmail = "trans_admin_$timestamp`_$rand@example.com"

Write-Host "=== ORDER STATUS TRANSITION TEST ===" -ForegroundColor Cyan

# 1. SETUP
$u = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body (@{ name = "U"; email = $userEmail; password = "123" } | ConvertTo-Json) -ContentType "application/json"
$a = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body (@{ name = "A"; email = $adminEmail; password = "123" } | ConvertTo-Json) -ContentType "application/json"
# Make Admin
Invoke-RestMethod -Uri "$baseUrl/users" -Method Put -Body (@{ userId = $a.data._id; action = "update_role"; role = "admin" } | ConvertTo-Json) -ContentType "application/json" | Out-Null

# 2. PLACE ORDER (Pending)
$orderRes = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body (@{
        email = $userEmail; customer = "U"; phone = "1"; address = "A"; amount = 100;
        products = @(@{name = "P"; quantity = 1; price = 100 })
    } | ConvertTo-Json) -ContentType "application/json"
$orderId = $orderRes.data.id

Write-Host "Order Placed: $orderId (Default: Pending)"

# Verify visible in 'Pending' (To Pay) tab logic
$orders = Invoke-RestMethod -Uri "$baseUrl/orders?email=$userEmail" -Method Get
$o = $orders.data | Where-Object { $_.id -eq $orderId }
if ($o.status -eq "Pending") { Write-Host "   [OK] User sees status 'Pending'" -ForegroundColor Green }
else { Write-Host "   [FAIL] Order status mismatch" -ForegroundColor Red }

# 3. ADMIN UPDATES TO 'Shipped' (Simulating Admin Option)
Write-Host "`nAdmin updates to 'Shipped'..."
# Assuming Admin API uses PUT /api/orders or similar. 
# Wait, I need to check if there is an Admin API to update order status.
# I'll try PUT /api/orders (if implemented) or check the code.
# Based on previous sessions, OrderService.updateOrder exists, assuming logic is exposed.
$updateData = @{ id = $orderId; status = "Shipped" } | ConvertTo-Json
try {
    # Attempting common pattern or will check route file if fails
    $upRes = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Put -Body $updateData -ContentType "application/json" 
    if ($upRes.success -and $upRes.data.status -eq "Shipped") {
        Write-Host "   [OK] Admin update success." -ForegroundColor Green
    }
    else {
        Write-Host "   [FAIL] Admin update failed. $($upRes.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "   [FAIL] API call error: $_" -ForegroundColor Red
}

# 4. VERIFY USER SEES 'Shipped'
$orders2 = Invoke-RestMethod -Uri "$baseUrl/orders?email=$userEmail" -Method Get
$o2 = $orders2.data | Where-Object { $_.id -eq $orderId }
if ($o2.status -eq "Shipped") { Write-Host "   [OK] User now sees 'Shipped'" -ForegroundColor Green }
else { Write-Host "   [FAIL] User sees $($o2.status)" -ForegroundColor Red }

Write-Host "=== TEST COMPLETE ===" -ForegroundColor Cyan
