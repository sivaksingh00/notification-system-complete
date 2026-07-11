# Postman request checklist

Use environment variables:
- `baseUrl` = `http://localhost:4000`
- `tenantId` = `t1`
- `userId` = `u1`

Add headers to every request:
- `X-Tenant-Id: {{tenantId}}`
- `X-User-Id: {{userId}}`

Requests:
1. `GET {{baseUrl}}/notifications?page=1&pageSize=10`
2. `GET {{baseUrl}}/notifications/unread-count`
3. `PATCH {{baseUrl}}/notifications/n1/read`
4. `PATCH {{baseUrl}}/notifications/read-all`
5. `POST {{baseUrl}}/notifications` with JSON `{ "userId": null, "type": "custom", "title": "Custom notification", "body": "Created from Postman" }`
6. `POST {{baseUrl}}/demo/member-invited` with JSON `{ "memberName": "Aarav", "agencyName": "Nova Talent" }`
7. `POST {{baseUrl}}/demo/creator-replied` with JSON `{ "creatorName": "Meera Kapoor", "assignedUserId": "u1" }`
8. Change tenant to `t1` and try `PATCH {{baseUrl}}/notifications/n4/read`; expect `404`.
