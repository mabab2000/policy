# Rwanda Policy Management System

A comprehensive, production-ready frontend application for managing the entire public policy lifecycle in Rwanda, from ideation to implementation, monitoring, and citizen engagement.

## 🎯 Overview

This system supports Rwanda's governance structure and Imihigo-based accountability framework, enabling efficient policy management across all levels of government.

## ✨ Features

### Complete Policy Lifecycle Management

1. **Policy Ideation & Drafting**
   - Create and manage policy proposals
   - Define objectives, problem statements, and target populations
   - Align with Vision 2050 and National Strategy for Transformation (NST)
   - Version control and approval workflows

2. **Stakeholder Consultation**
   - Stakeholder mapping and management
   - Public and private consultation tracking
   - Feedback collection and categorization
   - Approval workflow management

3. **Cabinet & Legal Readiness**
   - Cabinet submission tracking
   - Legal review status monitoring
   - Decision logs and timestamps
   - Document management

4. **Implementation Planning**
   - Convert policies into programs, projects, and activities
   - Budget allocation and tracking
   - Timeline management
   - Institutional assignments

5. **Imihigo Integration**
   - Map policy activities to national and district Imihigo
   - KPI definition and tracking
   - Performance indicators and targets
   - Achievement monitoring

6. **Decentralized Execution**
   - District and sector-level dashboards
   - Task assignment and progress tracking
   - Evidence upload (documents, photos)
   - Real-time status updates

7. **Monitoring & Evaluation (M&E)**
   - KPI dashboards with interactive charts
   - Progress vs target analysis
   - Risk and issue tracking
   - Automated performance scoring

8. **Citizen Engagement**
   - Citizen portal for policy awareness
   - Feedback submission system
   - Complaint management
   - Response tracking

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Framework**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **API Integration**: Axios
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript

## 🎨 Design System

The application uses Rwanda's national colors:
- **Primary (Blue)**: Main actions, navigation, primary buttons
- **Success (Green)**: Successful operations, completed statuses
- **Warning (Yellow)**: Warnings, pending actions, medium priority

All components feature:
- 2px borders for clear visual hierarchy
- Consistent spacing and typography
- Accessible color contrasts
- Responsive design for all screen sizes

## 👥 User Roles & Permissions

### Role-Based Access Control (RBAC)

1. **Super Admin (Central Government)**
   - Full system access
   - User management
   - National oversight and reporting

2. **Ministry Officer**
   - Policy creation and management
   - Stakeholder consultation
   - Implementation planning
   - Performance monitoring

3. **District Officer**
   - Policy execution oversight
   - District-level Imihigo management
   - Progress reporting
   - Citizen feedback management

4. **Sector/Cell Officer**
   - Activity execution
   - Progress report submission
   - Evidence upload
   - Citizen engagement

5. **Citizen**
   - View policies
   - Submit feedback
   - Track feedback status
   - Access public information

6. **Auditor / M&E Officer**
   - Performance monitoring
   - Evaluation and reporting
   - Data analysis
   - Audit trails

## 📁 Project Structure

