#!/bin/bash

echo "🎨 Applying Nerdio Branding to Timeline Calculator"
echo "================================================="
echo ""
echo "NEW Nerdio Brand Colors:"
echo "  • Primary (Eastern Blue): #239CBB"
echo "  • Secondary (Viking): #77CADC"
echo "  • Dark (Firefly): #0F2A38"
echo "  • Light: #E8F5F9"
echo ""

# Create backup
BACKUP_DIR="backups/pre-nerdio-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "💾 Creating backup in $BACKUP_DIR..."
cp -r src "$BACKUP_DIR/"
cp tailwind.config.js "$BACKUP_DIR/"
echo "✅ Backup complete"
echo ""

# Step 1: Update tailwind.config.js
echo "📝 Step 1: Updating tailwind.config.js with Nerdio colors..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        nerdio: {
          // Primary - Eastern Blue
          primary: {
            50: '#E8F5F9',
            100: '#D1EBF3',
            200: '#A3D7E7',
            300: '#77CADC',
            400: '#4DB6D0',
            500: '#239CBB',  // Main Primary
            600: '#1B7A95',
            700: '#145770',
            800: '#0D394A',
            900: '#061C25',
          },
          // Secondary - Viking (for accents)
          secondary: {
            50: '#F0F9FB',
            100: '#E1F3F7',
            200: '#C3E7EF',
            300: '#A5DBE7',
            400: '#8ED2DF',
            500: '#77CADC',  // Main Secondary
            600: '#5BB8D1',
            700: '#4297B3',
            800: '#316F85',
            900: '#1F4756',
          },
          // Dark - Firefly
          dark: '#0F2A38',
          // Light background
          light: '#E8F5F9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
EOF
echo "✅ tailwind.config.js updated"
echo ""

# Step 2: Update src/index.css
echo "📝 Step 2: Updating src/index.css..."
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
EOF
echo "✅ index.css updated"
echo ""

# Step 3: Replace colors in src/App.jsx
echo "📝 Step 3: Replacing colors in src/App.jsx..."

# Primary button colors (indigo -> Nerdio primary)
sed -i.bak 's/bg-indigo-600/bg-nerdio-primary-500/g' src/App.jsx
sed -i.bak 's/hover:bg-indigo-700/hover:bg-nerdio-primary-600/g' src/App.jsx
sed -i.bak 's/text-indigo-600/text-nerdio-primary-500/g' src/App.jsx
sed -i.bak 's/focus:border-indigo-500/focus:border-nerdio-primary-500/g' src/App.jsx
sed -i.bak 's/border-indigo-500/border-nerdio-primary-500/g' src/App.jsx

# Blue stat cards -> Nerdio primary
sed -i.bak 's/bg-blue-50/bg-nerdio-primary-50/g' src/App.jsx
sed -i.bak 's/border-blue-200/border-nerdio-primary-200/g' src/App.jsx
sed -i.bak 's/text-blue-900/text-nerdio-dark/g' src/App.jsx
sed -i.bak 's/text-blue-700/text-nerdio-primary-700/g' src/App.jsx

# Purple stat cards -> Nerdio secondary
sed -i.bak 's/bg-purple-50/bg-nerdio-secondary-50/g' src/App.jsx
sed -i.bak 's/border-purple-200/border-nerdio-secondary-200/g' src/App.jsx
sed -i.bak 's/text-purple-900/text-nerdio-dark/g' src/App.jsx
sed -i.bak 's/text-purple-700/text-nerdio-secondary-700/g' src/App.jsx

# Dark text (gray-800/900 -> Nerdio dark)
sed -i.bak 's/text-gray-900/text-nerdio-dark/g' src/App.jsx
sed -i.bak 's/text-gray-800/text-nerdio-dark/g' src/App.jsx

# Remove backup files
rm -f src/App.jsx.bak

echo "✅ Colors updated in App.jsx"
echo ""

echo "✅ NERDIO BRANDING APPLIED!"
echo "=========================="
echo ""
echo "🎯 Next: npm install && npm run dev"
