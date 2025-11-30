export default function SendButton({ 
  children, 
  type = "button", 
  onClick, 
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-2 rounded-lg transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
