# Test Reject and Delete Functions
Write-Output "========================================="
Write-Output "Testing Reject and Delete Functions"
Write-Output "========================================="
Write-Output ""

# Step 1: Create quotation
Write-Output "Step 1: Creating quotation..."
$createBody = @{
    customerId = "999"
    companyName = "Test Reject Company"
    contactPerson = "Test User"
    email = "testreject@test.com"
    phone = "1234567890"
    items = @(
        @{
            productId = 1
            quantity = 1
        }
    )
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/quotations" -Method POST -Body $createBody -ContentType "application/json"
    $quotationId = $createResponse.id
    Write-Output "  ✅ Created quotation ID: $quotationId (Status: $($createResponse.status))"
} catch {
    Write-Output "  ❌ Failed to create quotation"
    exit
}

# Step 2: Send quotation (DRAFT -> SENT)
Write-Output ""
Write-Output "Step 2: Sending quotation..."
Start-Sleep -Seconds 1

$sendBody = @{
    items = @(
        @{
            itemId = $createResponse.items[0].id
            unitPrice = 100.00
            discount = 10
        }
    )
} | ConvertTo-Json

try {
    $sendResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/quotations/$quotationId/send" -Method PUT -Body $sendBody -ContentType "application/json"
    Write-Output "  ✅ Sent quotation ID: $quotationId (Status: $($sendResponse.status))"
} catch {
    Write-Output "  ❌ Failed to send quotation: $($_.Exception.Message)"
    exit
}

# Step 3: Reject quotation (SENT -> REJECTED)
Write-Output ""
Write-Output "Step 3: Rejecting quotation..."
Start-Sleep -Seconds 1

try {
    $rejectResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/quotations/$quotationId/reject" -Method PUT -Body '"Price too high"' -ContentType "application/json"
    Write-Output "  ✅ Rejected quotation ID: $quotationId (Status: $($rejectResponse.status))"
} catch {
    Write-Output "  ❌ Failed to reject quotation: $($_.Exception.Message)"
    exit
}

# Step 4: Delete quotation
Write-Output ""
Write-Output "Step 4: Deleting quotation..."
Start-Sleep -Seconds 1

try {
    $deleteResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/quotations/$quotationId" -Method DELETE
    Write-Output "  ✅ Deleted quotation: $($deleteResponse.message)"
} catch {
    Write-Output "  ❌ Failed to delete quotation: $($_.Exception.Message)"
    exit
}

Write-Output ""
Write-Output "========================================="
Write-Output "✅ ALL TESTS PASSED!"
Write-Output "========================================="
Write-Output ""
Write-Output "Reject and Delete functions are working!"
