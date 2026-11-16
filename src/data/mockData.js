export const initialCategories = [
  { id: 'cat-staff', name: 'Staff', subcategories: ['Administrative Staff', 'Non-Academic Staff', 'Office Staff'] },
  { id: 'cat-lecturers', name: 'Lecturers', subcategories: ['Senior Professors', 'Professors', 'Senior Lecturers', 'Lecturers', 'Degree Program Lecturers / BA', 'Degree Program Lecturers / BBA', 'Diploma Program Lecturers / DMD', 'Diploma Program Lecturers / DLIB', 'Diploma Program Lecturers / HDECCPD', 'Diploma Program Lecturers / DLT', 'Diploma Program Lecturers / DCE', 'Certificate Program Lecturers / CCBT', 'Certificate Program Lecturers / ACLH', 'Temporary Lecturers', 'Visiting Lecturers'] },
  { id: 'cat-students', name: 'Students', subcategories: ['Old Syllabus BA Students', 'New Syllabus BA Students', 'BBA Students', 'Diploma Students / DMD', 'Diploma Students / DLIB', 'Diploma Students / HDECCPD', 'Diploma Students / DLT', 'Diploma Students / DCE', 'Certificate Students / CCBT', 'Certificate Students / ACLH'] },
];

export const initialRecipients = [
  { id: 1, name: 'Dr. Nadeesha Perera', email: 'nadeesha.perera@pdn.ac.lk', category: 'Staff', subcategory: 'Administrative Staff', department: 'CDCE', status: 'Active' },
  { id: 2, name: 'Mr. Kasun Wijesinghe', email: 'kasun.wijesinghe@pdn.ac.lk', category: 'Staff', subcategory: 'Office Staff', department: 'Administration', status: 'Active' },
  { id: 3, name: 'Ms. Dinithi Fernando', email: 'dinithi.fernando@pdn.ac.lk', category: 'Staff', subcategory: 'Non-Academic Staff', department: 'Finance', status: 'Active' },
  { id: 4, name: 'Prof. S. Abeyratne', email: 's.abeyratne@pdn.ac.lk', category: 'Lecturers', subcategory: 'Senior Lecturers', department: 'Management Studies', status: 'Active' },
  { id: 5, name: 'Dr. Tharindu Jayawardena', email: 'tharindu.j@pdn.ac.lk', category: 'Lecturers', subcategory: 'Lecturers', department: 'Humanities', status: 'Active' },
  { id: 6, name: 'Ms. Amaya Silva', email: 'amaya.silva@pdn.ac.lk', category: 'Lecturers', subcategory: 'Temporary Lecturers', department: 'Social Sciences', status: 'Active' },
  { id: 7, name: 'Mr. Kavindu Rajapaksha', email: 'kavindu.r@students.pdn.ac.lk', category: 'Students', subcategory: 'Old Syllabus BA Students', department: 'Arts', status: 'Active' },
  { id: 8, name: 'Ms. Senuri Wickramasinghe', email: 'senuri.w@students.pdn.ac.lk', category: 'Students', subcategory: 'BBA Students', department: 'Business', status: 'Active' },
  { id: 9, name: 'Mr. Ashen Bandara', email: 'ashen.b@students.pdn.ac.lk', category: 'Students', subcategory: 'Diploma Students / DMD', department: 'CDCE', status: 'Active' },
  { id: 10, name: 'Ms. Piumi Gunawardena', email: 'piumi.g@students.pdn.ac.lk', category: 'Students', subcategory: 'Certificate Students / CCBT', department: 'CDCE', status: 'Inactive' },
  { id: 11, name: 'Dr. Ruwan Dissanayake', email: 'ruwan.d@pdn.ac.lk', category: 'Lecturers', subcategory: 'Visiting Lecturers', department: 'Languages', status: 'Active' },
  { id: 12, name: 'Mrs. Shalini Karunaratne', email: 'shalini.k@pdn.ac.lk', category: 'Staff', subcategory: 'Administrative Staff', department: 'Student Services', status: 'Active' },
  { id: 13, name: 'Demo Senior Professor', email: 'demo.senior.professor@example.com', category: 'Lecturers', subcategory: 'Senior Professors', department: 'CDCE', status: 'Active' },
  { id: 14, name: 'Demo Professor', email: 'demo.professor@example.com', category: 'Lecturers', subcategory: 'Professors', department: 'CDCE', status: 'Active' },
  { id: 15, name: 'Demo New Syllabus BA Student', email: 'demo.new.ba.student@example.com', category: 'Students', subcategory: 'New Syllabus BA Students', department: 'Arts', status: 'Active' },
  { id: 16, name: 'Demo Degree Program Lecturer - BA', email: 'demo.degree.ba@example.com', category: 'Lecturers', subcategory: 'Degree Program Lecturers / BA', department: 'CDCE', status: 'Active' },
  { id: 17, name: 'Demo Diploma Program Lecturer - DMD', email: 'demo.diploma.dmd@example.com', category: 'Lecturers', subcategory: 'Diploma Program Lecturers / DMD', department: 'CDCE', status: 'Active' },
  { id: 18, name: 'Demo Certificate Program Lecturer - CCBT', email: 'demo.certificate.ccbt@example.com', category: 'Lecturers', subcategory: 'Certificate Program Lecturers / CCBT', department: 'CDCE', status: 'Active' },
  { id: 19, name: 'Demo Degree Program Lecturer - BBA', email: 'demo.degree.bba@example.com', category: 'Lecturers', subcategory: 'Degree Program Lecturers / BBA', department: 'CDCE', status: 'Active' },
  { id: 20, name: 'Demo Diploma Program Lecturer - DLIB', email: 'demo.diploma.dlib@example.com', category: 'Lecturers', subcategory: 'Diploma Program Lecturers / DLIB', department: 'CDCE', status: 'Active' },
  { id: 21, name: 'Demo Diploma Program Lecturer - HDECCPD', email: 'demo.diploma.hdeccpd@example.com', category: 'Lecturers', subcategory: 'Diploma Program Lecturers / HDECCPD', department: 'CDCE', status: 'Active' },
  { id: 22, name: 'Demo Diploma Program Lecturer - DLT', email: 'demo.diploma.dlt@example.com', category: 'Lecturers', subcategory: 'Diploma Program Lecturers / DLT', department: 'CDCE', status: 'Active' },
  { id: 23, name: 'Demo Diploma Program Lecturer - DCE', email: 'demo.diploma.dce@example.com', category: 'Lecturers', subcategory: 'Diploma Program Lecturers / DCE', department: 'CDCE', status: 'Active' },
  { id: 24, name: 'Demo Certificate Program Lecturer - ACLH', email: 'demo.certificate.aclh@example.com', category: 'Lecturers', subcategory: 'Certificate Program Lecturers / ACLH', department: 'CDCE', status: 'Active' },
  { id: 25, name: 'Demo Diploma Student - DLIB', email: 'demo.diploma.student.dlib@example.com', category: 'Students', subcategory: 'Diploma Students / DLIB', department: 'CDCE', status: 'Active' },
  { id: 26, name: 'Demo Diploma Student - HDECCPD', email: 'demo.diploma.student.hdeccpd@example.com', category: 'Students', subcategory: 'Diploma Students / HDECCPD', department: 'CDCE', status: 'Active' },
  { id: 27, name: 'Demo Diploma Student - DLT', email: 'demo.diploma.student.dlt@example.com', category: 'Students', subcategory: 'Diploma Students / DLT', department: 'CDCE', status: 'Active' },
  { id: 28, name: 'Demo Diploma Student - DCE', email: 'demo.diploma.student.dce@example.com', category: 'Students', subcategory: 'Diploma Students / DCE', department: 'CDCE', status: 'Active' },
  { id: 29, name: 'Demo Certificate Student - ACLH', email: 'demo.certificate.student.aclh@example.com', category: 'Students', subcategory: 'Certificate Students / ACLH', department: 'CDCE', status: 'Active' },
];

