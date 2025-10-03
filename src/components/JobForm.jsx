import React, { useState } from 'react';
import { API } from '../api.js';

function toLocalInputValue(date = new Date()) {
  const pad = (n) => n.toString().padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

const empty = {
  id: '',
  companyName: '',
  jobTitle: '',
  jobDescriptionText: '',
  dateApplied: toLocalInputValue(new Date()),
  status: 'Applied',
  notes: '',
  jdFile: null,
  resumeFile: null,
};

export default function JobForm({ onSaved }) {
  const [form, setForm] = useState(empty);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) setForm(f => ({ ...f, [name]: files[0] }));
    else setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('companyName', form.companyName);
    fd.append('jobTitle', form.jobTitle);
    fd.append('jobDescriptionText', form.jobDescriptionText);
    // Convert local input (no timezone) to UTC ISO for storage
    fd.append('dateApplied', new Date(form.dateApplied).toISOString());
    fd.append('status', form.status);
    fd.append('notes', form.notes);
    if (form.jdFile) fd.append('jdFile', form.jdFile);
    if (form.resumeFile) fd.append('resumeFile', form.resumeFile);

    await API.create(fd);
    setForm({ ...empty, dateApplied: toLocalInputValue(new Date()) });
    onSaved && onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2"/>
      <input name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2"/>
      <textarea name="jobDescriptionText" placeholder="Paste JD text (optional)" rows={4} value={form.jobDescriptionText} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
      <div className="flex gap-3">
        <input type="datetime-local" name="dateApplied" value={form.dateApplied} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"/>
        <select name="status" value={form.status} onChange={handleChange} className="border rounded-lg px-3 py-2">
          {['Applied','Interview Scheduled','In Process','Offer','Rejected','On Hold'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <textarea name="notes" placeholder="Notes" rows={3} value={form.notes} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-500">JD file (pdf/doc/txt)</label>
          <input type="file" name="jdFile" onChange={handleChange} className="w-full border rounded-lg px-3 py-2"/>
        </div>
        <div>
          <label className="text-sm text-gray-500">Resume used</label>
          <input type="file" name="resumeFile" onChange={handleChange} className="w-full border rounded-lg px-3 py-2"/>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Save</button>
        <button type="button" onClick={()=>setForm({ ...empty, dateApplied: toLocalInputValue(new Date()) })} className="px-4 py-2 bg-gray-200 rounded-lg">Reset</button>
      </div>
    </form>
  );
}
