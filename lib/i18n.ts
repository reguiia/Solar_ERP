import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.crm': 'CRM',
      'nav.projects': 'Projects',
      'nav.design': 'Design & Simulation',
      'nav.compliance': 'Compliance',
      'nav.procurement': 'Procurement',
      'nav.finance': 'Finance',
      'nav.reporting': 'Reporting',
      'nav.settings': 'Settings',
      
      // Common
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.add': 'Add',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.loading': 'Loading...',
      'common.actions': 'Actions',
      'common.status': 'Status',
      'common.date': 'Date',
      'common.name': 'Name',
      'common.email': 'Email',
      'common.phone': 'Phone',
      'common.location': 'Location',
      'common.type': 'Type',
      'common.value': 'Value',
      'common.progress': 'Progress',
      'common.budget': 'Budget',
      'common.spent': 'Spent',
      
      // Dashboard
      'dashboard.welcome': 'Welcome to SolarPro ERP',
      'dashboard.subtitle': 'Comprehensive management system for solar installation companies in Tunisia',
      'dashboard.totalRevenue': 'Total Revenue',
      'dashboard.activeProjects': 'Active Projects',
      'dashboard.conversionRate': 'Conversion Rate',
      'dashboard.recentActivity': 'Recent Activity',
      
      // CRM
      'crm.title': 'CRM - Customer Relationship Management',
      'crm.addLead': 'Add Lead',
      'crm.totalLeads': 'Total Leads',
      'crm.qualifiedLeads': 'Qualified Leads',
      'crm.pipelineValue': 'Pipeline Value',
      'crm.searchLeads': 'Search leads...',
      'crm.leadsPipeline': 'Leads Pipeline',
      'crm.contact': 'Contact',
      'crm.lastContact': 'Last Contact',
      'crm.convertToCustomer': 'Convert to Customer',
      'crm.scheduleFollowup': 'Schedule Follow-up',
      'crm.addNote': 'Add Note',
      
      // Projects
      'projects.title': 'Project Management',
      'projects.newProject': 'New Project',
      'projects.activeProjects': 'Active Projects',
      'projects.completedThisMonth': 'Completed This Month',
      'projects.totalValue': 'Total Value',
      'projects.overdue': 'Overdue',
      'projects.searchProjects': 'Search projects...',
      'projects.client': 'Client',
      'projects.projectManager': 'Project Manager',
      'projects.systemSize': 'System Size',
      'projects.startDate': 'Start Date',
      'projects.endDate': 'End Date',
      'projects.viewDetails': 'View Details',
      
      // Finance
      'finance.title': 'Finance Management',
      'finance.newInvoice': 'New Invoice',
      'finance.totalRevenue': 'Total Revenue',
      'finance.paidInvoices': 'Paid Invoices',
      'finance.overdue': 'Overdue',
      'finance.subsidies': 'Subsidies',
      'finance.searchInvoices': 'Search invoices...',
      'finance.invoicesQuotes': 'Invoices & Quotes',
      'finance.project': 'Project',
      'finance.amount': 'Amount',
      'finance.dueDate': 'Due Date',
      'finance.availableSubsidies': 'Available Subsidies & Incentives',
      
      // Status values
      'status.new': 'New',
      'status.contacted': 'Contacted',
      'status.qualified': 'Qualified',
      'status.proposal': 'Proposal',
      'status.negotiation': 'Negotiation',
      'status.closed': 'Closed',
      'status.planning': 'Planning',
      'status.design': 'Design',
      'status.approval': 'Approval',
      'status.procurement': 'Procurement',
      'status.installation': 'Installation',
      'status.testing': 'Testing',
      'status.completed': 'Completed',
      'status.draft': 'Draft',
      'status.sent': 'Sent',
      'status.paid': 'Paid',
      'status.overdue': 'Overdue',
      'status.pending': 'Pending',
      'status.approved': 'Approved',
      'status.rejected': 'Rejected',
      
      // Types
      'type.residential': 'Residential',
      'type.industrial': 'Industrial',
      'type.agricultural': 'Agricultural',
      'type.quote': 'Quote',
      'type.invoice': 'Invoice',
      'type.payment': 'Payment'
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.dashboard': 'Tableau de bord',
      'nav.crm': 'CRM',
      'nav.projects': 'Projets',
      'nav.design': 'Conception et Simulation',
      'nav.compliance': 'Conformité',
      'nav.procurement': 'Approvisionnement',
      'nav.finance': 'Finance',
      'nav.reporting': 'Rapports',
      'nav.settings': 'Paramètres',
      
      // Common
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.add': 'Ajouter',
      'common.edit': 'Modifier',
      'common.delete': 'Supprimer',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler',
      'common.loading': 'Chargement...',
      'common.actions': 'Actions',
      'common.status': 'Statut',
      'common.date': 'Date',
      'common.name': 'Nom',
      'common.email': 'Email',
      'common.phone': 'Téléphone',
      'common.location': 'Localisation',
      'common.type': 'Type',
      'common.value': 'Valeur',
      'common.progress': 'Progrès',
      'common.budget': 'Budget',
      'common.spent': 'Dépensé',
      
      // Dashboard
      'dashboard.welcome': 'Bienvenue sur SolarPro ERP',
      'dashboard.subtitle': 'Système de gestion complet pour les entreprises d\'installation solaire en Tunisie',
      'dashboard.totalRevenue': 'Chiffre d\'affaires total',
      'dashboard.activeProjects': 'Projets actifs',
      'dashboard.conversionRate': 'Taux de conversion',
      'dashboard.recentActivity': 'Activité récente',
      
      // CRM
      'crm.title': 'CRM - Gestion de la relation client',
      'crm.addLead': 'Ajouter un prospect',
      'crm.totalLeads': 'Total des prospects',
      'crm.qualifiedLeads': 'Prospects qualifiés',
      'crm.pipelineValue': 'Valeur du pipeline',
      'crm.searchLeads': 'Rechercher des prospects...',
      'crm.leadsPipeline': 'Pipeline des prospects',
      'crm.contact': 'Contact',
      'crm.lastContact': 'Dernier contact',
      'crm.convertToCustomer': 'Convertir en client',
      'crm.scheduleFollowup': 'Planifier un suivi',
      'crm.addNote': 'Ajouter une note',
      
      // Projects
      'projects.title': 'Gestion de projets',
      'projects.newProject': 'Nouveau projet',
      'projects.activeProjects': 'Projets actifs',
      'projects.completedThisMonth': 'Terminés ce mois',
      'projects.totalValue': 'Valeur totale',
      'projects.overdue': 'En retard',
      'projects.searchProjects': 'Rechercher des projets...',
      'projects.client': 'Client',
      'projects.projectManager': 'Chef de projet',
      'projects.systemSize': 'Taille du système',
      'projects.startDate': 'Date de début',
      'projects.endDate': 'Date de fin',
      'projects.viewDetails': 'Voir les détails',
      
      // Finance
      'finance.title': 'Gestion financière',
      'finance.newInvoice': 'Nouvelle facture',
      'finance.totalRevenue': 'Chiffre d\'affaires total',
      'finance.paidInvoices': 'Factures payées',
      'finance.overdue': 'En retard',
      'finance.subsidies': 'Subventions',
      'finance.searchInvoices': 'Rechercher des factures...',
      'finance.invoicesQuotes': 'Factures et devis',
      'finance.project': 'Projet',
      'finance.amount': 'Montant',
      'finance.dueDate': 'Date d\'échéance',
      'finance.availableSubsidies': 'Subventions et incitations disponibles',
      
      // Status values
      'status.new': 'Nouveau',
      'status.contacted': 'Contacté',
      'status.qualified': 'Qualifié',
      'status.proposal': 'Proposition',
      'status.negotiation': 'Négociation',
      'status.closed': 'Fermé',
      'status.planning': 'Planification',
      'status.design': 'Conception',
      'status.approval': 'Approbation',
      'status.procurement': 'Approvisionnement',
      'status.installation': 'Installation',
      'status.testing': 'Test',
      'status.completed': 'Terminé',
      'status.draft': 'Brouillon',
      'status.sent': 'Envoyé',
      'status.paid': 'Payé',
      'status.overdue': 'En retard',
      'status.pending': 'En attente',
      'status.approved': 'Approuvé',
      'status.rejected': 'Rejeté',
      
      // Types
      'type.residential': 'Résidentiel',
      'type.industrial': 'Industriel',
      'type.agricultural': 'Agricole',
      'type.quote': 'Devis',
      'type.invoice': 'Facture',
      'type.payment': 'Paiement'
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.dashboard': 'لوحة التحكم',
      'nav.crm': 'إدارة العملاء',
      'nav.projects': 'المشاريع',
      'nav.design': 'التصميم والمحاكاة',
      'nav.compliance': 'الامتثال',
      'nav.procurement': 'المشتريات',
      'nav.finance': 'المالية',
      'nav.reporting': 'التقارير',
      'nav.settings': 'الإعدادات',
      
      // Common
      'common.search': 'بحث',
      'common.filter': 'تصفية',
      'common.add': 'إضافة',
      'common.edit': 'تعديل',
      'common.delete': 'حذف',
      'common.save': 'حفظ',
      'common.cancel': 'إلغاء',
      'common.loading': 'جاري التحميل...',
      'common.actions': 'الإجراءات',
      'common.status': 'الحالة',
      'common.date': 'التاريخ',
      'common.name': 'الاسم',
      'common.email': 'البريد الإلكتروني',
      'common.phone': 'الهاتف',
      'common.location': 'الموقع',
      'common.type': 'النوع',
      'common.value': 'القيمة',
      'common.progress': 'التقدم',
      'common.budget': 'الميزانية',
      'common.spent': 'المنفق',
      
      // Dashboard
      'dashboard.welcome': 'مرحباً بك في SolarPro ERP',
      'dashboard.subtitle': 'نظام إدارة شامل لشركات تركيب الطاقة الشمسية في تونس',
      'dashboard.totalRevenue': 'إجمالي الإيرادات',
      'dashboard.activeProjects': 'المشاريع النشطة',
      'dashboard.conversionRate': 'معدل التحويل',
      'dashboard.recentActivity': 'النشاط الأخير',
      
      // CRM
      'crm.title': 'إدارة العلاقات مع العملاء',
      'crm.addLead': 'إضافة عميل محتمل',
      'crm.totalLeads': 'إجمالي العملاء المحتملين',
      'crm.qualifiedLeads': 'العملاء المؤهلين',
      'crm.pipelineValue': 'قيمة خط الأنابيب',
      'crm.searchLeads': 'البحث عن العملاء المحتملين...',
      'crm.leadsPipeline': 'خط أنابيب العملاء المحتملين',
      'crm.contact': 'جهة الاتصال',
      'crm.lastContact': 'آخر اتصال',
      'crm.convertToCustomer': 'تحويل إلى عميل',
      'crm.scheduleFollowup': 'جدولة المتابعة',
      'crm.addNote': 'إضافة ملاحظة',
      
      // Projects
      'projects.title': 'إدارة المشاريع',
      'projects.newProject': 'مشروع جديد',
      'projects.activeProjects': 'المشاريع النشطة',
      'projects.completedThisMonth': 'مكتمل هذا الشهر',
      'projects.totalValue': 'القيمة الإجمالية',
      'projects.overdue': 'متأخر',
      'projects.searchProjects': 'البحث عن المشاريع...',
      'projects.client': 'العميل',
      'projects.projectManager': 'مدير المشروع',
      'projects.systemSize': 'حجم النظام',
      'projects.startDate': 'تاريخ البداية',
      'projects.endDate': 'تاريخ الانتهاء',
      'projects.viewDetails': 'عرض التفاصيل',
      
      // Finance
      'finance.title': 'الإدارة المالية',
      'finance.newInvoice': 'فاتورة جديدة',
      'finance.totalRevenue': 'إجمالي الإيرادات',
      'finance.paidInvoices': 'الفواتير المدفوعة',
      'finance.overdue': 'متأخر',
      'finance.subsidies': 'الإعانات',
      'finance.searchInvoices': 'البحث عن الفواتير...',
      'finance.invoicesQuotes': 'الفواتير والعروض',
      'finance.project': 'المشروع',
      'finance.amount': 'المبلغ',
      'finance.dueDate': 'تاريخ الاستحقاق',
      'finance.availableSubsidies': 'الإعانات والحوافز المتاحة',
      
      // Status values
      'status.new': 'جديد',
      'status.contacted': 'تم الاتصال',
      'status.qualified': 'مؤهل',
      'status.proposal': 'اقتراح',
      'status.negotiation': 'تفاوض',
      'status.closed': 'مغلق',
      'status.planning': 'تخطيط',
      'status.design': 'تصميم',
      'status.approval': 'موافقة',
      'status.procurement': 'شراء',
      'status.installation': 'تركيب',
      'status.testing': 'اختبار',
      'status.completed': 'مكتمل',
      'status.draft': 'مسودة',
      'status.sent': 'مرسل',
      'status.paid': 'مدفوع',
      'status.overdue': 'متأخر',
      'status.pending': 'معلق',
      'status.approved': 'موافق عليه',
      'status.rejected': 'مرفوض',
      
      // Types
      'type.residential': 'سكني',
      'type.industrial': 'صناعي',
      'type.agricultural': 'زراعي',
      'type.quote': 'عرض سعر',
      'type.invoice': 'فاتورة',
      'type.payment': 'دفع'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n