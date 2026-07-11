import { useCallback, useEffect, useState } from 'react';
import { NotificationBell } from './components/NotificationBell';
import { notificationApi, type Identity, type Notification } from './api/notifications';
import './styles.css';

export default function App() {
  const [identity, setIdentity] = useState<Identity>({ tenantId: 't1', userId: 'u1' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    try {
      const [list, unread] = await Promise.all([
        notificationApi.list(identity),
        notificationApi.unreadCount(identity)
      ]);
      setNotifications(list.items);
      setUnreadCount(unread.count);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, [identity]);

  useEffect(() => {
    setLoading(true);
    void refresh();
    const timer = window.setInterval(() => void refresh(), 20_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  async function markRead(id: string) {
    await notificationApi.markRead(identity, id);
    await refresh();
  }

  async function markAllRead() {
    await notificationApi.markAllRead(identity);
    await refresh();
  }

  async function triggerMemberInvite() {
    await notificationApi.inviteMember(identity, 'Aarav', identity.tenantId === 't1' ? 'Nova Talent' : 'Bright Star Agency');
    await refresh();
  }

  async function triggerCreatorReply() {
    await notificationApi.creatorReply(identity, 'Meera Kapoor');
    await refresh();
  }

  return (
    <main>
      <nav className="topbar">
        <div className="brand">Nova CRM</div>
        <NotificationBell
          identity={identity}
          notifications={notifications}
          unreadCount={unreadCount}
          open={open}
          loading={loading}
          onToggle={() => setOpen((value) => !value)}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />
      </nav>

      <section className="hero">
        <p className="eyebrow">FULL-STACK CHALLENGE DEMO</p>
        <h1>Tenant-aware notification pipeline</h1>
        <p>Trigger an event, let the backend create a reusable notification, then view and manage it from the bell.</p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Current identity</h2>
          <label>Tenant ID<input value={identity.tenantId} onChange={(e) => setIdentity({ ...identity, tenantId: e.target.value })} /></label>
          <label>User ID<input value={identity.userId} onChange={(e) => setIdentity({ ...identity, userId: e.target.value })} /></label>
          <p className="hint">Try t1/u1 and t2/u2 to demonstrate tenant isolation.</p>
        </article>

        <article className="card">
          <h2>Demo triggers</h2>
          <button className="primary" onClick={triggerMemberInvite}>Simulate member invited</button>
          <button className="secondary" onClick={triggerCreatorReply}>Simulate creator replied</button>
          <p className="hint">Member invite is tenant-wide. Creator reply is addressed only to the current user.</p>
        </article>

        <article className="card stats">
          <h2>Current result</h2>
          <strong>{unreadCount}</strong>
          <span>unread notifications</span>
          <button className="secondary" onClick={refresh}>Refresh now</button>
        </article>
      </section>

      {message && <p className="error">{message}</p>}
    </main>
  );
}
