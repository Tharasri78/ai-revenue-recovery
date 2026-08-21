# Authentication and RBAC architecture

This frontend is intentionally designed as a demo-only implementation layer. It represents the expected production architecture without implementing production security.

## Intended production flow

Authentication
↓
JWT or secure server session
↓
Role extraction from session
↓
RBAC permission evaluation
↓
Merchant ownership checks
↓
Backend-enforced resource authorization

## Roles

### MERCHANT

- Main user of the merchant dashboard.
- Can access merchant-owned dashboards, transactions, policies, analytics, audit logs, and settings.
- Owns merchant-specific business data and configuration.

### ADMIN

- Platform-level operator.
- Has elevated access across platform resources.
- Not implemented as a full dashboard yet, but the auth model is structured to support it.

### CUSTOMER

- Payment/customer side of the application.
- Must not access merchant dashboard routes.
- Customer-specific payment/recovery experiences are intentionally outside the merchant dashboard.

## Merchant data isolation

Every merchant-owned resource should conceptually include a merchantId field.

Examples:

- Transaction
- RecoveryCase
- Policy
- AuditLog
- AnalyticsData

The frontend service layer is designed to model that contract, but the backend must derive the merchant identity from the authenticated user/session and enforce ownership on every resource access.

TODO: Backend must derive merchantId from authenticated user/session and enforce resource ownership.

## Why frontend checks are not security

The frontend route guards are only a UX safeguard.
They help redirect users away from merchant-only screens, but they do not provide real security.

Real authorization MUST be enforced in the backend by validating:

- authenticated session
- user role
- merchant ownership
- resource-level permissions

## Future identity verification

The frontend demo flow does not implement:

- password hashing
- JWT issuance
- email verification
- database-backed identity persistence
- payment gateway verification
- KYC/KYB approval flows

These will be added in the backend phase.

## Future backend contract

Planned endpoints:

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/verify-email

Merchant endpoints will eventually enforce authorization using the authenticated user context.

## Security principles

- Role extraction happens on the backend.
- Merchant ownership must be enforced server-side.
- Frontend route checks are for UX only.
- Dashboard features must not rely on client-side merchantId selection as a security mechanism.
