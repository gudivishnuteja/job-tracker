import React, { useEffect, useState } from "react";
import { API } from "./api.js";
import JobList from "./components/JobList.jsx";
import JobForm from "./components/JobForm.jsx";
import JobDetailsModal from "./components/JobDetailsModal.jsx";
import Modal from "./components/Modal.jsx";
import { Plus } from "lucide-react";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await API.list({ q: query, status });
      setJobs(data);
    })();
  }, [query, status, refresh]);

  const statuses = ["Applied","Interview Scheduled","In Process","Offer","Rejected","On Hold"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Job Tracker</h1>
          <p className="text-gray-500">Manage and track your job applications</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md transition"
        >
          <Plus size={18} /> Add New Job
        </button>
      </div>

      <div className="flex gap-4 mt-6">
        <input
          type="text"
          placeholder="Search by company, title, notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <JobList 
        jobs={jobs} 
        onView={setSelected} 
        onRemove={async (id) => {
          if (confirm("Delete this job?")) {
            await API.remove(id);
            setRefresh(x => x + 1);
          }
        }}
      />

      {selected && <JobDetailsModal jobId={selected} onClose={() => setSelected(null)} />}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add / Update Job">
        <JobForm onSaved={() => { setShowAdd(false); setRefresh(x => x + 1); }} />
      </Modal>
    </div>
  );
}