export const initialRoles = [
  'Director',
  'System Analyst',
  'Senior Assistant Registrar',
  'Bursar',
  'Assistant Registrar',
  'Senior Assistant Bursar',
  'Other Administrative Officers',
].map((name, index) => ({ id: `role-${index}`, name, canSendEmail: true }));

export const initialUsers = [
  { id: 1, name: 'Dr. Nadeesha Perera', username: 'nperera', email: 'nadeesha.perera@pdn.ac.lk', role: 'Director', status: 'Active' },
  { id: 2, name: 'Mr. Kasun Wijesinghe', username: 'kwijesinghe', email: 'kasun.wijesinghe@pdn.ac.lk', role: 'System Analyst', status: 'Active' },
  { id: 3, name: 'Ms. Dinithi Fernando', username: 'dfernando', email: 'dinithi.fernando@pdn.ac.lk', role: 'Assistant Registrar', status: 'Active' },
  { id: 4, name: 'Mr. Sahan Bandara', username: 'sbandara', email: 'sahan.bandara@pdn.ac.lk', role: 'Other Administrative Officers', status: 'Inactive' },
];

export const initialHistory = [
  { id: 1, subject: 'Semester registration – important dates', sender: 'Dr. Nadeesha Perera', role: 'Director', groups: ['Students'], count: 420, date: '2026-11-12', status: 'Sent' },
  { id: 2, subject: 'Staff meeting – November', sender: 'Mr. Kasun Wijesinghe', role: 'System Analyst', groups: ['Staff'], count: 48, date: '2026-11-11', status: 'Sent' },
  { id: 3, subject: 'Guest lecture announcement', sender: 'Ms. Dinithi Fernando', role: 'Assistant Registrar', groups: ['Lecturers', 'Students'], count: 136, date: '2026-11-10', status: 'Sent' },
  { id: 4, subject: 'Course materials update', sender: 'Dr. Nadeesha Perera', role: 'Director', groups: ['Students'], count: 287, date: '2026-11-09', status: 'Failed' },
  { id: 5, subject: 'Monthly finance report', sender: 'Ms. Dinithi Fernando', role: 'Bursar', groups: ['Staff'], count: 23, date: '2026-11-08', status: 'Pending' },
  { id: 6, subject: 'Welcome to the new academic year', sender: 'Dr. Nadeesha Perera', role: 'Director', groups: ['Staff', 'Lecturers', 'Students'], count: 684, date: '2026-11-05', status: 'Sent' },
];

