// IT LIVE Academy - CRM Realistik Mock Data Generator & Initial State

export const COURSES_DATA = [
  { id: 'c-1', name: 'Frontend React & Next.js', category: 'Development', price: 1600000, duration: '6 oy', lessonsCount: 72, mentorId: 't-1', studentsCount: 42, color: '#3B82F6', icon: 'Code' },
  { id: 'c-2', name: 'Backend Node.js & Go', category: 'Development', price: 1700000, duration: '6 oy', lessonsCount: 72, mentorId: 't-2', studentsCount: 36, color: '#10B981', icon: 'Server' },
  { id: 'c-3', name: 'Python & Data Science', category: 'Development', price: 1500000, duration: '5 oy', lessonsCount: 60, mentorId: 't-3', studentsCount: 28, color: '#F59E0B', icon: 'Terminal' },
  { id: 'c-4', name: 'Mobile Flutter & Dart', category: 'Development', price: 1800000, duration: '6 oy', lessonsCount: 72, mentorId: 't-4', studentsCount: 22, color: '#06B6D4', icon: 'Smartphone' },
  { id: 'c-5', name: 'UI/UX & Product Design', category: 'Design', price: 1400000, duration: '4 oy', lessonsCount: 48, mentorId: 't-5', studentsCount: 30, color: '#8B5CF6', icon: 'Figma' },
  { id: 'c-6', name: 'Grafik Dizayn & Brending', category: 'Design', price: 1200000, duration: '3 oy', lessonsCount: 36, mentorId: 't-6', studentsCount: 25, color: '#EC4899', icon: 'Palette' },
  { id: 'c-7', name: 'SMM & Target Marketing', category: 'Marketing', price: 1100000, duration: '3 oy', lessonsCount: 36, mentorId: 't-7', studentsCount: 34, color: '#F97316', icon: 'Megaphone' },
  { id: 'c-8', name: 'IELTS Intensive 7.5+', category: 'Language', price: 1300000, duration: '4 oy', lessonsCount: 48, mentorId: 't-8', studentsCount: 48, color: '#6366F1', icon: 'Globe' },
  { id: 'c-9', name: 'General English (CEFR)', category: 'Language', price: 900000, duration: '6 oy', lessonsCount: 72, mentorId: 't-8', studentsCount: 55, color: '#38BDF8', icon: 'Languages' },
  { id: 'c-10', name: 'IT Foundation & Kompyuter', category: 'Basic', price: 800000, duration: '2 oy', lessonsCount: 24, mentorId: 't-9', studentsCount: 32, color: '#14B8A6', icon: 'Laptop' },
  { id: 'c-11', name: 'Kiberxavfsizlik (CyberSec)', category: 'Security', price: 2100000, duration: '6 oy', lessonsCount: 72, mentorId: 't-10', studentsCount: 18, color: '#EF4444', icon: 'ShieldCheck' },
  { id: 'c-12', name: 'Zamonaviy Matematika', category: 'Science', price: 750000, duration: '6 oy', lessonsCount: 72, mentorId: 't-9', studentsCount: 24, color: '#84CC16', icon: 'Binary' }
]

