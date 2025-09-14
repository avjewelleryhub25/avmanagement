export default function Button({ children, onClick, variant = "primary", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
        variant === "primary"
          ? "bg-jewelGold text-white hover:bg-amber-600"
          : variant === "secondary"
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "border border-jewelGold text-jewelGold hover:bg-jewelGold hover:text-white"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}