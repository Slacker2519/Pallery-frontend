# Pallery Frontend

A full stack image gallery web application built with React and Tailwind CSS.

## Features

- Browse public paintings from all users
- User authentication (register and login)
- Upload paintings via file or URL
- Tag-based search and filtering
- Public and private painting visibility
- Edit and delete your own paintings
- User profile page with paintings and albums
- Dark and light mode support
- Responsive design for mobile and desktop

## Tech Stack

- React 19
- Tailwind CSS 4
- Axios
- React Router DOM
- React Icons
- Vite

## Getting Started

### Prerequisites

- Node.js 18+
- Pallery backend running locally or deployed

### Installation

```bash
# clone the repository
git clone https://github.com/Slacker2519/Pallery-frontend.git
cd Pallery-frontend/pallery

# install dependencies
npm install

# create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_DB_URL=http://localhost:3000/api/gallery
```

### Running the App

```bash
# development
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Project Structure

```
src/
├── api/                  # API request functions
│   ├── api.js            # axios instance with auth interceptor
│   ├── painting.js       # painting API calls
│   ├── userApi.js        # user API calls
│   └── albumApi.js       # album API calls
│
├── components/           # reusable UI components
│   ├── Header/
│   ├── Sidebar/
│   ├── Gallery/
│   ├── PaintingFrame/
│   ├── FocusedPainting/
│   ├── PaintingDetailCard/
│   ├── AnimatedPanel/
│   ├── AuthPanel/
│   ├── ProtectedRoute/
│   ├── SafeLink/
│   ├── TagCard/
│   └── Overlay/
│
├── context/              # React context providers
│   ├── AuthContext.js    # auth context and hook
│   ├── AuthProvider.jsx  # auth state and logic
│   ├── ThemeContext.js   # theme context and hook
│   └── ThemeProvider.jsx # dark/light mode logic
│
├── pages/                # full page components
│   ├── Home/
│   ├── Profile/
│   ├── UpdateProfile/
│   └── PostPainting/
│
├── utils/                # helper functions
│   └── formatDate.js
│
├── constants/            # app constants
│   └── index.js
│
├── App.jsx               # main app component
└── main.jsx              # entry point and router
```

## Pages

| Page | Path | Auth Required |
|------|------|--------------|
| Home | `/` | No |
| Post Painting | `/post` | Yes |
| Profile | `/profile` | Yes |
| Update Profile | `/profile/update` | Yes |

## Key Features

### Authentication
Users can register and login directly from the home page without leaving it. An overlay panel slides in with the login/register form. After authenticating, the panel closes and the user stays on the home page.

### Gallery
The home page displays all public paintings in a masonry grid layout. Users can search by name, tags, author, or description by pressing Enter in the search bar.

### Painting Detail
Clicking a painting opens a detail panel showing name, tags, author, source, description, and upload date. If the logged in user owns the painting, edit and delete buttons are shown.

### Dark Mode
Theme preference is saved to localStorage and persists across sessions and page refreshes.

## Deployment

The frontend is deployed on Vercel. Every push to the `main` branch triggers an automatic deployment.

Live URL: [pallery.vercel.app](https://pallery.vercel.app)

## Related

- [Pallery Backend](https://github.com/Slacker2519/Pallery-backend) — Node.js/Express REST API
