export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const btn = 'w-9 h-9 flex items-center justify-center rounded-lg border border-[#e2e7ee] text-[#5a6678] transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[#1d4ed8]/10 enabled:hover:text-[#1d4ed8]'

  return (
    <div className="flex items-center justify-center gap-3 mt-4 pt-3">
      {/* הקודם */}
      <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="העמוד הקודם">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m9 18 6-6-6-6" /></svg>
      </button>

      <span className="text-sm text-[#5a6678]">
        עמוד <b className="text-[#0d1b2e] font-bold">{page}</b> מתוך {pageCount}
      </span>

      {/* הבא */}
      <button className={btn} disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="העמוד הבא">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6" /></svg>
      </button>
    </div>
  )
}
