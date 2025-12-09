export default function Card({ icon: Icon, title, subtitle, children, className = "", ...props }) {
  return (
    <div
      {...props}
      className={`relative z-10 rounded-2xl p-6 sm:p-8 w-full ${className}`}
    >
      {Icon && (
        <div className="mx-auto bg-indigo-100 text-indigo-600 p-4 w-14 h-14 flex items-center justify-center rounded-full mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}

      {title && <h2 className="text-lg font-semibold mb-1 text-center">{title}</h2>}

      {subtitle && <p className="text-gray-500 text-sm mb-6 text-center">{subtitle}</p>}

      {children}
    </div>
  );
}
