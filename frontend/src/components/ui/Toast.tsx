

export function Toast({ message, type = "info", onClose }: { message: string; type?: "success" | "error" | "info"; onClose: () => void }) {
  const color =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";
  return (
    <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded shadow-lg text-white ${color} animate-fade-in`}
      role="alert"
    >
      <span>{message}</span>
      <button className="ml-4 font-bold" onClick={onClose}>✕</button>
    </div>
  );
}