export const TEACHERS_DATA = [
  { id: 't-1', name: 'Bobur Aliyev', specialty: 'Frontend React / Vue', phone: '+998 90 123 45 67', salaryType: 'percentage', rate: 45, groupsCount: 3, studentsCount: 42, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { id: 't-2', name: 'Javohir Toshmatov', specialty: 'Senior Backend Go / Node', phone: '+998 93 456 78 90', salaryType: 'fixed', rate: 12000000, groupsCount: 2, studentsCount: 36, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { id: 't-3', name: 'Farrux Umarov', specialty: 'Python & AI Engineer', phone: '+998 99 789 01 23', salaryType: 'percentage', rate: 40, groupsCount: 2, studentsCount: 28, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { id: 't-4', name: 'Sardorbek Rahimov', specialty: 'Flutter Mobile Expert', phone: '+998 94 321 65 49', salaryType: 'fixed', rate: 10500000, groupsCount: 2, studentsCount: 22, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { id: 't-5', name: 'Dilnoza Ergasheva', specialty: 'Lead Product Designer', phone: '+998 97 888 12 34', salaryType: 'percentage', rate: 50, groupsCount: 2, studentsCount: 30, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { id: 't-6', name: 'Shahzod Mirzayev', specialty: 'Graphic & 3D Artist', phone: '+998 90 654 32 10', salaryType: 'fixed', rate: 8000000, groupsCount: 2, studentsCount: 25, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { id: 't-7', name: 'Malika Karimova', specialty: 'Targetolog & SMM Lead', phone: '+998 91 222 33 44', salaryType: 'percentage', rate: 45, groupsCount: 2, studentsCount: 34, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120' },
  { id: 't-8', name: 'John Peterson & Nilufar', specialty: 'IELTS Expert (8.5)', phone: '+998 95 111 22 33', salaryType: 'fixed', rate: 14000000, groupsCount: 4, studentsCount: 103, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { id: 't-9', name: 'Akrom Qosimov', specialty: 'Foundation & Math', phone: '+998 90 999 88 77', salaryType: 'percentage', rate: 40, groupsCount: 3, studentsCount: 56, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { id: 't-10', name: 'Bekzod Nurmatov', specialty: 'Kiberxavfsizlik Mutaxassisi', phone: '+998 93 777 55 11', salaryType: 'fixed', rate: 15000000, groupsCount: 1, studentsCount: 18, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' }
]

export const GROUPS_DATA = [
  { id: 'g-1', name: 'F-24 (React Pro)', courseId: 'c-1', teacherId: 't-1', days: 'Du-Chor-Jum', time: '14:00 - 16:00', room: 'Xona 101 (Lab)', capacity: 16, status: 'Active', startDate: '2026-08-01', endDate: '2027-02-01' },
  { id: 'g-2', name: 'F-25 (Frontend Night)', courseId: 'c-1', teacherId: 't-1', days: 'Se-Pay-Shan', time: '18:30 - 20:30', room: 'Xona 102', capacity: 15, status: 'Active', startDate: '2026-09-10', endDate: '2027-03-10' },
  { id: 'g-3', name: 'B-12 (Node Master)', courseId: 'c-2', teacherId: 't-2', days: 'Du-Chor-Jum', time: '16:00 - 18:00', room: 'Xona 103', capacity: 18, status: 'Active', startDate: '2026-07-15', endDate: '2027-01-15' },
  { id: 'g-4', name: 'B-14 (Go Backend)', courseId: 'c-2', teacherId: 't-2', days: 'Se-Pay-Shan', time: '14:00 - 16:00', room: 'Xona 101 (Lab)', capacity: 16, status: 'Active', startDate: '2026-09-01', endDate: '2027-03-01' },
  { id: 'g-5', name: 'PY-08 (Python Core)', courseId: 'c-3', teacherId: 't-3', days: 'Du-Chor-Jum', time: '10:00 - 12:00', room: 'Xona 104', capacity: 15, status: 'Active', startDate: '2026-08-15', endDate: '2027-01-15' },
  { id: 'g-6', name: 'FL-05 (Flutter Cross)', courseId: 'c-4', teacherId: 't-4', days: 'Se-Pay-Shan', time: '16:00 - 18:00', room: 'Xona 102', capacity: 14, status: 'Active', startDate: '2026-09-05', endDate: '2027-03-05' },
  { id: 'g-7', name: 'UI-11 (UX & Figma)', courseId: 'c-5', teacherId: 't-5', days: 'Du-Chor-Jum', time: '18:30 - 20:30', room: 'Xona 201 (iMac)', capacity: 16, status: 'Active', startDate: '2026-08-20', endDate: '2026-12-20' },
  { id: 'g-8', name: 'GD-09 (Photoshop & Ai)', courseId: 'c-6', teacherId: 't-6', days: 'Se-Pay-Shan', time: '10:00 - 12:00', room: 'Xona 201 (iMac)', capacity: 15, status: 'Active', startDate: '2026-09-15', endDate: '2026-12-15' },
  { id: 'g-9', name: 'SMM-04 (Targeting)', courseId: 'c-7', teacherId: 't-7', days: 'Du-Chor-Jum', time: '16:00 - 18:00', room: 'Xona 202', capacity: 18, status: 'Active', startDate: '2026-08-10', endDate: '2026-11-10' },
  { id: 'g-10', name: 'IELTS-19 (Target 7.5)', courseId: 'c-8', teacherId: 't-8', days: 'Du-Chor-Jum', time: '09:00 - 11:00', room: 'Xona 203', capacity: 20, status: 'Active', startDate: '2026-07-01', endDate: '2026-11-01' },
  { id: 'g-11', name: 'ENG-32 (Inter Mediate)', courseId: 'c-9', teacherId: 't-8', days: 'Se-Pay-Shan', time: '09:00 - 11:00', room: 'Xona 203', capacity: 20, status: 'Active', startDate: '2026-08-01', endDate: '2027-02-01' },
  { id: 'g-12', name: 'FND-15 (Start IT)', courseId: 'c-10', teacherId: 't-9', days: 'Du-Chor-Jum', time: '14:00 - 16:00', room: 'Xona 104', capacity: 16, status: 'Active', startDate: '2026-09-01', endDate: '2026-11-01' },
  { id: 'g-13', name: 'SEC-02 (Ethical Hack)', courseId: 'c-11', teacherId: 't-10', days: 'Se-Pay-Shan', time: '18:30 - 20:30', room: 'Xona 103', capacity: 18, status: 'Active', startDate: '2026-08-01', endDate: '2027-02-01' },
  { id: 'g-14', name: 'MATH-06 (Olimpiada)', courseId: 'c-12', teacherId: 't-9', days: 'Du-Chor-Jum', time: '11:00 - 13:00', room: 'Xona 202', capacity: 15, status: 'Active', startDate: '2026-09-01', endDate: '2027-03-01' }
]

// 150+ ta o'zbekcha ismli talabalarni hosil qilish
const FIRST_NAMES = ['Azizbek', 'Madina', 'Javohir', 'Dilnoza', 'Shohruh', 'Nodira', 'Jasur', 'Gulnoza', 'Otabek', 'Kamola', 'Rustam', 'Ziyoda', 'Bobur', 'Mohira', 'Ulugbek', 'Shahnoza', 'Bekzod', 'Rayhon', 'Alisher', 'Farangiz', 'Sanjar', 'Dildora', 'Muhriddin', 'Sabina', 'Jamshid', 'Nilufar', 'Shavkat', 'Gulzoda', 'Ilhom', 'Umida']
const LAST_NAMES = ['Karimov', 'Yusupova', 'Aliyev', 'Toshmatov', 'Rahimov', 'Ergasheva', 'Mirzayev', 'Qosimov', 'Nurmatov', 'Saidov', 'Xoliqov', 'Ibrohimov', 'Vohidov', 'Qodirov', 'Sobirova', 'G‘aniyev', 'Tursunov', 'Sultonov', 'Hasanov', 'Mahmudov']
const CITIES = ['Toshkent', 'Samarqand', 'Farg‘ona', 'Andijon', 'Namangan', 'Buxoro', 'Navoiy', 'Qarshi', 'Urganch', 'Jizzax']

export function generateInitialStudents() {
  return []
}

export function generateInitialLeads() {
  const sources = ['Instagram', 'Telegram', 'Tavsiya', 'Sayt']
  const stages = ['new', 'contacted', 'trial', 'waiting_payment', 'converted', 'rejected']
  const leads = []

  const leadNames = [
    'Olimjon Jo‘rayev', 'Shahlo Ismoilova', 'Farhod Nazarov', 'Diyora Rustamova', 'Sardor Qodirov',
    'Zulfiya Boboyeva', 'Mirzo Saidov', 'Guli Asqarova', 'Sherzod To‘xtayev', 'Nargiza Olimova',
    'Akmal Ergashev', 'Munisa Karimova', 'Doniyor Fayziyev', 'Sevara Mirzayeva', 'Bahodir Yusupov',
    'Malika Mahmudova', 'Jasurbek Shokirov', 'Lola Ahmadova', 'Temur Rahmonov', 'Mohinur Xasanova',
    'Eldor Jalolov', 'Kamila Sobirova', 'Sanjarbek Normatov', 'Feruza Umarova', 'Davron Bekmirzayev',
    'Gulbahor Nurmatova', 'Rustamjon Aliyev', 'Dilrabo G‘aniyeva', 'Sunnatilla Mamatov', 'Shahnoza Bozorova',
    'Mansur Sharipov', 'Zarina Qosimova', 'Islombek Davlatov', 'Nozima Xoliqova', 'Boburjon Ortiqov',
    'Dildora Rajabova', 'Anvar Karimov', 'Nilufar Yoqubova', 'Xurshid Shukurov', 'Shahzoda Zokirova'
  ]

  leadNames.forEach((name, idx) => {
    const course = COURSES_DATA[idx % COURSES_DATA.length]
    const stage = stages[idx % stages.length]
    const source = sources[idx % sources.length]
    leads.push({
      id: `lead-${idx + 1}`,
      name: name,
      phone: `+998 93 ${100 + idx} ${20 + (idx % 80)} ${10 + (idx % 90)}`,
      courseId: course.id,
      courseName: course.name,
      stage: stage,
      source: source,
      createdAt: `2026-10-${String((idx % 28) + 1).padStart(2, '0')}`,
      nextCallDate: `2026-10-${String(((idx + 2) % 28) + 1).padStart(2, '0')}`,
      notes: `${source} orqali murojaat qilgan. Kurs narxi va vaqti bilan qiziqmoqda.`
    })
  })

  return leads
}

export function generateInitialPayments() {
  const methods = ['Payme', 'Click', 'Naqd', 'Karta']
  const statuses = ['Paid', 'Paid', 'Paid', 'Pending']
  const payments = []

  let pCount = 0
  for (let m = 5; m <= 10; m++) {
    for (let d = 1; d <= 25; d += 2) {
      pCount++
      const studentIdx = (m * 10 + d) % 150
      const course = COURSES_DATA[pCount % COURSES_DATA.length]
      const method = methods[pCount % methods.length]
      const status = statuses[pCount % statuses.length]

      payments.push({
        id: `pay-${1000 + pCount}`,
        studentId: `s-${studentIdx + 1}`,
        studentName: `${FIRST_NAMES[studentIdx % FIRST_NAMES.length]} ${LAST_NAMES[studentIdx % LAST_NAMES.length]}`,
        courseName: course.name,
        amount: course.price,
        paidDate: `2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        method: method,
        status: status,
        receiptNumber: `REC-2026-${String(2000 + pCount)}`,
        note: `Oylik to'lov (${m}-oy uchun)`
      })
    }
  }
  return payments
}

export const INITIAL_SETTINGS = {
  centerName: 'IT LIVE Academy',
  centerPhone: '+998 (71) 200-00-55',
  centerEmail: 'info@itlive.uz',
  centerAddress: 'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi, 107-B bino',
  logo: 'IT LIVE',
  website: 'https://itlive.uz',
  currency: 'UZS',
  language: 'uz',
  taxNumber: '308945612'
}
