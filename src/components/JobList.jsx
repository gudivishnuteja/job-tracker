import JobCard from "./JobCard.jsx";

export default function JobList({ jobs, onView, onRemove }) {
  if (!jobs?.length) {
    return <p className="text-gray-500 mt-8">No jobs yet. Click "Add New Job" to create one.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onView={onView} onRemove={onRemove} />
      ))}
    </div>
  );
}
