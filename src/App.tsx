/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

type FormData = {
  fullName: string;
  age: string;
  role: string;
  skills: string[];
  startDate: string;
  bio: string;
  agree: boolean;
};

export default function Home() {
  const [view, setView] = useState<'form' | 'table'>('form'); // 'form' or 'table'
  const [submissions, setSubmissions] = useState(sampleSubmissions);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    age: '',
    role: '',
    skills: [],
    startDate: '',
    bio: '',
    agree: false,
  });

  function handleInput(e: React.ChangeEvent<any>) {
    const { name, value, type, checked, options } = e.target;

    if (type === 'select-multiple') {
      const values = Array.from(options as unknown as HTMLOptionsCollection)
        .filter((o: any) => o.selected)
        .map((o: any) => o.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!formData.fullName || formData.fullName.trim().length < 3) errors.fullName = 'Name must be at least 3 characters';
    if (!formData.age || Number(formData.age) <= 0) errors.age = 'Enter a valid age';
    if (!formData.role) errors.role = 'Please select a role';
    if (formData.skills.length === 0) errors.skills = 'Select at least one skill';
    if (!formData.startDate) errors.startDate = 'Start date required';
    if (!formData.agree) errors.agree = 'You must agree to the terms';
    return errors;
  }

  interface Submission {
    id: string;
    createdAt: string;
    data: FormData;
  }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length) {
      alert(Object.values(errors).join("\n"));
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      data: { ...formData },
    };

    setSubmissions([newSubmission, ...submissions]);
    setFormData({
      fullName: "",
      age: "",
      role: "",
      skills: [],
      startDate: "",
      bio: "",
      agree: false,
    });

    setLoading(false);
    setView("table");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header view={view} setView={setView} total={submissions.length} />

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Employee Onboarding (UI only)</h2>
                <div className="text-sm text-slate-500">Responsive • Tailwind • React</div>
              </div>

              {view === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormRow label="Full name" required>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInput}
                      placeholder="e.g. Aisha Khan"
                      className="w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
                    />
                  </FormRow>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormRow label="Age" required>
                      <input
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInput}
                        placeholder="e.g. 26"
                        className="w-full rounded-md border-gray-200 shadow-sm p-2"
                      />
                    </FormRow>

                    <FormRow label="Role" required>
                      <select name="role" value={formData.role} onChange={handleInput} className="w-full rounded-md p-2 border-gray-200">
                        <option value="">Choose role</option>
                        <option value="frontend">Frontend Developer</option>
                        <option value="backend">Backend Developer</option>
                        <option value="design">Designer</option>
                        <option value="pm">Product Manager</option>
                      </select>
                    </FormRow>
                  </div>

                  <FormRow label="Skills (multi-select)" required>
                    <select name="skills" value={formData.skills} onChange={handleInput} multiple className="w-full rounded-md p-2 h-32 border-gray-200">
                      <option value="react">React</option>
                      <option value="node">Node.js</option>
                      <option value="tailwind">Tailwind CSS</option>
                      <option value="sql">SQL</option>
                      <option value="figma">Figma</option>
                    </select>
                    <div className="text-xs text-slate-500 mt-1">Hold Ctrl / Cmd to select multiple.</div>
                  </FormRow>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormRow label="Start date" required>
                      <input name="startDate" type="date" value={formData.startDate} onChange={handleInput} className="w-full rounded-md p-2 border-gray-200" />
                    </FormRow>

                    <FormRow label="Agree to terms" required>
                      <label className="inline-flex items-center space-x-2">
                        <input type="checkbox" name="agree" checked={formData.agree} onChange={handleInput} className="form-checkbox h-5 w-5 rounded" />
                        <span className="text-sm text-slate-700">I agree</span>
                      </label>
                    </FormRow>
                  </div>

                  <FormRow label="Bio">
                    <textarea name="bio" value={formData.bio} onChange={handleInput} rows={4} placeholder="Short bio..." className="w-full rounded-md p-2 border-gray-200" />
                  </FormRow>

                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:opacity-95 disabled:opacity-60">
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button type="button" onClick={() => setFormData({ fullName: '', age: '', role: '', skills: [], startDate: '', bio: '', agree: false })} className="px-3 py-2 border rounded">
                      Clear
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-sm text-slate-600">Switch to the Table view to see submissions and pagination UI.</div>
              )}
            </Card>
          </section>

          <aside className="lg:col-span-5">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Submissions</h3>
                <div className="text-sm text-slate-500">Total: {submissions.length}</div>
              </div>

              <div className="space-y-3">
                <div className="overflow-auto max-h-96">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2">ID</th>
                        <th className="text-left px-3 py-2">Created</th>
                        <th className="text-left px-3 py-2">Name</th>
                        <th className="text-left px-3 py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s) => (
                        <tr key={s.id} className="border-b last:border-b-0 hover:bg-white/60">
                          <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                          <td className="px-3 py-2">{new Date(s.createdAt).toLocaleString()}</td>
                          <td className="px-3 py-2">{s.data.fullName || '—'}</td>
                          <td className="px-3 py-2">{s.data.role || '—'}</td>
                        </tr>
                      ))}
                      {submissions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-500">No submissions yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">Showing {Math.min(5, submissions.length)} of {submissions.length}</div>
                  <div className="space-x-2">
                    <button onClick={() => alert('Previous (demo)')} className="px-3 py-1 border rounded">Prev</button>
                    <button onClick={() => alert('Next (demo)')} className="px-3 py-1 border rounded">Next</button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mt-4">
              <h4 className="font-medium mb-2">Responsive Tips</h4>
              <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                <li>Use grid utilities (grid-cols-*) to adapt to screen sizes.</li>
                <li>Keep tables horizontally scrollable on small screens (overflow-auto).</li>
                <li>Prefer stacked form fields on mobile (one column) — use multi-column for larger screens.</li>
              </ul>
            </Card>
          </aside>
        </main>

        <footer className="mt-8 text-center text-sm text-slate-500">UI-only demo • Drop-in component for your React + Tailwind project</footer>
      </div>
    </div>
  );
}

function Header({ view, setView, total }: { view: 'form' | 'table'; setView: React.Dispatch<React.SetStateAction<'form' | 'table'>>; total: number }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">M</div>
        <div>
          <div className="text-lg font-semibold">MatBook UI</div>
          <div className="text-xs text-slate-500">Employee onboarding — UI only</div>
        </div>
      </div>

      <nav className="flex items-center gap-3">
        <button onClick={() => setView('form')} className={`px-3 py-2 rounded ${view === 'form' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}>
          Form
        </button>
        <button onClick={() => setView('table')} className={`px-3 py-2 rounded ${view === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'}`}>
          Table <span className="ml-2 inline-block bg-slate-100 px-2 py-0.5 text-xs rounded">{total}</span>
        </button>
      </nav>
    </header>
  );
}

function Card({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}>{children}</div>;
}

function FormRow({ label, required = false, children }: { label: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

const sampleSubmissions = [
  {
    id: 'a1b2c3d',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    data: { fullName: 'Riya Sharma', role: 'frontend' },
  },
  {
    id: 'z9y8x7w',
    createdAt: new Date().toISOString(),
    data: { fullName: 'Arjun Patel', role: 'backend' },
  },
];




