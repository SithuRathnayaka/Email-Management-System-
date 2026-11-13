import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlignCenter, AlignLeft, AlignRight, Bold, CalendarClock, Check, ChevronDown,
  ChevronRight, Italic, Link2, List, ListOrdered, Paperclip, Plus, Send, Underline, X,
} from 'lucide-react';
import Modal from '../components/Modal';
import { PageHeading } from '../components/PageParts';
import { useApp } from '../context/AppContext';

const toolbar = [
  { command: 'bold', label: 'Bold', icon: Bold },
  { command: 'italic', label: 'Italic', icon: Italic },
  { command: 'underline', label: 'Underline', icon: Underline },
  { command: 'insertUnorderedList', label: 'Bullet list', icon: List },
  { command: 'insertOrderedList', label: 'Numbered list', icon: ListOrdered },
  { command: 'justifyLeft', label: 'Align left', icon: AlignLeft },
  { command: 'justifyCenter', label: 'Align center', icon: AlignCenter },
  { command: 'justifyRight', label: 'Align right', icon: AlignRight },
];

export default function ComposeEmail() {
  const { recipients, categories, history, setHistory, scheduled, setScheduled, templates, drafts, setDrafts, composeTemplate, setComposeTemplate, notify, user } = useApp();
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState('');
  const [fields, setFields] = useState({ from: user?.name ? `${user.name} <cdce@pdn.ac.lk>` : 'cdce@pdn.ac.lk', cc: '', bcc: '', subject: '' });
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [modal, setModal] = useState('');
  const [scheduleAt, setScheduleAt] = useState('');
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const visibleRecipients = useMemo(() => recipients.filter((person) => `${person.name} ${person.email}`.toLowerCase().includes(search.toLowerCase())), [recipients, search]);
  const updateField = (key, value) => setFields((current) => ({ ...current, [key]: value }));
  const togglePerson = (id) => setSelected((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]);
  const togglePeople = (people) => {
    const ids = people.map((person) => person.id);
    setSelected((current) => ids.every((id) => current.includes(id)) ? current.filter((id) => !ids.includes(id)) : [...new Set([...current, ...ids])]);
  };
  const selectedPeople = recipients.filter((person) => selected.includes(person.id));
  const selectedGroups = [...new Set(selectedPeople.map((person) => person.category))];

  const applyTemplate = (templateId) => {
    const template = templates.find((item) => String(item.id) === String(templateId));
    if (!template) return;
    updateField('subject', template.subject);
    setBody(template.body.replaceAll('{{recipient}}', 'there'));
    if (editorRef.current) editorRef.current.innerText = template.body.replaceAll('{{recipient}}', 'there');
    setComposeTemplate(null);
    notify(`“${template.name}” template applied.`);
  };

  useEffect(() => {
    if (composeTemplate) applyTemplate(composeTemplate);
  }, [composeTemplate]);

  const send = () => {
    if (!fields.subject.trim() || !body.trim() || selected.length === 0) {
      notify('Choose at least one recipient and complete the subject and message.', 'error');
      setModal('');
      return;
    }
    setHistory((current) => [{
      id: Date.now(), subject: fields.subject, sender: user?.name || 'CDCE Administrator',
      role: user?.role || 'Director', groups: selectedGroups, count: selected.length,
      date: new Date().toISOString().slice(0, 10), status: 'Sent',
    }, ...current]);
    setModal('');
    notify(`Demo only: email prepared for ${selected.length} recipient${selected.length === 1 ? '' : 's'}. No email was sent.`);
    setSelected([]);
    setFields((current) => ({ ...current, subject: '', cc: '', bcc: '' }));
    setBody('');
    if (editorRef.current) editorRef.current.innerText = '';
  };

  const saveSchedule = () => {
    if (!fields.subject.trim() || !body.trim() || selected.length === 0 || !scheduleAt) {
      notify('Complete recipients, subject, message, and schedule time first.', 'error');
      return;
    }
    setScheduled((current) => [{
      id: Date.now(), subject: fields.subject, groups: selectedGroups,
      date: scheduleAt.slice(0, 10),
      time: scheduleAt.slice(11, 16),
      status: 'Scheduled',
    }, ...current]);
    setModal('');
    notify('Email added to the scheduled list. No email will be sent in this demo.');
    navigate('/scheduled');
  };

  const saveDraft = () => {
    if (!fields.subject.trim() && !body.trim()) {
      notify('Add a subject or message before saving a draft.', 'error');
      return;
    }
    setDrafts((current) => [{
      id: Date.now(), subject: fields.subject, from: fields.from, cc: fields.cc, bcc: fields.bcc,
      body, recipientIds: [...selected], attachments: attachments.map((file) => file.name),
      updatedAt: new Date().toLocaleString(),
    }, ...current]);
    notify('Draft saved in this demo session.');
  };

  const restoreDraft = (draft) => {
    setFields({ from: draft.from, cc: draft.cc, bcc: draft.bcc, subject: draft.subject });
    setSelected(draft.recipientIds.filter((id) => recipients.some((person) => person.id === id)));
    setBody(draft.body);
    if (editorRef.current) editorRef.current.innerText = draft.body;
    setModal('');
    notify('Draft restored.');
  };

  const format = (command) => {
    editorRef.current?.focus();
    if (command === 'createLink') {
      const url = window.prompt('Enter the link URL');
      if (url) document.execCommand(command, false, url);
    } else document.execCommand(command, false, null);
    setBody(editorRef.current?.innerText || '');
  };

  return (
    <>
      <PageHeading eyebrow="EMAIL COMMUNICATION" title="Compose email" description="Create a message and choose its recipients." action={<button className="button button-outline" onClick={() => navigate('/templates')}>Browse templates</button>} />
      <div className="compose-layout">
        <section className="panel recipient-picker">
          <div className="panel-title-row"><div><h2>Recipients</h2><p>Select one or more university groups.</p></div><span className="count-chip">{selected.length} selected</span></div>
          <div className="recipient-picker-tools">
            <label className="search-input compact-search"><span className="search-icon-char">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search recipients" /></label>
            <button className="text-button" onClick={() => setSelected(selected.length === recipients.length ? [] : recipients.map((person) => person.id))}>{selected.length === recipients.length ? 'Deselect all' : 'Select all'}</button>
          </div>
          <div className="recipient-groups">
            {categories.map((category) => {
              const groupPeople = visibleRecipients.filter((person) => person.category === category.name);
              const expandedGroup = expanded[category.id] ?? true;
              return (
                <div className="recipient-group" key={category.id}>
                  <button className="recipient-group-heading" onClick={() => setExpanded((current) => ({ ...current, [category.id]: !expandedGroup }))}>
                    {expandedGroup ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span>{category.name}</span><small>{groupPeople.length}</small>
                  </button>
                  {expandedGroup && category.subcategories.map((subcategory) => {
                    const people = groupPeople.filter((person) => person.subcategory === subcategory);
                    if (!people.length) return null;
                    const allChecked = people.every((person) => selected.includes(person.id));
                    return <div className="recipient-subgroup" key={subcategory}>
                      <label className="checkbox-label subgroup-check"><input type="checkbox" checked={allChecked} onChange={() => togglePeople(people)} />{subcategory}<span>{people.length}</span></label>
                      {people.map((person) => <label className="recipient-person checkbox-label" key={person.id}><input type="checkbox" checked={selected.includes(person.id)} onChange={() => togglePerson(person.id)} /><span><strong>{person.name}</strong><small>{person.email}</small></span></label>)}
                    </div>;
                  })}
                </div>
              );
            })}
            {!visibleRecipients.length && <p className="empty-state">No recipients match your search.</p>}
          </div>
          <div className="recipient-selection-summary"><span><Check size={15} /> {selected.length} recipients selected</span><button className="text-button" onClick={() => setSelected([])}>Clear selection</button></div>
        </section>

        <section className="panel email-editor-panel">
          <div className="panel-title-row"><div><h2>Message</h2><p>Compose your institutional email.</p></div><div className="compose-header-actions"><button className="text-button" onClick={() => setModal('drafts')}>Drafts ({drafts.length})</button><select className="template-select" aria-label="Select email template" defaultValue="" onChange={(event) => applyTemplate(event.target.value)}><option value="">Use a template</option>{templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></div></div>
          <div className="email-fields">
            <label className="email-field"><span>From</span><input value={fields.from} onChange={(event) => updateField('from', event.target.value)} /></label>
            <div className="email-field"><span>To</span><div className="email-addresses">{selectedPeople.length ? selectedPeople.slice(0, 3).map((person) => <span className="email-chip" key={person.id}>{person.name}<button onClick={() => togglePerson(person.id)} aria-label={`Remove ${person.name}`}><X size={12} /></button></span>) : <span className="email-field-placeholder">Select recipients from the left</span>}{selectedPeople.length > 3 && <span className="email-chip">+{selectedPeople.length - 3} more</span>}</div></div>
            <label className="email-field"><span>CC</span><input value={fields.cc} onChange={(event) => updateField('cc', event.target.value)} placeholder="Add CC recipients" /></label>
            <label className="email-field"><span>BCC</span><input value={fields.bcc} onChange={(event) => updateField('bcc', event.target.value)} placeholder="Add BCC recipients" /></label>
            <label className="email-field"><span>Subject</span><input value={fields.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="Enter an email subject" /></label>
          </div>
          <div className="editor-toolbar" aria-label="Message formatting">
            {toolbar.map(({ command, label, icon: Icon }) => <button key={command} title={label} aria-label={label} onMouseDown={(event) => event.preventDefault()} onClick={() => format(command)}><Icon size={16} /></button>)}
            <button title="Insert link" aria-label="Insert link" onMouseDown={(event) => event.preventDefault()} onClick={() => format('createLink')}><Link2 size={16} /></button>
          </div>
          <div ref={editorRef} className="message-editor" contentEditable suppressContentEditableWarning role="textbox" aria-label="Email message" aria-multiline="true" data-placeholder="Write your message here..." onInput={(event) => setBody(event.currentTarget.innerText)} />
          <div className="attachment-row"><label className="button button-light button-small attachment-button"><Paperclip size={15} /> Attach files<input type="file" multiple onChange={(event) => setAttachments((current) => [...current, ...Array.from(event.target.files || [])])} /></label>{attachments.map((file, index) => <span className="attachment-chip" key={`${file.name}-${index}`}>{file.name}<button onClick={() => setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`}><X size={13} /></button></span>)}</div>
          <div className="compose-footer"><span className="prototype-note">Demo mode · Sending is simulated</span><div className="compose-actions"><button className="button button-light" onClick={saveDraft}>Save draft</button><button className="button button-outline" onClick={() => setModal('preview')}>Preview</button><button className="button button-outline" onClick={() => setModal('schedule')}><CalendarClock size={16} /> Schedule</button><button className="button button-primary" onClick={() => setModal('send')}><Send size={15} /> Send email</button></div></div>
        </section>
      </div>

      {modal === 'send' && <Modal title="Confirm demo send" onClose={() => setModal('')} footer={<><button className="button button-light" onClick={() => setModal('')}>Cancel</button><button className="button button-primary" onClick={send}>Confirm demo send</button></>}>
        <div className="confirmation-box"><span className="confirmation-icon"><Send size={19} /></span><div><strong>This is a frontend demonstration</strong><p>No email will be sent. A simulated activity will be added to Email History.</p></div></div>
        <dl className="detail-list"><div><dt>Subject</dt><dd>{fields.subject || '—'}</dd></div><div><dt>Recipients</dt><dd>{selected.length}</dd></div><div><dt>Recipient groups</dt><dd>{selectedGroups.join(', ') || 'None selected'}</dd></div></dl>
      </Modal>}
      {modal === 'preview' && <Modal title="Email preview" onClose={() => setModal('')} footer={<button className="button button-primary" onClick={() => setModal('')}>Close preview</button>}>
        <div className="preview-email"><div><strong>From</strong><span>{fields.from || '—'}</span></div><div><strong>To</strong><span>{selectedPeople.length} selected recipient{selectedPeople.length === 1 ? '' : 's'}</span></div><div><strong>Subject</strong><span>{fields.subject || 'No subject'}</span></div><hr /><pre>{body || 'Your message will appear here.'}</pre>{attachments.length > 0 && <p className="muted-small">Attachments: {attachments.map((file) => file.name).join(', ')}</p>}</div>
      </Modal>}
      {modal === 'schedule' && <Modal title="Schedule email" onClose={() => setModal('')} footer={<><button className="button button-light" onClick={() => setModal('')}>Cancel</button><button className="button button-primary" onClick={saveSchedule}><CalendarClock size={15} /> Add to schedule</button></>}>
        <p className="modal-description">Choose when this message should appear in your scheduled list. No email will be sent in this demo.</p>
        <label className="form-field"><span>Scheduled date and time</span><input type="datetime-local" value={scheduleAt} min={new Date().toISOString().slice(0, 16)} onChange={(event) => setScheduleAt(event.target.value)} /></label>
      </Modal>}
      {modal === 'drafts' && <Modal title="Saved drafts" onClose={() => setModal('')}>
        {drafts.length ? <div className="draft-list">{drafts.map((draft) => <article className="draft-row" key={draft.id}><div><strong>{draft.subject || 'Untitled draft'}</strong><p>{draft.updatedAt} · {draft.recipientIds.length} selected recipient{draft.recipientIds.length === 1 ? '' : 's'}</p></div><div><button className="button button-outline button-small" onClick={() => restoreDraft(draft)}>Open draft</button><button className="icon-button table-action delete-action" aria-label={`Delete ${draft.subject || 'draft'}`} onClick={() => setDrafts((current) => current.filter((item) => item.id !== draft.id))}><X size={15} /></button></div></article>)}</div> : <p className="empty-state">No drafts saved yet.</p>}
      </Modal>}
    </>
  );
}
