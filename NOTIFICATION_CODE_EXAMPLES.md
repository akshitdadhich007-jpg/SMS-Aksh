# Code Examples & API Reference

## Component Import & Usage

### In AdminLayout.jsx
```jsx
import NotificationPanel from '../components/ui/NotificationPanel';

export const AdminLayout = () => {
  return (
    <div className="admin-body">
      <header className="topbar">
        <div className="topbar-right">
          <NotificationPanel />  {/* Drop-in component */}
          <div className="profile">/* ... */</div>
        </div>
      </header>
    </div>
  );
};
```

### In ResidentLayout.jsx
```jsx
import NotificationPanel from '../components/ui/NotificationPanel';

export const ResidentLayout = () => {
  return (
    <div className="admin-body">
      <header className="topbar">
        <div className="topbar-right">
          <NotificationPanel />  {/* Same component, different layout */}
          <div className="profile">/* ... */</div>
        </div>
      </header>
    </div>
  );
};
```

### In SecurityLayout.jsx
```jsx
import NotificationPanel from '../components/ui/NotificationPanel';

export const SecurityLayout = () => {
  return (
    <div className="security-body">
      <header className="topbar">
        <div className="topbar-right">
          <NotificationPanel />  {/* Reusable across all dashboards */}
          <div className="profile">/* ... */</div>
        </div>
      </header>
    </div>
  );
};
```

---

## Notification Data Examples

### Alert Type
```javascript
{
  id: 1,
  type: 'alert',
  title: 'Maintenance Alert',
  message: 'Water tank cleaning scheduled for tomorrow at 10 AM',
  timestamp: '5 minutes ago',
  read: false
}
```

### Info Type
```javascript
{
  id: 2,
  type: 'info',
  title: 'New Payment Received',
  message: 'Payment received from Apartment 102 for maintenance',
  timestamp: '1 hour ago',
  read: false
}
```

### Success Type
```javascript
{
  id: 3,
  type: 'success',
  title: 'Document Approved',
  message: 'Your budget proposal has been approved',
  timestamp: '2 hours ago',
  read: true
}
```

---

## Hook Usage Examples

### useState for State Management
```javascript
const [isOpen, setIsOpen] = useState(false);
const [notifications, setNotifications] = useState([...]);

// Toggle panel
onClick={() => setIsOpen(!isOpen)}

// Add notification
setNotifications([newNotif, ...notifications])

// Mark as read
setNotifications(notifications.map(n =>
  n.id === id ? { ...n, read: true } : n
))

// Delete notification
setNotifications(notifications.filter(n => n.id !== id))

// Clear all
setNotifications([])
```

### useEffect for Side Effects
```javascript
// Click-outside detection
useEffect(() => {
  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [isOpen]);

// ESC key handling
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }
}, [isOpen]);
```

### useRef for DOM Access
```javascript
const panelRef = useRef(null);
const buttonRef = useRef(null);

// Used in click-outside detection
if (panelRef.current && !panelRef.current.contains(event.target))

// No direct manipulation, just reference checking
```

---

## Event Handler Examples

### Toggle Panel
```javascript
const togglePanel = () => setIsOpen(!isOpen);

// Used in:
<button
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Notifications"
  aria-expanded={isOpen}
>
  Bell Icon
</button>
```

### Mark as Read
```javascript
const handleMarkAsRead = (id) => {
  setNotifications(notifications.map(notif =>
    notif.id === id 
      ? { ...notif, read: true } 
      : notif
  ));
};

// Used in:
<button
  className="action-btn mark-read"
  onClick={() => handleMarkAsRead(notif.id)}
  title="Mark as read"
>
  ✓
</button>
```

### Delete Notification
```javascript
const handleDeleteNotification = (id) => {
  setNotifications(
    notifications.filter(notif => notif.id !== id)
  );
};

// Used in:
<button
  className="action-btn delete"
  onClick={() => handleDeleteNotification(notif.id)}
  title="Delete notification"
>
  <X size={14} />
</button>
```

### Clear All
```javascript
const handleClearAll = () => {
  setNotifications([]);
  setIsOpen(false);
};

// Used in:
<button
  className="clear-all-btn"
  onClick={handleClearAll}
>
  Clear All
</button>
```

---

## Conditional Rendering Examples

### Badge Count Display
```javascript
{unreadCount > 0 && (
  <span className="notification-badge">
    {unreadCount > 9 ? '9+' : unreadCount}
  </span>
)}
```

### Empty State
```javascript
{notifications.length === 0 ? (
  <div className="empty-state">
    <Bell size={32} strokeWidth={1.5} />
    <p>No notifications yet</p>
  </div>
) : (
  <div className="notifications-list">
    {notifications.map((notif) => (
      {/* notification item */}
    ))}
  </div>
)}
```

### Dynamic Styling
```javascript
<div className={`notification-item ${notif.type} ${!notif.read ? 'unread' : ''}`}>
  {/* content */}
</div>
```

### Conditional Action Buttons
```javascript
{!notif.read && (
  <button
    className="action-btn mark-read"
    onClick={() => handleMarkAsRead(notif.id)}
  >
    ✓
  </button>
)}
<button
  className="action-btn delete"
  onClick={() => handleDeleteNotification(notif.id)}
>
  <X size={14} />
</button>
```

