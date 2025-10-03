import React, { useEffect, useState } from 'react';
import { API } from '../api.js';

export default function JobDetailsModal({ jobId, onClose }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    (async () => setJob(await API.get(jobId)))();
  }, [jobId]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">{job.companyName} — {job.jobTitle}</h3>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>✕</button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-gray-500">
            Applied on {new Date(job.dateApplied).toLocaleString([], { 
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </p>
          <p>Status: <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{job.status}</span></p>
          {job.jobDescriptionText && (<>
            <h4 className="font-semibold">Job Description</h4>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg">{job.jobDescriptionText}</pre>
          </>)}
          <h4 className="font-semibold">Notes</h4>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg">{job.notes || '—'}</pre>
          <div className="flex gap-4">
            {job.jdFile && <a className="text-purple-600 underline" href={job.jdFile.url} target="_blank">View JD file</a>}
            {job.resumeFile && <a className="text-purple-600 underline" href={job.resumeFile.url} target="_blank">View Resume file</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
