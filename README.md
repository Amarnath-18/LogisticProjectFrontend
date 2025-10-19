# Logistic Shipment Tracker

A comprehensive React application for managing logistics and shipment tracking, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### User Roles

- **Admin**: Full system access with analytics dashboard, user management, report generation, and shipment oversight
- **Driver**: View assigned shipments, update shipment status, and track delivery progress
- **Customer**: Create shipments, track packages, and view shipment history

### Key Functionality

- **Authentication**: Secure login and registration with cookie-based authentication
- **Dashboard**: Role-based dashboards with relevant metrics and quick actions
- **Shipment Management**: Create, track, and manage shipments with real-time status updates
- **User Management**: Admin tools for managing users across all roles
- **Reports & Analytics**: Generate and download PDF reports with customizable date ranges
- **Public Tracking**: Track shipments without authentication using tracking numbers
- **Real-time Updates**: Track shipment location and status changes with detailed history

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit `.env` file and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Layout.tsx
│   ├── Modal.tsx
│   ├── ProtectedRoute.tsx
│   └── StatusBadge.tsx
├── context/            # React context providers
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── AdminDashboard.tsx
│   ├── CustomerDashboard.tsx
│   ├── Dashboard.tsx
│   ├── DriverDashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ReportsPage.tsx
│   ├── ShipmentDetailsPage.tsx
│   ├── ShipmentsPage.tsx
│   ├── TrackShipment.tsx
│   └── UsersPage.tsx
├── services/           # API service layer
│   ├── api.ts
│   ├── auth.service.ts
│   ├── report.service.ts
│   ├── shipment.service.ts
│   └── user.service.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## Routes

- `/login` - User login page
- `/register` - User registration page
- `/track` - Public shipment tracking (no auth required)
- `/` - Role-based dashboard (protected)
- `/shipments` - Shipment list and management (protected)
- `/shipments/:id` - Shipment details and tracking history (protected)
- `/users` - User management (Admin only)
- `/reports` - Report generation and download (Admin only)

## API Integration

The application connects to a backend API with the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/drivers` - Get all drivers

### Shipments
- `GET /api/shipments` - Get all shipments (filtered by role)
- `GET /api/shipments/:id` - Get shipment by ID
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/track/:trackingNumber` - Track shipment (public)
- `PUT /api/shipments/:id/assign-driver` - Assign driver to shipment
- `PUT /api/shipments/:id/status` - Update shipment status

### Reports
- `GET /api/reports/analytics` - Get dashboard analytics
- `POST /api/reports/generate` - Generate PDF report
- `GET /api/reports/:id/download` - Download report
- `GET /api/reports` - Get all reports

## Features by Role

### Admin Dashboard
- View total shipments, active shipments, delivered shipments
- Monitor driver and customer counts
- Visualize shipments by status with progress bars
- Track monthly shipment statistics
- Quick access to user management, shipments, and reports

### Driver Dashboard
- View total assigned shipments
- Track active vs delivered shipments
- Access assigned shipments with quick status updates
- Update shipment location and status

### Customer Dashboard
- View total, in-transit, and delivered shipments
- Create new shipments with receiver details
- Track all shipments with real-time status
- Access detailed shipment tracking history

## Design Features

- Modern, clean interface with professional color scheme
- Responsive design for mobile, tablet, and desktop
- Intuitive navigation with role-based menu items
- Loading states and error handling
- Modal dialogs for forms
- Status badges with color coding
- Data tables with hover effects
- Icon integration throughout the UI

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## License

MIT
