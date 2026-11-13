import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, CalendarDays,
  Check, ChevronLeft, ChevronRight, Download, Edit3, Eye, FileDown, Mail,
  Plus, Send, Shield, Trash2, Users,
} from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import Modal from '../components/Modal';
import { PageHeading, SearchInput, StatusBadge, downloadCSV } from '../components/PageParts';
import { announcements, activityByMonth } from '../data/mockData';
import { useApp } from '../context/AppContext';

const GROUP_COLORS = ['#7b2420', '#b58521', '#a65344'];
const COLUMNS = {
  recipients: ['Name', 'Email', 'Category', 'Subcategory', 'Department', 'Status'],
  history: ['Subject', 'Sender', 'Role', 'Groups', 'Count', 'Date', 'Status'],
  scheduled: ['Subject', 'Groups', 'Date', 'Time', 'Status'],
  users: ['Name', 'Username', 'Email', 'Role', 'Status'],
};

function RecordModal({ title, fields, initial, onSave, onClose, saveLabel = 'Save changes' }) {
  const [values, setValues] = useState(initial || {});
  const [error, setError] = useState('');
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    const required = fields.find((field) => field.required !== false && !String(values[field.key] || '').trim());
    if (required) {
      setError(`${required.label} is required.`);
      return;
    }
    onSave(values);
  };
  return <Modal title={title} onClose={onClose} footer={<><button className="button button-light" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" form="record-form">{saveLabel}</button></>}>
    <form id="record-form" className="record-form" onSubmit={submit}>
      {fields.map((field) => <label className="form-field" key={field.key}><span>{field.label}</span>
        {field.type === 'select' ? <select value={values[field.key] || ''} onChange={(event) => update(field.key, event.target.value)}>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          : field.type === 'textarea' ? <textarea rows={5} value={values[field.key] || ''} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder || ''} />
            : <input type={field.type || 'text'} value={values[field.key] || ''} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder || ''} />}</label>)}
      {error && <p className="form-error">{error}</p>}
    </form>
  </Modal>;
}

function ConfirmModal({ title, message, onCancel, onConfirm, confirmLabel = 'Delete' }) {
  return <Modal title={title} onClose={onCancel} footer={<><button className="button button-light" onClick={onCancel}>Cancel</button><button className="button button-danger" onClick={onConfirm}>{confirmLabel}</button></>}>
    <p className="modal-description">{message}</p>
  </Modal>;
}

function Table({ headers, children, empty = 'No records found.' }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return <div className="table-scroll"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{hasRows ? children : <tr><td className="table-empty" colSpan={headers.length}>{empty}</td></tr>}</tbody></table></div>;
}

function IconActions({ onView, onEdit, onDelete, onToggle, active }) {
  return <div className="row-actions">
    {onView && <button className="icon-button table-action" onClick={onView} aria-label="View details" title="View details"><Eye size={16} /></button>}
    {onEdit && <button className="icon-button table-action" onClick={onEdit} aria-label="Edit" title="Edit"><Edit3 size={15} /></button>}
    {onToggle && <button className={`text-button ${active ? 'text-danger' : ''}`} onClick={onToggle}>{active ? 'Deactivate' : 'Activate'}</button>}
    {onDelete && <button className="icon-button table-action delete-action" onClick={onDelete} aria-label="Delete" title="Delete"><Trash2 size={16} /></button>}
  </div>;
}

function StatCard({ title, value, note, icon: Icon, tone = 'maroon', trend }) {
  return <article className="stat-card"><span className={`stat-icon stat-${tone}`}><Icon size={19} /></span><div className="stat-label">{title}</div><div className="stat-value">{value}</div><div className="stat-note">{trend && <span className="stat-trend"><ArrowUpRight size={14} />{trend}</span>}{note}</div></article>;
}

