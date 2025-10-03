import { Calendar, Trash2 } from "lucide-react";

export default function JobCard({ job, onView, onRemove }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <h3
          onClick={() => onView(job._id)}
          className="text-lg font-semibold text-gray-900 truncate max-w-[12rem] cursor-pointer"
        >
          {job.jobTitle}
        </h3>
        <div className="flex gap-2">
          {job.status && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              {job.status}
            </span>
          )}
          <button
            onClick={() => onRemove(job._id)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-1">{job.companyName}</p>

      <div className="flex items-center text-gray-500 text-sm mt-3 gap-2">
        <Calendar size={16} />
        <span>
          {new Date(job.dateApplied).toLocaleString([], { 
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          })}
        </span>
      </div>

      {job.notes && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{job.notes}</p>
      )}
    </div>
  );
}
