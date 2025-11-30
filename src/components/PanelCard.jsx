export default function PanelCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}