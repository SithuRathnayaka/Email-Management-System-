import { createContext, useContext, useState } from 'react';
import {
  initialCategories,
  initialHistory,
  initialRecipients,
  initialRoles,
  initialScheduled,
  initialTemplates,
  initialUsers,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [recipients, setRecipients] = useState(initialRecipients);
  const [categories, setCategories] = useState(initialCategories);
  const [history, setHistory] = useState(initialHistory);
  const [scheduled, setScheduled] = useState(initialScheduled);
  const [templates, setTemplates] = useState(initialTemplates);
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [drafts, setDrafts] = useState([]);
  const [composeTemplate, setComposeTemplate] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    window.setTimeout(() => setToast(null), 3600);
  };

  return (
    <AppContext.Provider value={{
      user, setUser, recipients, setRecipients, categories, setCategories,
      history, setHistory, scheduled, setScheduled, templates, setTemplates,
      users, setUsers, roles, setRoles, drafts, setDrafts, composeTemplate, setComposeTemplate,
      notify, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