export function Dashboard() {
  const { recipients, history, scheduled, user } = useApp();
  const navigate = useNavigate();
  const sentCount = history.filter((email) => email.status === 'Sent').length;
  const successCount = history.filter((email) => email.status === 'Sent').reduce((total, email) => total + email.count, 0);
  const nextEmail = scheduled[0];
  const firstName = user?.name === 'CDCE Administrator' ? 'Administrator' : user?.name?.split(' ')[0] || 'Administrator';
  const greeting = new Date().getHours() < 12 ? 'Good morning' : 'Good afternoon';
  const currentDate = new Date().toLocaleDateString('en-LK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const stats = [
    { title: 'Total administrative users', value: '24', note: 'Across all roles', icon: Users },
    { title: 'Total staff', value: '186', note: 'Recipient directory', icon: Users, tone: 'gold' },
    { title: 'Total lecturers', value: '142', note: 'Recipient directory', icon: Users, tone: 'rose' },
    { title: 'Total students', value: '1,284', note: 'Recipient directory', icon: Users, tone: 'green' },
    { title: 'Emails sent', value: (sentCount + 128).toLocaleString(), note: 'This academic year', icon: Send, tone: 'gold' },
    { title: 'Successful emails', value: (successCount + 4812).toLocaleString(), note: 'Delivered to recipients', icon: Check, tone: 'green' },
    { title: 'Failed emails', value: '12', note: 'Review delivery reports', icon: ArrowDownRight, tone: 'rose' },
    { title: 'Pending emails', value: String(scheduled.length + 3), note: 'Scheduled or processing', icon: Mail },
  ];
  return <>
    <section className="dashboard-hero">
      <div className="dashboard-hero-top">
        <div className="hero-brand">
          <span className="hero-brand-seal"><img src="/assets/cdce-logo.png" alt="University of Peradeniya seal" /></span>
          <span><strong>UNIVERSITY OF PERADENIYA</strong><small>Centre for Distance and Continuing Education</small></span>
        </div>
        <span className="hero-workspace-label"><i /> EMAIL MANAGEMENT SYSTEM</span>
      </div>
      <div className="dashboard-hero-content">
        <div className="hero-copy">
          <div className="hero-greeting">{greeting}, {firstName}</div>
          <h1>CDCE communications,<br /><span>thoughtfully connected.</span></h1>
          <p>Manage official email updates for staff, lecturers, and students, all in one place.</p>
          <div className="hero-actions">
            <button className="hero-button hero-button-primary" onClick={() => navigate('/compose')}>Compose an email <ArrowRight size={16} /></button>
            <button className="hero-button hero-button-secondary" onClick={() => navigate('/recipients')}>Browse recipients <Users size={15} /></button>
          </div>
        </div>
        <div className="hero-seal-stage">
          <span className="hero-seal-orbit hero-seal-orbit-one" />
          <span className="hero-seal-orbit hero-seal-orbit-two" />
          <span className="hero-seal-disc"><img src="/assets/cdce-logo.png" alt="" /></span>
          <div className="hero-schedule-card">
            <span className="hero-schedule-icon"><CalendarDays size={16} /></span>
            <span className="hero-schedule-copy"><small>UP NEXT</small><strong>{nextEmail?.subject || 'No emails scheduled'}</strong><em>{nextEmail?.date || 'Your schedule is clear'}</em></span>
          </div>
        </div>
      </div>
    </section>
    <div className="dashboard-section-heading">
      <div><span className="section-kicker">YOUR WORKSPACE</span><h2>At a glance</h2></div>
      <span className="section-date"><CalendarDays size={15} />{currentDate}</span>
    </div>
    <div className="stats-grid dashboard-stats">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</div>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><div className="panel-title-row"><div><h2>Email activity</h2><p>Messages sent and delivered, last 6 months</p></div><span className="chart-legend"><i /> Sent <i className="legend-gold" /> Delivered</span></div>
        <ResponsiveContainer width="100%" height={244}><LineChart data={activityByMonth} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#eee9e4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8a8580', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8a8580', fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eee9e4', fontSize: 12 }} /><Line type="monotone" dataKey="sent" name="Sent" stroke="#7b2420" strokeWidth={2.5} dot={{ r: 3, fill: '#7b2420' }} /><Line type="monotone" dataKey="delivered" name="Delivered" stroke="#b58521" strokeWidth={2.5} dot={{ r: 3, fill: '#b58521' }} /></LineChart></ResponsiveContainer>
      </section>
      <section className="panel announcements-panel"><div className="panel-title-row"><div><h2>Announcements</h2><p>Updates from the system</p></div><Bell size={18} className="muted-icon" /></div>
        <div className="announcement-list">{announcements.map((item) => <article className="announcement" key={item.title}><span className="announcement-marker" /><div><h3>{item.title}</h3><p>{item.description}</p><small>{item.date}</small></div></article>)}</div>
      </section>
    </div>
    <section className="panel dashboard-recent"><div className="panel-title-row"><div><h2>Recent email activity</h2><p>Latest messages from your workspace</p></div><button className="text-button" onClick={() => navigate('/history')}>View all emails →</button></div>
      <Table headers={['Subject', 'Recipient groups', 'Recipients', 'Date', 'Status']}>{history.slice(0, 4).map((email) => <tr key={email.id}><td className="primary-cell">{email.subject}</td><td>{email.groups.join(', ')}</td><td>{email.count}</td><td>{email.date}</td><td><StatusBadge>{email.status}</StatusBadge></td></tr>)}</Table>
      <span className="sr-only">Recipient directory contains {recipients.length} demo contacts.</span>
    </section>
  </>;
}

