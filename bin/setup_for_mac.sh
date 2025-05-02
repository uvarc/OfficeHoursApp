# exit if fail 
set -e

# Check if homebrew is installed (otherwise tell them to install homebrow)
if !command -v brew >/dev/null 2>&1; then
  echo "Homebrew not found. Please install Homebrew first!"
  exit 1
fi

# Install npm if missing
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Installing via Homebrew..."
  brew install npm
else
  echo "npm is already installed!"
fi

# Install project dependencies (node modules)
echo "Installing npm packages…"
npm install

# start dev 
echo "Starting dev server…"
npm run dev