export default function SectionBadge({ id, label }: { id: string; label: string }) {
  return (
    <div className="section-badge-row">
      <span className="kicker">{label}</span>
      <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
        ({id})
      </span>
    </div>
  );
}
