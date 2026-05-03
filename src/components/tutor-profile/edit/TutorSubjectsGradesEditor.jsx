import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-white/10";

function newKey() {
  return `sg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function modelToLocal(rowsModel) {
  if (!rowsModel?.length) {
    return [{ key: newKey(), subject: "", gradesText: "" }];
  }
  return rowsModel.map((r) => ({
    key: newKey(),
    subject: r.subject ?? "",
    gradesText: Array.isArray(r.grades) ? r.grades.join(", ") : "",
  }));
}

function localToModel(local) {
  return local
    .map((r) => ({
      subject: r.subject.trim(),
      grades: r.gradesText
        .split(/[,;|]/)
        .map((g) => g.trim())
        .filter(Boolean),
    }))
    .filter((r) => r.subject || r.grades.length > 0);
}

export default function TutorSubjectsGradesEditor({
  rowsModel,
  onModelChange,
  disabled,
  resetKey,
}) {
  const [local, setLocal] = useState(() => modelToLocal(rowsModel));

  useEffect(() => {
    setLocal(modelToLocal(rowsModel));
  }, [resetKey]);

  const emit = (nextLocal) => {
    setLocal(nextLocal);
    onModelChange(localToModel(nextLocal));
  };

  const updateRow = (key, field, val) => {
    const next = local.map((r) => (r.key === key ? { ...r, [field]: val } : r));
    emit(next);
  };

  const addRow = () => {
    emit([...local, { key: newKey(), subject: "", gradesText: "" }]);
  };

  const removeRow = (key) => {
    const next = local.filter((r) => r.key !== key);
    emit(next.length ? next : [{ key: newKey(), subject: "", gradesText: "" }]);
  };

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-white/10">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white">
            <BookOpen size={16} />
          </span>
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">
              Subjects & Grades
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each subject and grade levels (comma-separated, e.g. O/L, A/L,
              Grade 9).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addRow}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus size={14} /> Add row
        </button>
      </header>

      <ul className="space-y-3">
        {local.map((row) => (
          <li
            key={row.key}
            className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto] dark:bg-slate-800"
          >
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Subject
              <input
                value={row.subject}
                onChange={(e) => updateRow(row.key, "subject", e.target.value)}
                disabled={disabled}
                placeholder="e.g. Mathematics"
                maxLength={120}
                className={`${inputClass} mt-1`}
              />
            </label>
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Grades / levels
              <input
                value={row.gradesText}
                onChange={(e) =>
                  updateRow(row.key, "gradesText", e.target.value)
                }
                disabled={disabled}
                placeholder="e.g. O/L, A/L, Grade 10"
                className={`${inputClass} mt-1`}
              />
            </label>
            <div className="flex items-end justify-end md:pb-0.5">
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                disabled={disabled || local.length < 2}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200/80 text-rose-600 transition hover:bg-rose-50 disabled:opacity-40 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                aria-label="Remove row"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