### Footer Visibility
```javascript
{notifications.length > 0 && (
  <div className="notification-footer">
    <button className="clear-all-btn" onClick={handleClearAll}>
      Clear All
    </button>
  </div>
)}
```

### Panel Visibility
```javascript
{isOpen && (
  <div ref={panelRef} className="notification-panel">
    {/* panel content */}
  </div>
)}

{isOpen && (
  <div className="notification-overlay" onClick={() => setIsOpen(false)} />
)}
```

---

## Icon Rendering Example

### Lucide React Icons
```javascript
import { Bell, X, AlertCircle, Info, CheckCircle } from 'lucide-react';

// Bell icon in button
<Bell size={20} strokeWidth={2} />

// Close icon in header
<X size={18} />

// Type-based icons
const getNotificationIcon = (type) => {
  switch (type) {
    case 'alert':
      return <AlertCircle size={18} />;
    case 'success':
      return <CheckCircle size={18} />;
    case 'info':
    default:
      return <Info size={18} />;
  }
};

// Usage in notification item
<div className="notification-icon">
  {getNotificationIcon(notif.type)}
</div>
```

---

## CSS Animation Examples

### Slide Down Animation
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-panel {
  animation: slideDown 0.2s ease-out;
}
```

### Pulse Badge Animation
```css
@keyframes pulse-badge {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 2px 12px rgba(239, 68, 68, 0.6);
  }
}

.notification-badge {
  animation: pulse-badge 2s ease-in-out infinite;
}
```

### Mobile Slide Up
```css
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .notification-panel {
    animation: slideUp 0.3s ease-out;
  }
}
```

---

## Accessibility (ARIA) Examples

### Button
```jsx
<button
  ref={buttonRef}
  className={`notification-btn ${isOpen ? 'active' : ''}`}
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Notifications"
  aria-expanded={isOpen}
>
  <Bell size={20} strokeWidth={2} />
</button>
```

### Panel Dialog
```jsx
<div
  ref={panelRef}
  className="notification-panel"
  role="dialog"
  aria-label="Notifications"
>
  {/* content */}
</div>
```

### Close Button
```jsx
<button
  className="close-btn"
  onClick={() => setIsOpen(false)}
  aria-label="Close notifications"
>
  <X size={18} />
</button>
```

### Action Buttons
```jsx
<button
  className="action-btn mark-read"
  onClick={() => handleMarkAsRead(notif.id)}
  title="Mark as read"
  aria-label="Mark as read"
>
  ✓
</button>

<button
  className="action-btn delete"
  onClick={() => handleDeleteNotification(notif.id)}
  title="Delete notification"
  aria-label="Delete notification"
>
  <X size={14} />
</button>
```

---

## CSS Custom Properties (Theme Support)

### Used in Topbar
```css
.topbar {
  background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
  color: white;
}
```

### Color Scheme for Notification Types
```css
/* Alert */
.notification-item.alert .notification-icon {
  background: #fef3c7;  /* Amber light */
  color: #d97706;       /* Amber dark */
}

/* Info */
.notification-item.info .notification-icon {
  background: #dbeafe;  /* Blue light */
  color: #2563eb;       /* Blue dark */
}

/* Success */
.notification-item.success .notification-icon {
  background: #dcfce7;  /* Green light */
  color: #16a34a;       /* Green dark */
}
```

---

## Browser DevTools Debugging

### Check Component State
```javascript
// Open browser console and:
// 1. Click the notification bell
// 2. Open DevTools → React Developer Tools
// 3. Select <NotificationPanel> component
// 4. View state in props panel
```

### Check CSS Animations
```javascript
// Open DevTools → Animations panel
// 1. Click bell to open panel
// 2. See slideDown animation
// 3. Check animation timing and easing
```

### Check Event Listeners
```javascript
// Open DevTools → Elements panel
// 1. Select .notification-panel element
// 2. Right-click → Break on → subtree modifications
// 3. Trigger close event
// 4. Debugger pauses at event
```

---

## Performance Optimization Tips

### Memoization (if needed for large lists)
```javascript
const NotificationItem = React.memo(({ notif }) => (
  <div className={`notification-item ${notif.type}`}>
    {/* item content */}
  </div>
));

// Then in list:
{notifications.map((notif) => (
  <NotificationItem key={notif.id} notif={notif} />
))}
```

### useCallback for handlers (optional)
```javascript
const handleMarkAsRead = useCallback((id) => {
  setNotifications(notifications.map(notif =>
    notif.id === id ? { ...notif, read: true } : notif
  ));
}, [notifications]);
```

### useMemo for calculations (optional)
```javascript
const unreadCount = useMemo(
  () => notifications.filter(n => !n.read).length,
  [notifications]
);
```

---

## Testing Code Examples

### Unit Test (Jest)
```javascript
describe('NotificationPanel', () => {
  test('opens panel on button click', () => {
    const { getByRole } = render(<NotificationPanel />);
    const button = getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    
    const panel = getByRole('dialog', { name: /notifications/i });
    expect(panel).toBeInTheDocument();
  });

  test('closes panel on ESC key', () => {
    const { getByRole, queryByRole } = render(<NotificationPanel />);
    const button = getByRole('button', { name: /notifications/i });
    
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

---

**All examples are production-ready and follow React best practices!**
