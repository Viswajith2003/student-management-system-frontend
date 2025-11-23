# Student Management System - Frontend

A modern, responsive web application for managing student information, academic records, and performance tracking. Built with React and Vite for optimal performance.

## 🚀 Features

### Admin Panel

- **Dashboard**: Overview of total students with statistics cards
- **Student Management**:
  - Add new students with detailed information
  - Edit existing student records
  - Delete students with confirmation
  - Search and pagination functionality
- **Subject Management**:
  - Add/edit/delete subjects and marks for students
  - Automatic grade calculation (S, A+, A, B+, B, C, D, F)
  - Pass/Fail status based on marks
  - Overall result calculation
- **Dark Theme UI**: Modern sidebar navigation with gradient cards

### Student Portal

- **Academic Dashboard**: View subjects, marks, grades, and performance
- **Student Profile**:
  - View personal information
  - Edit profile details (name, email, phone, gender)
  - Academic summary with pass/fail statistics
- **Secure Authentication**: JWT-based login system

## 🛠️ Tech Stack

- **React 19.2.0**: Modern React with hooks
- **Vite 7.2.4**: Lightning-fast build tool and dev server
- **React Router DOM 7.9.6**: Client-side routing
- **Axios 1.13.2**: HTTP client for API requests
- **Tailwind CSS 4.1.17**: Utility-first styling
- **React Icons**: Beautiful icon library

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend repository)

## 🔧 Installation

1. Clone the repository:

```bash
git clone <your-frontend-repo-url>
cd student-management-system-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001/api
```

4. Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 🌐 Environment Variables

| Variable       | Description          | Default                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5001/api` |

## 📱 Application Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── StudentSidebar.jsx
│   └── StudentTable.jsx
├── context/         # React Context providers
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── AdminLogin.jsx
│   ├── StudentLogin.jsx
│   ├── Dashboard.jsx
│   ├── AddStudent.jsx
│   ├── EditStudent.jsx
│   ├── StudentView.jsx
│   ├── StudentProfile.jsx
│   ├── SubjectsLanding.jsx
│   └── ManageSubjects.jsx
├── services/        # API services
│   └── api.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Protected routes automatically redirect unauthenticated users to the login page.

### Admin Login

- Default credentials set during backend setup
- Full access to all student records and management features

### Student Login

- Students use their registration number and password
- Access limited to personal dashboard and profile

## 🎨 UI Features

- **Dark Theme**: Professional dark blue color scheme (#081328 background, #0c1c3a sidebar)
- **Gradient Cards**: Beautiful gradient backgrounds for statistics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Feedback for successful operations

## 🔄 API Integration

All API calls are centralized in `src/services/api.js` with:

- Automatic JWT token attachment
- Base URL configuration
- Centralized error handling

## 📊 Grading System

| Grade | Marks Range |
| ----- | ----------- |
| S     | 90-100      |
| A+    | 85-89       |
| A     | 80-84       |
| B+    | 70-79       |
| B     | 60-69       |
| C     | 50-59       |
| D     | 40-49       |
| F     | Below 40    |

**Pass Mark**: 40

## 🚦 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




