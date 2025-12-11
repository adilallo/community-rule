export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F3F1] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--color-content-default-primary)] mb-4">
          404
        </h1>
        <p className="text-[var(--color-content-default-secondary)]">
          Page Not Found
        </p>
      </div>
    </div>
  );
}
