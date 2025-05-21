# Inventory Management System

A modern inventory management system with dark mode, built with FastAPI backend and React frontend.

## Features

- **Dashboard**: Overview of key metrics and charts
- **Inventory Management**: Add, edit, delete items with search and filtering
- **Transaction Tracking**: Record purchases and sales
- **Supplier Management**: Manage supplier information
- **User Management**: Role-based access control (admin, manager, staff)
- **Analytics**: Visual reports and charts
- **Dark Mode**: Toggle between light and dark themes
- **Settings**: Configure application preferences

## Installation

### Prerequisites

- Python 3.8+ for backend
- Node.js 16+ for frontend
- npm or pnpm for package management

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd inventory-system/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
   
   If requirements.txt is missing, install the following packages:
   ```
   pip install fastapi uvicorn pydantic python-dotenv
   ```

5. Start the backend server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd inventory-system/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   pnpm run dev
   ```

4. Access the application at `http://localhost:5173`

## Usage

1. **Dashboard**: View key metrics and performance indicators
2. **Inventory**: Manage your items, add new products, update quantities
3. **Transactions**: Record purchases and sales, view transaction history
4. **Suppliers**: Add and manage supplier information
5. **Users**: Create and manage user accounts with different access levels
6. **Analytics**: View sales trends, inventory value, and other reports
7. **Settings**: Configure application preferences, toggle dark mode

## Data Storage

This demo version uses an in-memory database. All data will be reset when the server restarts. For production use, you would need to implement a persistent database like PostgreSQL, MySQL, or MongoDB.

## Technologies Used

### Backend
- FastAPI (Python web framework)
- Pydantic (Data validation)
- Uvicorn (ASGI server)

### Frontend
- React (UI library)
- TypeScript (Type-safe JavaScript)
- Tailwind CSS (Utility-first CSS framework)
- Shadcn/UI (Component library)
- Lucide React (Icon library)
- Recharts (Chart library)

## License

MIT
