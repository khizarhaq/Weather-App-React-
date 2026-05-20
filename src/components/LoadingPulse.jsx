export default function LoadingPulse() {
  return (
    <div className="loading-state">
      <div className="loader-rings">
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
      </div>
      <p className="loading-text">Fetching weather…</p>
    </div>
  );
}
