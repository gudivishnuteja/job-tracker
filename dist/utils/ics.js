"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIcs = generateIcs;
function pad(n) { return n < 10 ? `0${n}` : String(n); }
function formatDate(dt) {
    const y = dt.getUTCFullYear();
    const m = pad(dt.getUTCMonth() + 1);
    const d = pad(dt.getUTCDate());
    const hh = pad(dt.getUTCHours());
    const mm = pad(dt.getUTCMinutes());
    const ss = pad(dt.getUTCSeconds());
    return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}
function generateIcs(reminders, jobMap) {
    const lines = [];
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//JobTracker//EN');
    const now = new Date();
    for (const r of reminders) {
        const job = jobMap.get(String(r.jobId));
        const titlePrefix = r.type === 'deadline' ? 'Deadline' : 'Interview';
        const summary = job ? `${titlePrefix}: ${job.title} @ ${job.company}` : `${titlePrefix}`;
        const dtstart = formatDate(new Date(r.dueAt));
        const dtend = formatDate(new Date(new Date(r.dueAt).getTime() + 60 * 60 * 1000));
        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${String(r.jobId)}-${dtstart}@jobtracker`);
        lines.push(`DTSTAMP:${formatDate(now)}`);
        lines.push(`DTSTART:${dtstart}`);
        lines.push(`DTEND:${dtend}`);
        lines.push(`SUMMARY:${summary}`);
        if (r.note)
            lines.push(`DESCRIPTION:${r.note.replace(/\n/g, '\\n')}`);
        if (job?.sourceLink)
            lines.push(`URL:${job.sourceLink}`);
        lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
}
