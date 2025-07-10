.PHONY: install dev stop build lint check deploy all

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Stop development server (kill process on port 3000)
stop:
	lsof -ti:3000 | xargs kill -9 || true

# Build for production
build:
	npm run build

# Run linter
lint:
	npm run lint

# # Check build
# check:lint build

# Deploy to Vercel
deploy:
	npx vercel --prod
