# Integration Write-up

This project demonstrates a tenant-aware notification system that can be integrated into an existing CRM product. The current implementation uses the `X-Tenant-Id` and `X-User-Id` request headers as trusted identity values. In a production system, I would replace this simplified approach with the product’s existing authentication system. After validating the user’s JWT or session, backend middleware would extract the authenticated `tenantId` and `userId` and attach them to the request. This would prevent users from manually changing headers to access another tenant’s information.

I would keep the existing notification model and most of the API behaviour because it already supports tenant-wide and user-specific notifications, unread counts, pagination, mark-as-read, and mark-all-read operations. Every read or update query would continue to include the authenticated tenant ID so that one tenant could never view or modify another tenant’s notifications.

For notification creation, I would not allow frontend clients to directly create important system notifications. Instead, existing product modules such as campaigns, messaging, reports, and team management would publish domain events such as `creator_replied`, `report_ready`, or `member_invited`. A notification service or background worker would consume these events and create the correct notification. This keeps notification creation reusable and prevents it from being tightly coupled to a single feature.

The existing product database could either contain the notification table directly or the notification service could use a separate database. For a smaller product, I would keep it in the existing database to reduce operational complexity. For a larger system, I would consider a separate notification service backed by a message queue such as RabbitMQ, Kafka, or a cloud queue. The queue would provide retry handling and prevent notification processing from slowing down the main product workflow.

The current frontend polling approach is suitable for this challenge. In production, I would initially keep polling as a reliable fallback, but add Server-Sent Events or WebSockets for faster notification delivery. I would also add delivery channels such as email, SMS, and push notifications, along with per-user notification preferences.

With more time, I would add stronger authentication, role-based permissions, automated API and tenant-isolation tests, retry and failure handling, notification retention rules, rate limiting, structured monitoring, and support for real-time delivery.
