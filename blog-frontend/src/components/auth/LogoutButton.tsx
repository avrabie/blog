export function LogoutButton() {
  return (
    <form action="/logout" method="POST" style={{ display: 'inline' }}>
      <button type="submit" className="glass-button text-brand-primary">
        Logout
      </button>
    </form>
  );
}