export const initialScheduled = [
  { id: 1, subject: 'December examination timetable', groups: ['Students'], date: '2026-12-01', time: '09:00', status: 'Scheduled' },
  { id: 2, subject: 'End-of-year staff appreciation', groups: ['Staff', 'Lecturers'], date: '2026-12-20', time: '08:30', status: 'Scheduled' },
];

export const initialTemplates = [
  { id: 1, name: 'General Announcement', subject: 'Important Announcement from CDCE', body: 'Dear {{recipient}},\n\nWe are pleased to share an important update from the Centre for Distance and Continuing Education.\n\nPlease find further information below.\n\nKind regards,\nCentre for Distance and Continuing Education\nUniversity of Peradeniya' },
  { id: 2, name: 'Course Reminder', subject: 'A reminder about your upcoming course', body: 'Dear {{recipient}},\n\nThis is a friendly reminder regarding your upcoming course with CDCE. Please check the student portal for the latest information.\n\nKind regards,\nCDCE Academic Office' },
  { id: 3, name: 'Staff Notice', subject: 'Notice for CDCE staff', body: 'Dear colleague,\n\nPlease note the following update for CDCE staff.\n\nThank you for your attention.\n\nKind regards,\nCDCE Administration' },
];

export const activityByMonth = [
  { month: 'Jun', sent: 28, delivered: 26 },
  { month: 'Jul', sent: 36, delivered: 34 },
  { month: 'Aug', sent: 32, delivered: 30 },
  { month: 'Sep', sent: 47, delivered: 44 },
  { month: 'Oct', sent: 41, delivered: 39 },
  { month: 'Nov', sent: 52, delivered: 49 },
];

export const announcements = [
  { title: 'System maintenance', description: 'Scheduled maintenance on 16 November, 8:00 PM – 9:00 PM.', date: '12 Nov 2026' },
  { title: 'New email templates available', description: 'Three institutional templates are ready to use in Compose Email.', date: '10 Nov 2026' },
  { title: 'Recipient list review', description: 'Please verify your recipient lists before the next semester.', date: '06 Nov 2026' },
];
