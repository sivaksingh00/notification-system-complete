# What I'd Do Differently With More Time

Given additional development time, I would improve the notification system in the following areas:

1. **Real-time Notifications**
   - Replace frontend polling with WebSockets or Server-Sent Events (SSE) so users receive notifications instantly without waiting for the polling interval.

2. **Production Authentication**
   - Replace the simplified `X-Tenant-Id` and `X-User-Id` headers with JWT-based authentication and authorization middleware integrated with the application's existing identity provider.

3. **Event-Driven Architecture**
   - Introduce an event bus or message queue (Kafka, RabbitMQ, or similar) so notification creation is asynchronous, reliable, and decoupled from business logic.

4. **Notification Preferences**
   - Allow users to configure which notification types they want to receive and through which channels (in-app, email, SMS, or push notifications).

5. **Automated Testing**
   - Add comprehensive unit tests, integration tests, and end-to-end API tests, with particular focus on tenant isolation and authorization.

6. **Performance Improvements**
   - Optimize database queries, introduce caching for unread counts, and add indexing to improve scalability for large numbers of notifications.

7. **Monitoring and Observability**
   - Add structured logging, metrics, and error monitoring using tools such as Sentry, Prometheus, or Grafana to improve production debugging and reliability.

8. **Enhanced User Experience**
   - Add filtering, search, notification categories, pagination improvements, infinite scrolling, and richer notification actions to improve usability.