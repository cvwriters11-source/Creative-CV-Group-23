export const metadata = { title: "Reviews" };

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Reviews</h1>
      <p className="mt-1 text-sm text-slate-500">Client reviews will appear here once this inbox is connected.</p>
      <div className="mt-6 rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        No reviews yet.
      </div>
    </div>
  );
}
