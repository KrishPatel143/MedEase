const fs = require('fs');
const path = require('path');

const structure = {
  app: {
    admin: ['page.jsx'],
    patient: ['page.jsx'],
    staff: ['page.jsx', 'globals.css', 'layout.jsx'],
  },
  components: {
    admin: [
      'appointments.jsx',
      'dashboard-cards.jsx',
      'enhanced-appointments.jsx',
      'enhanced-dashboard-cards.jsx',
      'enhanced-finances.jsx',
      'enhanced-notifications.jsx',
      'enhanced-staff-management.jsx',
      'finances.jsx',
      'header.jsx',
      'mobile-nav.jsx',
      'notifications.jsx',
      'sidebar.jsx',
      'staff-management.jsx',
    ],
    patient: [
      'appointment-booking.jsx',
      'enhanced-appointment-booking.jsx',
      'hospital-services.jsx',
      'medical-records-access.jsx',
      'my-appointments.jsx',
      'prescription-management.jsx',
    ],
    staff: [
      'appointment-management.jsx',
      'enhanced-patient-check-in.jsx',
      'medical-records.jsx',
      'patient-check-in.jsx',
      'patient-history.jsx',
    ],
  },
  ui: ['theme-provider.jsx'],
};

function createStructure(base, obj) {
  for (const folder in obj) {
    const folderPath = path.join(base, folder);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const contents = obj[folder];
    if (Array.isArray(contents)) {
      contents.forEach(file => {
        const filePath = path.join(folderPath, file);
        fs.writeFileSync(filePath, '', 'utf8');
      });
    } else {
      createStructure(folderPath, contents);
    }
  }
}

createStructure('./', structure);