export function Recipients() {
  const { recipients, setRecipients, categories, notify } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [subcategory, setSubcategory] = useState('All subcategories');
  const [selected, setSelected] = useState([]);
  const [record, setRecord] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const filtered = useMemo(() => recipients.filter((person) =>
    `${person.name} ${person.email}`.toLowerCase().includes(search.toLowerCase())
    && (category === 'All categories' || person.category === category)
    && (subcategory === 'All subcategories' || person.subcategory === subcategory)), [recipients, search, category, subcategory]);
  const subcategories = categories.find((item) => item.name === category)?.subcategories || categories.flatMap((item) => item.subcategories);
  const fields = [
    { key: 'name', label: 'Full name' }, { key: 'email', label: 'Email address', type: 'email' },
    { key: 'category', label: 'Category', type: 'select', options: categories.map((item) => item.name) },
    { key: 'subcategory', label: 'Subcategory', type: 'select', options: subcategories },
    { key: 'department', label: 'Department' }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];
  const save = (values) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { notify('Enter a valid email address.', 'error'); return; }
    if (record?.id) setRecipients((current) => current.map((item) => item.id === record.id ? { ...values, id: record.id } : item));
    else setRecipients((current) => [{ ...values, id: Date.now() }, ...current]);
    setRecord(null);
    notify(record?.id ? 'Recipient updated.' : 'Recipient added.');
  };
  const importFile = async (file) => {
    if (!file) return;
    const rows = (await file.text()).split(/\r?\n/).filter(Boolean);
    const imported = rows.slice(1).map((row, index) => {
      const [name, email, group, sub, department] = row.split(',').map((part) => part.trim());
      return name && email ? { id: Date.now() + index, name, email, category: group || 'Staff', subcategory: sub || 'Office Staff', department: department || 'CDCE', status: 'Active' } : null;
    }).filter(Boolean);
    setRecipients((current) => [...imported, ...current]);
    notify(`${imported.length} recipient${imported.length === 1 ? '' : 's'} imported from CSV.`);
  };
  return <>
    <PageHeading eyebrow="DIRECTORY" title="Recipients" description="Manage staff, lecturers, and student email contacts." action={<button className="button button-primary" onClick={() => setRecord({})}><Plus size={16} /> Add recipient</button>} />
    <section className="panel">
      <div className="toolbar-row"><SearchInput value={search} onChange={setSearch} placeholder="Search name or email" />
        <div className="filter-actions"><select className="filter-select" value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory('All subcategories'); }}><option>All categories</option>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select>
          <select className="filter-select" value={subcategory} onChange={(event) => setSubcategory(event.target.value)}><option>All subcategories</option>{subcategories.map((item) => <option key={item}>{item}</option>)}</select>
          <label className="button button-outline button-small"><FileDown size={15} /> Import CSV<input className="visually-hidden" type="file" accept=".csv,text/csv" onChange={(event) => importFile(event.target.files?.[0])} /></label>
          <button className="button button-outline button-small" onClick={() => downloadCSV('cdce-recipients.csv', [['Full Name', 'Email', 'Category', 'Subcategory', 'Department', 'Status'], ...filtered.map((person) => [person.name, person.email, person.category, person.subcategory, person.department, person.status])])}><Download size={15} /> Export</button>
        </div>
      </div>
      <div className="selection-bar"><span>{selected.length ? `${selected.length} selected` : `${filtered.length} recipients`}</span><button className="text-button" onClick={() => setSelected(selected.length === filtered.length ? [] : filtered.map((person) => person.id))}>{selected.length === filtered.length && filtered.length ? 'Clear selection' : 'Select all'}</button></div>
      <Table headers={['', 'Full name', 'Email address', 'Category', 'Subcategory', 'Department', 'Status', 'Actions']}>
        {filtered.map((person) => <tr key={person.id}><td><input type="checkbox" aria-label={`Select ${person.name}`} checked={selected.includes(person.id)} onChange={() => setSelected((current) => current.includes(person.id) ? current.filter((id) => id !== person.id) : [...current, person.id])} /></td><td className="primary-cell">{person.name}</td><td>{person.email}</td><td>{person.category}</td><td>{person.subcategory}</td><td>{person.department}</td><td><StatusBadge>{person.status}</StatusBadge></td><td><IconActions onEdit={() => setRecord(person)} onDelete={() => setDeleting(person)} /></td></tr>)}
      </Table>
    </section>
    {record && <RecordModal title={record.id ? 'Edit recipient' : 'Add recipient'} fields={fields} initial={record.id ? record : { category: categories[0]?.name, subcategory: categories[0]?.subcategories[0], department: 'CDCE', status: 'Active' }} onSave={save} onClose={() => setRecord(null)} />}
    {deleting && <ConfirmModal title="Delete recipient" message={`Remove ${deleting.name} from the recipient directory?`} onCancel={() => setDeleting(null)} onConfirm={() => { setRecipients((current) => current.filter((person) => person.id !== deleting.id)); setDeleting(null); notify('Recipient deleted.'); }} />}
  </>;
}