```
policy/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (sidebar, header)
│   │   ├── policy/        # Policy-specific components
│   │   └── ui/            # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── PoliciesPage.tsx
│   │   ├── CreatePolicyPage.tsx
│   │   ├── PolicyDetailPage.tsx
│   │   ├── StakeholdersPage.tsx
│   │   ├── ImplementationPage.tsx
│   │   ├── ImihigoPage.tsx
│   │   ├── ExecutionPage.tsx
│   │   ├── MonitoringPage.tsx
│   │   ├── CitizenFeedbackPage.tsx
│   │   └── LegalCabinetPage.tsx
│   ├── store/             # Zustand state management
│   ├── services/          # API services and mock data
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   ├── lib/               # Utility functions
│   ├── routes/            # Route configuration
│   └── App.tsx            # Main application component
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   cd f:\policy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Accounts

The system includes demo accounts for testing all user roles:

| Email | Password | Role |
|-------|----------|------|
| admin@gov.rw | password123 | Super Admin |
| ministry@gov.rw | password123 | Ministry Officer |
| district@gov.rw | password123 | District Officer |
| sector@gov.rw | password123 | Sector Officer |
| citizen@example.com | password123 | Citizen |
| auditor@gov.rw | password123 | Auditor |

## 📊 Sample User Journey

### Example: Policy Creation → Approval → Implementation → Evaluation

1. **Ministry Officer** creates a new policy:
   - Navigate to "Policies" → "Create Policy"
   - Fill in policy details, objectives, and strategic alignment
   - Submit as draft

2. **Stakeholder Consultation**:
   - Navigate to "Stakeholders"
   - Add stakeholder organizations
   - Collect and review feedback
   - Update policy based on input

3. **Cabinet Approval**:
   - Navigate to "Legal & Cabinet"
   - Submit policy for cabinet review
   - Track approval status
   - Attach legal documentation

4. **Implementation Planning**:
   - Navigate to "Implementation"
   - Create programs and projects
   - Define activities with budgets and timelines
   - Assign to districts and sectors

5. **Imihigo Integration**:
   - Navigate to "Imihigo"
   - Map activities to performance contracts
   - Define KPIs and targets
   - Set baseline measurements

6. **Execution** (District/Sector Officer):
   - Navigate to "Execution"
   - View assigned activities
   - Submit progress reports
   - Upload evidence

7. **Monitoring** (M&E Officer):
   - Navigate to "Monitoring & Evaluation"
   - Review progress dashboards
   - Analyze performance metrics
   - Identify risks and issues

8. **Citizen Feedback**:
   - Citizens navigate to "Citizen Feedback"
   - Submit feedback, suggestions, or complaints
   - Officers respond and track resolution

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 API Integration

The application is configured to work with a backend API. Update the API URL in your environment:

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

The current implementation uses mock data for demonstration. To integrate with a real backend:
- Update `src/services/api.ts` to remove mock data
- Implement actual API endpoints
- Update authentication flow in `src/store/authStore.ts`

## 📈 Key Components

### Reusable UI Components

- **Button**: Primary, success, warning, outline, and ghost variants
- **Input**: Text input with validation and error handling
- **Select**: Dropdown with custom styling
- **Textarea**: Multi-line text input
- **Card**: Container with header, content, and footer
- **Badge**: Status indicators with color variants
- **Table**: Data table with sorting and row actions
- **Modal**: Popup dialogs for forms and confirmations
- **StatsCard**: Dashboard statistics with icons and trends
- **LoadingSpinner**: Loading state indicator
- **EmptyState**: No data placeholder with actions

### Layout

- **Responsive sidebar** navigation with role-based menu items
- **Sticky header** with user profile
- **Protected routes** with authentication checks
- **Mobile-friendly** hamburger menu

## 🎯 Key Features Implementation

### Forms & Validation
All forms use React Hook Form with Zod schema validation for:
- Required field validation
- Email format validation
- Minimum/maximum length checks
- Custom business rule validation

### Data Visualization
Interactive charts using Recharts:
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Responsive and accessible

### State Management
Zustand stores for:
- Authentication state
- User session management
- Global application state

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## 🔒 Security Features

- JWT-based authentication
- Protected routes with role checks
- Secure token storage
- Automatic session timeout
- XSS protection through React
- CSRF token support ready

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Adaptive layouts for tablets and phones

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment to:
- Nginx
- Apache
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Environment Variables

Set production environment variables:
```env
VITE_API_URL=https://api.yourdomain.rw/api
```

## 🤝 Contributing

This is a government project. For contributions:
1. Follow the established code style
2. Write clear commit messages
3. Add comments for complex logic
4. Test thoroughly before submission
5. Update documentation as needed

## 📄 License

Government of Rwanda - Internal Use

## 🙏 Acknowledgments

- Built for Rwanda Digital Transformation Initiative
- Aligned with Rwanda Vision 2050
- Supports National Strategy for Transformation (NST)
- Implements Imihigo Performance Contract Framework

## 📞 Support

For technical support or questions:
- Technical Team: tech@gov.rw
- Documentation: [Internal Wiki]
- Training: [Training Portal]

---

**Powered by Rwanda Government Digital Transformation**

*Building a prosperous Rwanda through digital innovation* 🇷🇼
#   p o l i c y 3 6 0  
 "# policy" 
