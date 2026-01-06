# Penetration Testing Checklist

> [!WARNING]
> This checklist is for authorized security testing only. Unapproved testing against production systems is prohibited.

## 1. Authentication & Authorization

-  [x] **Weak Passwords**: Verify that the system enforces strong password policies.
-  [x] **Brute Force Protection**: Check if rate limiting is enabled on `/api/auth/*` endpoints.
-  [x] **Session Management**: Ensure session tokens (cookies) are HttpOnly and Secure.
-  [ ] **IDOR (Insecure Direct Object References)**:
   -  [ ] Can User A view User B's brands?
   -  [ ] Can User A download User B's generated logos?
   -  [ ] Can User A view User B's transaction history?
-  [ ] **Privilege Escalation**: Can a regular user access Admin API endpoints (e.g., `/api/admin/*`)?

## 2. Input Validation (Injection Attacks)

-  [x] **SQL Injection**: Test search bars and ID parameters (Drizzle ORM helps, but check raw queries).
-  [ ] **XSS (Cross-Site Scripting)**:
   -  [ ] Test Brand Name and Tagline inputs with script tags `<script>alert(1)</script>`.
   -  [ ] Check if user input is properly escaped in the dashboard.
-  [ ] **Command Injection**: Ensure the Image Vectorizer service (`@neplex/vectorizer`) doesn't execute arbitrary shell commands via filenames or metadata.

## 3. Business Logic & Payments

-  [x] **Price Manipulation**: Intercept requests to change the `amount` before sending to Midtrans.
-  [x] **Credit Bypass**: Attempt to generate logos without sufficient credits.
-  [x] **Webhook Spoofing**: Send fake success payloads to the Midtrans webhook endpoint (`/api/webhooks/midtrans`). _Verify signature validation works._
-  [ ] **Race Conditions**: fast-click "Generate" or "Purchase" buttons to see if credits/transactions are double-counted.

## 4. Info Disclosure

-  [ ] **Error Handling**: Do API errors leak stack traces or database structure?
-  [ ] **Sensitive Files**: Check for exposure of `.env`, `.git/`, or backup files via the web server.
-  [ ] **Metadata**: Ensure API responses don't leak unrelated user data.

## 5. Dependency Safety

-  [ ] **Audit**: Run `npm audit` to check for known vulnerabilities in `package.json`.
-  [ ] **Outdated Packages**: specific check for `next`, `next-auth`, and image processing libraries.
