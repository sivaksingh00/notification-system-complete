import { Bell, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Identity, Notification } from '../api/notifications';

interface Props {
  identity: Identity;
  notifications: Notification[];
  unreadCount: number;
  open: boolean;
  loading: boolean;
  onToggle: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationBell(props: Props) {
  return (
    <div className="bell-wrap">
      <button className="bell-button" aria-label="Open notifications" onClick={props.onToggle}>
        <Bell size={24} />
        {props.unreadCount > 0 && <span className="badge">{props.unreadCount > 99 ? '99+' : props.unreadCount}</span>}
      </button>

      {props.open && (
        <section className="panel">
          <header className="panel-header">
            <div>
              <strong>Notifications</strong>
              <small>{props.identity.tenantId} · {props.identity.userId}</small>
            </div>
            <button className="text-button" onClick={props.onMarkAllRead} disabled={props.unreadCount === 0}>
              <CheckCheck size={16} /> Mark all read
            </button>
          </header>

          <div className="notification-list">
            {props.loading && <p className="empty">Loading…</p>}
            {!props.loading && props.notifications.length === 0 && <p className="empty">No notifications yet.</p>}
            {props.notifications.map((notification) => (
              <button
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && props.onMarkRead(notification.id)}
              >
                <span className="dot" aria-hidden="true" />
                <span className="notification-content">
                  <strong>{notification.title}</strong>
                  <span>{notification.body}</span>
                  <small>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
