import { useState, useRef } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-wrapper">
        <span className="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city…"
          className="search-input"
          disabled={loading}
        />
        <button type="submit" className="search-btn" disabled={loading || !input.trim()}>
          {loading ? <span className="spin">◌</span> : "Go"}
        </button>
      </div>
    </form>
  );
}
