# Tax Compliance

> [!IMPORTANT]
> This document outlines the general tax compliance measures for the BrandAI SaaS platform. It is not legal advice. Consult with a qualified tax professional for specific obligations.

## 1. Value Added Tax (VAT) / PPN (Pajak Pertambahan Nilai)

As a digital service provider in Indonesia (or selling to Indonesian customers), BrandAI must comply with PPN regulations (PMSE - Perdagangan Melalui Sistem Elektronik).

### Current Implementation Status

-  **Subscription Services**: Subject to 11% PPN.
-  **Credit Purchases**: Subject to 11% PPN.

### Handling PPN

-  **Prices**: Display prices clearly stating if they are inclusive or exclusive of VAT. Recommended: _Prices shown include PPN 11%_.
-  **Calculation**:
   ```typescript
   const basePrice = 100000;
   const taxRate = 0.11;
   const totalAmount = basePrice * (1 + taxRate);
   ```

## 2. Invoicing

Every transaction must generate a proper invoice/receipt for the customer.

### Invoice Requirements

-  **Merchant Name**: BrandAI (Legal Entity Name).
-  **Customer Info**: Name and Email (NPWP if available for B2B).
-  **Transaction Details**: Date, Order ID, Item Description.
-  **Amounts**: Subtotal, Tax Amount (PPN), Total Paid.

### Automated Workflow

1. User completes payment via Midtrans.
2. System calls `generateInvoice(transactionId)`.
3. PDF Invoice is emailed to the user (Future Feature - currently Transaction History serves as proof).

## 3. Financial Reporting

Monthly reports are required to calculate the total tax collected and revenue generated.

### Report Structure

| Date       | Order ID | Gross Amount | Net Revenue | Tax Collected (PPN) | Payment Method | Status  |
| ---------- | -------- | ------------ | ----------- | ------------------- | -------------- | ------- |
| YYYY-MM-DD | ORD-001  | 111,000      | 100,000     | 11,000              | QRIS           | Success |

### Data Retention

-  Transaction records are stored in the `transactions` table securely.
-  Records should be retained for a minimum of **5 years** to comply with Indonesian tax audit regulations.

## 4. Withholding Tax (PPh 23) - B2B Only

If selling to corporate clients (B2B):

-  Clients may deduct PPh 23 (2%) from the payment for "Jasa Teknik/Manajemen/Jasa Lain".
-  **Action**: Provide BrandAI's NPWP to corporate clients so they can issue the Bukti Potong (Withholding Tax Slip).
