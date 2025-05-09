# Install npm if missing
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Installing via pacman..."
  pacman -S npm
else
  echo "npm is already installed!"
fi

# Install project dependencies (node modules)
echo "Installing npm packages…"
npm install

# start dev 
echo "Starting dev server…"
npm run dev