export function Categories() {
  const { categories, setCategories, recipients, notify } = useApp();
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const shown = categories.filter((item) => `${item.name} ${item.subcategories.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  const save = (values) => {
    const subcategories = values.subcategories.split(',').map((value) => value.trim()).filter(Boolean);
    if (record?.id) setCategories((current) => current.map((item) => item.id === record.id ? { ...item, name: values.name.trim(), subcategories } : item));
    else setCategories((current) => [...current, { id: `cat-${Date.now()}`, name: values.name.trim(), subcategories }]);
    setRecord(null);
    notify(record?.id ? 'Category updated.' : 'Category added.');
  };
  const addSubcategory = (item) => {
    const value = window.prompt(`Add a subcategory to ${item.name}`);
    if (value?.trim()) {
      setCategories((current) => current.map((category) => category.id === item.id ? { ...category, subcategories: [...category.subcategories, value.trim()] } : category));
      notify('Subcategory added.');
    }
  };
  return <>
    <PageHeading eyebrow="DIRECTORY" title="Recipient categories" description="Organise recipients into groups and subcategories." action={<button className="button button-primary" onClick={() => setRecord({})}><Plus size={16} /> Add category</button>} />
    <section className="panel"><div className="toolbar-row"><SearchInput value={search} onChange={setSearch} placeholder="Search categories" /><span className="muted-small">{categories.length} categories</span></div>
      <div className="category-grid">{shown.map((item, index) => {
        const categoryCount = recipients.filter((person) => person.category === item.name).length;
        return <article className="category-card" key={item.id}><div className="category-card-top"><span className={`category-icon category-tone-${index % 3}`}><Users size={20} /></span><span className="muted-small">{categoryCount} recipients</span></div>
          <h2>{item.name}</h2><p>{item.subcategories.length} subcategories</p>
          <div className="subcategory-list">{item.subcategories.map((sub) => <span className="subcategory-pill" key={sub}>{sub}<small>{recipients.filter((person) => person.category === item.name && person.subcategory === sub).length}</small></span>)}</div>
          <div className="category-card-actions"><button className="text-button" onClick={() => addSubcategory(item)}><Plus size={14} /> Add subcategory</button><div><button className="icon-button table-action" onClick={() => setRecord({ ...item, subcategories: item.subcategories.join(', ') })} aria-label={`Edit ${item.name}`}><Edit3 size={15} /></button><button className="icon-button table-action delete-action" onClick={() => setDeleting(item)} aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button></div></div>
        </article>;
      })}</div>
    </section>
    {record && <RecordModal title={record.id ? 'Edit category' : 'Add category'} fields={[{ key: 'name', label: 'Category name' }, { key: 'subcategories', label: 'Subcategories (comma separated)', required: false, placeholder: 'Administrative Staff, Office Staff' }]} initial={record.id ? record : { subcategories: '' }} onSave={save} onClose={() => setRecord(null)} />}
    {deleting && <ConfirmModal title="Delete category" message={`Delete “${deleting.name}”? This will not delete the recipient records in this frontend demo.`} onCancel={() => setDeleting(null)} onConfirm={() => { setCategories((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); notify('Category deleted.'); }} />}
  </>;
}

export function EmailHistory() {
  const { history } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const pageSize = 5;
  const filtered = history.filter((item) => `${item.subject} ${item.sender} ${item.groups.join(' ')}`.toLowerCase().includes(search.toLowerCase()) && (status === 'All statuses' || item.status === status) && (!from || item.date >= from) && (!to || item.date <= to));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);
  return <>
    <PageHeading eyebrow="EMAIL ACTIVITY" title="Email history" description="Review messages and their delivery status." />
    <section className="panel"><div className="toolbar-row"><SearchInput value={search} onChange={(value) => { setSearch(value); setPage(0); }} placeholder="Search subject, sender, or group" /><div className="filter-actions"><label className="date-filter">From <input type="date" value={from} onChange={(event) => { setFrom(event.target.value); setPage(0); }} /></label><label className="date-filter">To <input type="date" value={to} onChange={(event) => { setTo(event.target.value); setPage(0); }} /></label><select className="filter-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option>All statuses</option>{['Sent', 'Pending', 'Failed', 'Scheduled'].map((value) => <option key={value}>{value}</option>)}</select></div></div>
      <Table headers={['Email subject', 'Sender', 'Role', 'Recipient groups', 'Recipients', 'Date', 'Status', 'Actions']}>{visible.map((email) => <tr key={email.id}><td className="primary-cell">{email.subject}</td><td>{email.sender}</td><td>{email.role}</td><td>{email.groups.join(', ')}</td><td>{email.count}</td><td>{email.date}</td><td><StatusBadge>{email.status}</StatusBadge></td><td><IconActions onView={() => setSelected(email)} /></td></tr>)}</Table>
      <div className="pagination"><span>Showing {filtered.length ? page * pageSize + 1 : 0}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span><div><button className="icon-button table-action" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} aria-label="Previous page"><ChevronLeft size={17} /></button><span>Page {page + 1} of {pages}</span><button className="icon-button table-action" disabled={page + 1 >= pages} onClick={() => setPage((value) => Math.min(pages - 1, value + 1))} aria-label="Next page"><ChevronRight size={17} /></button></div></div>
    </section>
    {selected && <Modal title="Email details" onClose={() => setSelected(null)} footer={<button className="button button-primary" onClick={() => setSelected(null)}>Close</button>}><dl className="detail-list">{[['Subject', selected.subject], ['Sender', selected.sender], ['Role', selected.role], ['Recipient groups', selected.groups.join(', ')], ['Recipients', selected.count], ['Date', selected.date], ['Status', selected.status]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></Modal>}
  </>;
}

export function ScheduledEmails() {
  const { scheduled, setScheduled, notify } = useApp();
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const edit = (values) => {
    setScheduled((current) => current.map((item) => item.id === editing.id ? { ...item, date: values.date, time: values.time } : item));
    setEditing(null); notify('Schedule updated.');
  };
  return <>
    <PageHeading eyebrow="EMAIL ACTIVITY" title="Scheduled emails" description="Review and manage emails prepared for a future date." />
    <section className="panel"><div className="panel-title-row"><div><h2>Upcoming messages</h2><p>{scheduled.length} scheduled email{scheduled.length === 1 ? '' : 's'}</p></div></div>
      <Table headers={['Email subject', 'Recipient groups', 'Scheduled date', 'Scheduled time', 'Status', 'Actions']}>{scheduled.map((item) => <tr key={item.id}><td className="primary-cell">{item.subject}</td><td>{item.groups.join(', ')}</td><td>{item.date}</td><td>{item.time}</td><td><StatusBadge>{item.status}</StatusBadge></td><td><IconActions onView={() => setSelected(item)} onEdit={() => setEditing(item)} onDelete={() => setDeleting(item)} /></td></tr>)}</Table>
    </section>
    {selected && <Modal title="Scheduled email details" onClose={() => setSelected(null)} footer={<button className="button button-primary" onClick={() => setSelected(null)}>Close</button>}><dl className="detail-list">{[['Subject', selected.subject], ['Recipient groups', selected.groups.join(', ')], ['Date', selected.date], ['Time', selected.time], ['Status', selected.status]].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></Modal>}
    {editing && <RecordModal title="Edit schedule" fields={[{ key: 'date', label: 'Date', type: 'date' }, { key: 'time', label: 'Time', type: 'time' }]} initial={editing} onSave={edit} onClose={() => setEditing(null)} />}
    {deleting && <ConfirmModal title="Cancel scheduled email" message={`Cancel “${deleting.subject}”? It will be removed from the scheduled list.`} confirmLabel="Cancel schedule" onCancel={() => setDeleting(null)} onConfirm={() => { setScheduled((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); notify('Scheduled email cancelled.'); }} />}
  </>;
}

export function Templates() {
  const { templates, setTemplates, setComposeTemplate, notify } = useApp();
  const [record, setRecord] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const save = (values) => {
    if (record?.id) setTemplates((current) => current.map((item) => item.id === record.id ? { ...values, id: record.id } : item));
    else setTemplates((current) => [...current, { ...values, id: Date.now() }]);
    setRecord(null); notify(record?.id ? 'Template updated.' : 'Template created.');
  };
  const useTemplate = (template) => {
    setComposeTemplate(template.id);
    navigate('/compose');
  };
  return <>
    <PageHeading eyebrow="EMAIL CONTENT" title="Email templates" description="Create and reuse consistent institutional messages." action={<button className="button button-primary" onClick={() => setRecord({})}><Plus size={16} /> Create template</button>} />
    <div className="template-grid">{templates.map((template, index) => <article className="panel template-card" key={template.id}><div className="template-card-icon"><Mail size={20} /></div><div className="template-card-top"><span className="template-index">TEMPLATE {String(index + 1).padStart(2, '0')}</span><div className="template-card-actions"><button className="icon-button table-action" aria-label="Edit template" onClick={() => setRecord(template)}><Edit3 size={15} /></button><button className="icon-button table-action delete-action" aria-label="Delete template" onClick={() => setDeleting(template)}><Trash2 size={15} /></button></div></div><h2>{template.name}</h2><p className="template-subject">{template.subject}</p><p className="template-preview-text">{template.body.replace(/\n/g, ' ').slice(0, 120)}…</p><div className="template-card-footer"><button className="text-button" onClick={() => setPreview(template)}>Preview</button><button className="button button-outline button-small" onClick={() => useTemplate(template)}>Use template</button></div></article>)}</div>
    {record && <RecordModal title={record.id ? 'Edit template' : 'Create template'} fields={[{ key: 'name', label: 'Template name' }, { key: 'subject', label: 'Email subject' }, { key: 'body', label: 'Message', type: 'textarea' }]} initial={record} onSave={save} onClose={() => setRecord(null)} />}
    {preview && <Modal title={`Preview: ${preview.name}`} onClose={() => setPreview(null)} footer={<><button className="button button-light" onClick={() => setPreview(null)}>Close</button><button className="button button-primary" onClick={() => { useTemplate(preview); setPreview(null); }}>Use template</button></>}><div className="preview-email"><div><strong>Subject</strong><span>{preview.subject}</span></div><hr /><pre>{preview.body}</pre></div></Modal>}
    {deleting && <ConfirmModal title="Delete template" message={`Delete the “${deleting.name}” template?`} onCancel={() => setDeleting(null)} onConfirm={() => { setTemplates((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); notify('Template deleted.'); }} />}
  </>;
}

export function UserManagement() {
  const { users, setUsers, roles, notify } = useApp();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All roles');
  const [record, setRecord] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const filtered = users.filter((item) => `${item.name} ${item.username} ${item.email}`.toLowerCase().includes(search.toLowerCase()) && (role === 'All roles' || item.role === role));
  const fields = [{ key: 'name', label: 'Full name' }, { key: 'username', label: 'Username' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'role', label: 'Role', type: 'select', options: roles.map((item) => item.name) }, { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }];
  const save = (values) => {
    if (record?.id) setUsers((current) => current.map((item) => item.id === record.id ? { ...values, id: record.id } : item));
    else setUsers((current) => [{ ...values, id: Date.now() }, ...current]);
    setRecord(null); notify(record?.id ? 'User updated.' : 'User added.');
  };
  return <>
    <PageHeading eyebrow="ADMINISTRATION" title="User management" description="Manage administrative access to the email system." action={<button className="button button-primary" onClick={() => setRecord({ status: 'Active', role: roles[0]?.name })}><Plus size={16} /> Add user</button>} />
    <section className="panel"><div className="toolbar-row"><SearchInput value={search} onChange={setSearch} placeholder="Search users" /><select className="filter-select" value={role} onChange={(event) => setRole(event.target.value)}><option>All roles</option>{roles.map((item) => <option key={item.id}>{item.name}</option>)}</select></div>
      <Table headers={['Full name', 'Username', 'Email', 'Role', 'Status', 'Actions']}>{filtered.map((item) => <tr key={item.id}><td className="primary-cell">{item.name}</td><td>{item.username}</td><td>{item.email}</td><td>{item.role}</td><td><StatusBadge>{item.status}</StatusBadge></td><td><IconActions onEdit={() => setRecord(item)} onDelete={() => setDeleting(item)} onToggle={() => { setUsers((current) => current.map((person) => person.id === item.id ? { ...person, status: person.status === 'Active' ? 'Inactive' : 'Active' } : person)); notify(`${item.name} account ${item.status === 'Active' ? 'deactivated' : 'activated'}.`); }} active={item.status === 'Active'} /></td></tr>)}</Table>
    </section>
    {record && <RecordModal title={record.id ? 'Edit user' : 'Add user'} fields={fields} initial={record} onSave={save} onClose={() => setRecord(null)} />}
    {deleting && <ConfirmModal title="Delete user" message={`Remove ${deleting.name} from user management?`} onCancel={() => setDeleting(null)} onConfirm={() => { setUsers((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); notify('User deleted.'); }} />}
  </>;
}

export function RoleManagement() {
  const { roles, setRoles, notify } = useApp();
  const [record, setRecord] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const save = (values) => {
    const nextRole = { name: values.name.trim(), canSendEmail: true };
    if (record?.id) setRoles((current) => current.map((item) => item.id === record.id ? { ...nextRole, id: record.id } : item));
    else setRoles((current) => [...current, { ...nextRole, id: `role-${Date.now()}` }]);
    setRecord(null); notify(record?.id ? 'Role updated. Email sending remains enabled.' : 'Role added with email-sending permission enabled.');
  };
  return <>
    <PageHeading eyebrow="ADMINISTRATION" title="Role management" description="Configure administrative roles and their permissions." action={<button className="button button-primary" onClick={() => setRecord({})}><Plus size={16} /> Add role</button>} />
    <section className="panel"><div className="permission-notice"><span className="permission-check"><Check size={17} /></span><div><strong>Equal email-sending access</strong><p>Every administrative role can compose and send emails to staff, lecturers, and students.</p></div></div>
      <Table headers={['Role', 'Email sending', 'Recipient access', 'Other permissions', 'Actions']}>{roles.map((item) => <tr key={item.id}><td className="primary-cell">{item.name}</td><td><StatusBadge>Enabled</StatusBadge></td><td>Staff · Lecturers · Students</td><td><span className="muted-small">Configurable</span></td><td><IconActions onEdit={() => setRecord(item)} onDelete={() => setDeleting(item)} /></td></tr>)}</Table>
    </section>
    {record && <RecordModal title={record.id ? 'Edit role' : 'Add role'} fields={[{ key: 'name', label: 'Role name' }]} initial={record} onSave={save} onClose={() => setRecord(null)} />}
    {deleting && <ConfirmModal title="Delete role" message={`Delete the ${deleting.name} role? Existing users assigned to this role will not be changed in the demo.`} onCancel={() => setDeleting(null)} onConfirm={() => { setRoles((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); notify('Role deleted.'); }} />}
  </>;
}

export function Reports() {
  const { history, notify } = useApp();
  const successful = history.filter((email) => email.status === 'Sent').reduce((total, email) => total + email.count, 0);
  const failed = history.filter((email) => email.status === 'Failed').reduce((total, email) => total + email.count, 0);
  const rolesData = [
    { name: 'Director', emails: 38 }, { name: 'System Analyst', emails: 26 },
    { name: 'Assistant Registrar', emails: 19 }, { name: 'Bursar', emails: 14 },
    { name: 'Other', emails: 9 },
  ];
  const groupsData = [{ name: 'Students', value: 61 }, { name: 'Staff', value: 24 }, { name: 'Lecturers', value: 15 }];
  const exportRows = [['Month', 'Sent', 'Delivered'], ...activityByMonth.map((item) => [item.month, item.sent, item.delivered])];
  const exportExcel = async () => {
    try {
      const ExcelJS = await import('exceljs');
      const workbook = new ExcelJS.Workbook();
      workbook.addWorksheet('Monthly activity').addRows(exportRows);
      workbook.addWorksheet('By role').addRows([['Administrative role', 'Emails'], ...rolesData.map((item) => [item.name, item.emails])]);
      workbook.addWorksheet('By category').addRows([['Recipient category', 'Share'], ...groupsData.map((item) => [item.name, `${item.value}%`])]);
      const buffer = await workbook.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cdce-email-report.xlsx';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('Spreadsheet exported as cdce-email-report.xlsx.');
    } catch (error) {
      notify(`Could not export the spreadsheet: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };
  return <>
    <PageHeading eyebrow="INSIGHTS" title="Reports & analytics" description="Explore email activity across CDCE administrative teams." action={<div className="filter-actions"><button className="button button-outline" onClick={() => window.print()}><FileDown size={15} /> Export PDF</button><button className="button button-primary" onClick={exportExcel}><Download size={15} /> Export Excel</button></div>} />
    <div className="stats-grid report-stats"><StatCard title="Total emails sent" value={(successful + failed).toLocaleString()} note="Based on current history" icon={Send} /><StatCard title="Successful emails" value={successful.toLocaleString()} note="Across sent messages" icon={Check} tone="green" /><StatCard title="Failed emails" value={failed.toLocaleString()} note="Review delivery records" icon={ArrowDownRight} tone="rose" /><StatCard title="Delivery rate" value={`${successful + failed ? Math.round(successful / (successful + failed) * 100) : 0}%`} note="Demo activity estimate" icon={BarChart3} tone="gold" /></div>
    <div className="reports-grid"><section className="panel chart-panel"><div className="panel-title-row"><div><h2>Monthly email statistics</h2><p>Sent and delivered messages</p></div></div><ResponsiveContainer width="100%" height={260}><BarChart data={activityByMonth} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#eee9e4" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8a8580', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8a8580', fontSize: 11 }} /><Tooltip /><Bar dataKey="sent" name="Sent" fill="#7b2420" radius={[4, 4, 0, 0]} /><Bar dataKey="delivered" name="Delivered" fill="#c59b4e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></section>
      <section className="panel chart-panel"><div className="panel-title-row"><div><h2>Emails by recipient category</h2><p>Share of messages sent</p></div></div><div className="pie-chart-wrap"><ResponsiveContainer width="100%" height={205}><PieChart><Pie data={groupsData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={82} paddingAngle={4}>{groupsData.map((item, index) => <Cell key={item.name} fill={GROUP_COLORS[index]} />)}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart></ResponsiveContainer><div className="pie-legend">{groupsData.map((item, index) => <span key={item.name}><i style={{ backgroundColor: GROUP_COLORS[index] }} />{item.name}<strong>{item.value}%</strong></span>)}</div></div></section>
      <section className="panel chart-panel roles-chart"><div className="panel-title-row"><div><h2>Emails by administrative role</h2><p>Messages sent by role (demo data)</p></div></div><ResponsiveContainer width="100%" height={260}><BarChart data={rolesData} layout="vertical" margin={{ top: 0, right: 20, left: 18, bottom: 0 }}><CartesianGrid stroke="#eee9e4" horizontal={false} /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#8a8580', fontSize: 11 }} /><YAxis dataKey="name" type="category" width={125} axisLine={false} tickLine={false} tick={{ fill: '#625c57', fontSize: 11 }} /><Tooltip /><Bar dataKey="emails" fill="#7b2420" radius={[0, 4, 4, 0]} barSize={15} /></BarChart></ResponsiveContainer></section></div>
  </>;
}

export function Settings() {
  const { user, notify } = useApp();
  const [profile, setProfile] = useState({ name: user?.name || '', email: 'cdce@pdn.ac.lk', timezone: 'Asia/Colombo' });
  const [prefs, setPrefs] = useState({ notifications: true, weeklySummary: false, compactTables: false, language: 'English' });
  const [security, setSecurity] = useState({ sessionTimeout: '30 minutes', signOutReminder: true });
  const [emailConfig, setEmailConfig] = useState({ host: 'smtp.pdn.ac.lk', port: '587', fromName: 'Centre for Distance and Continuing Education', fromEmail: 'cdce@pdn.ac.lk', encryption: 'STARTTLS' });
  const [saved, setSaved] = useState(false);
  const save = (event) => { event.preventDefault(); setSaved(true); notify('Settings saved for this demo session.'); };
  return <>
    <PageHeading eyebrow="PREFERENCES" title="Settings" description="Manage your profile, application preferences, and notifications." />
    <form className="settings-layout" onSubmit={save}>
      <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon"><Users size={18} /></span><div><h2>Profile settings</h2><p>Update your administrative profile.</p></div></div><div className="settings-form-grid"><label className="form-field"><span>Display name</span><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label><label className="form-field"><span>Email address</span><input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label className="form-field"><span>Time zone</span><select value={profile.timezone} onChange={(event) => setProfile({ ...profile, timezone: event.target.value })}><option>Asia/Colombo</option><option>UTC</option><option>Asia/Kolkata</option></select></label></div></section>
      <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon"><Bell size={18} /></span><div><h2>Application preferences</h2><p>Adjust how the workspace behaves for you.</p></div></div><label className="form-field settings-language"><span>Language</span><select value={prefs.language} onChange={(event) => setPrefs({ ...prefs, language: event.target.value })}><option>English</option><option>Sinhala</option><option>Tamil</option></select></label><div className="settings-toggle-row"><div><strong>Compact tables</strong><p>Use a denser layout for lists and tables.</p></div><input type="checkbox" checked={prefs.compactTables} onChange={(event) => setPrefs({ ...prefs, compactTables: event.target.checked })} /></div></section>
      <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon"><Mail size={18} /></span><div><h2>Email configuration</h2><p>SMTP integration can be connected in a future backend.</p></div></div><div className="configuration-placeholder"><span className="demo-note-dot" /><div><strong>Demo configuration only</strong><p>Values below are illustrative and are not used to send email.</p></div></div><div className="settings-form-grid"><label className="form-field"><span>SMTP host</span><input value={emailConfig.host} onChange={(event) => setEmailConfig({ ...emailConfig, host: event.target.value })} /></label><label className="form-field"><span>SMTP port</span><input type="number" value={emailConfig.port} onChange={(event) => setEmailConfig({ ...emailConfig, port: event.target.value })} /></label><label className="form-field"><span>Sender name</span><input value={emailConfig.fromName} onChange={(event) => setEmailConfig({ ...emailConfig, fromName: event.target.value })} /></label><label className="form-field"><span>Sender email</span><input type="email" value={emailConfig.fromEmail} onChange={(event) => setEmailConfig({ ...emailConfig, fromEmail: event.target.value })} /></label><label className="form-field"><span>Encryption</span><select value={emailConfig.encryption} onChange={(event) => setEmailConfig({ ...emailConfig, encryption: event.target.value })}><option>STARTTLS</option><option>SSL/TLS</option><option>None</option></select></label></div><label className="settings-toggle-row"><div><strong>Test mode</strong><p>Prevent delivery while the backend is not configured.</p></div><input type="checkbox" checked disabled aria-label="Test mode enabled" /></label></section>
      <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon"><Bell size={18} /></span><div><h2>Notification preferences</h2><p>Choose the updates you would like to see.</p></div></div>{[['notifications', 'Email activity notifications', 'Show notices when email activity is updated.'], ['weeklySummary', 'Weekly summary', 'Receive a weekly summary of your email activity.']].map(([key, title, description]) => <label className="settings-toggle-row" key={key}><div><strong>{title}</strong><p>{description}</p></div><input type="checkbox" checked={prefs[key]} onChange={(event) => setPrefs({ ...prefs, [key]: event.target.checked })} /></label>)}</section>
      <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-icon"><Shield size={18} /></span><div><h2>Security settings</h2><p>Prototype security controls for a future authenticated application.</p></div></div><div className="settings-form-grid"><label className="form-field"><span>Automatic sign-out</span><select value={security.sessionTimeout} onChange={(event) => setSecurity({ ...security, sessionTimeout: event.target.value })}><option>15 minutes</option><option>30 minutes</option><option>60 minutes</option></select></label></div><label className="settings-toggle-row"><div><strong>Sign-out reminder</strong><p>Show a reminder before an inactive demo session expires.</p></div><input type="checkbox" checked={security.signOutReminder} onChange={(event) => setSecurity({ ...security, signOutReminder: event.target.checked })} /></label><div className="configuration-placeholder"><span className="demo-note-dot" /><div><strong>Demo authentication</strong><p>Password management and account security require a future backend integration.</p></div></div></section>
      <div className="settings-footer"><span className="muted-small">{saved ? 'Changes saved.' : 'Settings are stored in this demo session.'}</span><button className="button button-primary" type="submit">Save settings</button></div>
    </form>
  </>;
}
