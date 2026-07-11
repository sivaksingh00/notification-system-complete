export type Notification = {
  id: string;
  tenantId: string;
  userId: string | null;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  readAt: string | null;
};

export type Identity = { tenantId: string; userId: string };

const API_URL = 'http://localhost:4000';

function headers(identity: Identity) {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Id': identity.tenantId,
    'X-User-Id': identity.userId
  };
}

async function api<T>(path: string, identity: Identity, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers(identity), ...(options?.headers ?? {}) }
  });
  if (!response.ok) throw new Error((await response.json()).error ?? 'Request failed');
  return response.json() as Promise<T>;
}

export const notificationApi = {
  list: (identity: Identity) => api<{ items: Notification[] }>('/notifications?page=1&pageSize=20', identity),
  unreadCount: (identity: Identity) => api<{ count: number }>('/notifications/unread-count', identity),
  markRead: (identity: Identity, id: string) => api<Notification>(`/notifications/${id}/read`, identity, { method: 'PATCH' }),
  markAllRead: (identity: Identity) => api<{ updated: number }>('/notifications/read-all', identity, { method: 'PATCH' }),
  inviteMember: (identity: Identity, memberName: string, agencyName: string) =>
    api('/demo/member-invited', identity, { method: 'POST', body: JSON.stringify({ memberName, agencyName }) }),
  creatorReply: (identity: Identity, creatorName: string) =>
    api('/demo/creator-replied', identity, { method: 'POST', body: JSON.stringify({ creatorName, assignedUserId: identity.userId }) })
};
