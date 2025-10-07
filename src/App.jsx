
import React, { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardHeader, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

const StatusBadge = ({status}) => {
  const map = {
    'Interview Scheduled': 'bg-yellow-300 text-gray-900',
    'Applied': 'bg-blue-200 text-gray-900',
    'Rejected': 'bg-red-200 text-gray-900',
    'Offer': 'bg-green-200 text-gray-900'
  };
  return <Badge className={map[status] || 'bg-gray-200 text-gray-900'}>{status}</Badge>;
}

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [newJob, setNewJob] = useState({ title: '', company: '', status: 'Applied', notes: '' });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('jobs');
    if (stored) setJobs(JSON.parse(stored));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = () => {
    if (!newJob.title.trim() || !newJob.company.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setJobs(prev => [...prev, { id: Date.now(), ...newJob, date: dateStr }]);
    setNewJob({ title: '', company: '', status: 'Applied', notes: '' });
  };

  const removeJob = (id) => setJobs(prev => prev.filter(j => j.id !== id));

  const filtered = jobs.filter(j => 
    (filter === 'All' || j.status === filter) &&
    (j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>💼</span> Job Tracker
        </h1>
        <p className="text-gray-500">Manage and track all your job applications in one place</p>
      </header>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <div className="flex items-center flex-1 gap-2 min-w-[250px]">
          <Input placeholder="Search by company or job title..." value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="px-3 py-2 border rounded-xl" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option>All</option>
            <option>Applied</option>
            <option>Interview Scheduled</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <details className="w-full md:w-auto bg-white border rounded-2xl p-3">
          <summary className="cursor-pointer font-medium">+ Add New Job</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            <Input placeholder="Job Title" value={newJob.title} onChange={e=>setNewJob({...newJob, title:e.target.value})} />
            <Input placeholder="Company" value={newJob.company} onChange={e=>setNewJob({...newJob, company:e.target.value})} />
            <Input placeholder="Status (Applied / Interview Scheduled / Offer / Rejected)" value={newJob.status} onChange={e=>setNewJob({...newJob, status:e.target.value})} />
            <Input placeholder="Notes (optional)" value={newJob.notes} onChange={e=>setNewJob({...newJob, notes:e.target.value})} className="min-w-[260px]" />
            <Button onClick={addJob}>Add</Button>
          </div>
        </details>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No jobs found. Add your first one above.</p>
        ) : filtered.map(job => (
          <Card key={job.id}>
            <CardHeader className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">{job.title}</h2>
                <div className="text-sm text-gray-600 mt-1">{job.company}</div>
              </div>
              <StatusBadge status={job.status}/>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-2">📅 {job.date}</div>
              {job.notes && <p className="text-sm text-gray-700 mb-3">{job.notes}</p>}
              <Button variant="destructive" onClick={()=>removeJob(job.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
