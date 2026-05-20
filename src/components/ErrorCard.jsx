export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="error-card">
      <span className="error-icon">⚠️</span>
      <p className="error-msg">{message}</p>
      <button className="retry-btn" onClick={onRetry}>Try Again</button>
    </div>
  );
}
