# Pace Calculator

A simple, interactive web application for runners to calculate pace, speed, and projected finish times for various race distances.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue)](https://anden100.github.io/pace-calculator/)

## Features

- **Distance Selection**: Choose from 5K, 10K, Half Marathon, or Marathon with easy-to-use button controls
- **Time Input**: Enter your goal time in hours, minutes, and seconds
- **Pace Slider**: Quickly adjust pace using an intuitive drag slider (2:30/km to 10:00/km range)
- **Real-time Calculations**: See instant results for:
  - Pace per kilometer
  - Pace per mile
  - Speed in km/h and mph
- **Projected Times**: View estimated finish times for other distances at the same pace
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Vite** - Fast build tool and development server
- **Alpine.js** - Lightweight reactive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **GitHub Pages** - Free hosting via GitHub Actions

## Usage

1. Select your target distance (5K, 10K, Half Marathon, or Marathon)
2. Enter your goal finish time using the time inputs, or adjust the pace slider
3. View your required pace and speed
4. See projected times for other distances at the same pace

When you switch distances, the finish time automatically adjusts to maintain the same pace.

## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anden100/pace-calculator.git
cd pace-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates a production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The workflow triggers on every push to the `main` branch.

## Project Structure

```
pace-calculator/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
├── dist/                    # Production build output
├── public/                  # Static assets
├── src/
│   ├── main.js             # Main Alpine.js application logic
│   ├── style.css           # Tailwind CSS imports
│   ├── counter.js          # Example counter component (unused)
│   └── javascript.svg      # Vite logo
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Interactivity powered by [Alpine.js](https://alpinejs.dev/)
- Hosted on [GitHub Pages](https://pages.github.com/)
