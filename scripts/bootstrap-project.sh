#!/bin/bash
# Bootstrap script for setting up UIForge patterns in projects
# Usage: ./scripts/bootstrap-project.sh <project-type> <project-name>

set -euo pipefail

PROJECT_TYPE=${1:-"mcp"}
PROJECT_NAME=${2:-"uiforge-mcp"}
PATTERNS_REPO="uiforge-patterns/patterns"
PATTERNS_VERSION="v1.0"

echo "🚀 Bootstrapping $PROJECT_TYPE project: $PROJECT_NAME"
echo "📦 Using patterns from: $PATTERNS_REPO@$PATTERNS_VERSION"

# Function to download file from patterns repo
download_pattern() {
    local source_path="$1"
    local target_path="$2"
    local temp_file=$(mktemp)
    
    echo "📥 Downloading $source_path -> $target_path"
    
    if curl -fsSL "https://raw.githubusercontent.com/$PATTERNS_REPO/$PATTERNS_VERSION/$source_path" -o "$temp_file"; then
        mkdir -p "$(dirname "$target_path")"
        cp "$temp_file" "$target_path"
        echo "✅ Successfully downloaded $source_path"
    else
        echo "⚠️  Warning: Could not download $source_path, keeping local version if exists"
        rm -f "$temp_file"
    fi
}

# Create necessary directories
mkdir -p .github/workflows
mkdir -p .github/configs
mkdir -p .github/templates/project-setup

# Download base workflows
echo "📋 Setting up workflows..."
download_pattern ".github/workflows/base/ci.yml" ".github/workflows/ci.yml"
download_pattern ".github/workflows/base/security.yml" ".github/workflows/security.yml"
download_pattern ".github/workflows/base/dependencies.yml" ".github/workflows/dependencies.yml"

# Download reusable workflows
mkdir -p .github/workflows/reusable
download_pattern ".github/workflows/reusable/setup-node.yml" ".github/workflows/reusable/setup-node.yml"
download_pattern ".github/workflows/reusable/setup-python.yml" ".github/workflows/reusable/setup-python.yml"
download_pattern ".github/workflows/reusable/upload-coverage.yml" ".github/workflows/reusable/upload-coverage.yml"

# Download templates
echo "📄 Setting up templates..."
download_pattern ".github/templates/PULL_REQUEST_TEMPLATE.md" ".github/PULL_REQUEST_TEMPLATE.md"
download_pattern ".github/templates/ISSUE_TEMPLATE/bug_report.md" ".github/ISSUE_TEMPLATE/bug_report.md"
download_pattern ".github/templates/ISSUE_TEMPLATE/feature_request.md" ".github/ISSUE_TEMPLATE/feature_request.md"

# Download project-specific templates
download_pattern ".github/templates/project-setup/$PROJECT_TYPE.md" ".github/templates/project-setup/$PROJECT_TYPE.md"

# Download configurations
echo "⚙️  Setting up configurations..."
download_pattern ".github/configs/codecov.yml" ".codecov.yml"
download_pattern ".github/configs/renovate.json" "renovate.json"
download_pattern ".github/configs/codeql-config.yml" ".github/configs/codeql-config.yml"
download_pattern ".github/configs/branch-protection.yml" ".github/configs/branch-protection.yml"

# Customize based on project type
echo "🎨 Customizing for $PROJECT_TYPE project..."
case $PROJECT_TYPE in
  "gateway")
    echo "🐍 Adding Python-specific configurations..."
    # Create pyproject.toml with coverage settings if not exists
    if [[ ! -f "pyproject.toml" ]]; then
        cat > pyproject.toml << 'EOF'
[tool.pytest.ini_options]
minversion = "6.0"
addopts = "-ra -q --strict-markers --cov=src --cov-report=xml --cov-report=html --cov-fail-under=80"
testpaths = ["tests"]

[tool.coverage.run]
source = ["src"]
omit = ["tests/*", "*/tests/*"]

[tool.coverage.report]
fail_under = 80
show_missing = true
precision = 2
EOF
    fi
    ;;
  "webapp")
    echo "⚛️  Adding Next.js-specific configurations..."
    # Create next.config.js if not exists
    if [[ ! -f "next.config.js" ]]; then
        cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
EOF
    fi
    ;;
  "mcp")
    echo "🔧 Adding MCP-specific configurations..."
    # Create basic MCP server config if not exists
    if [[ ! -f "mcp.config.json" ]]; then
        cat > mcp.config.json << 'EOF'
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "MCP Server for $PROJECT_NAME",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js"
  }
}
EOF
    fi
    ;;
esac

# Create sync workflow for monthly pattern updates
echo "🔄 Setting up pattern synchronization..."
cat > .github/workflows/sync-patterns.yml << EOF
name: Sync Patterns
on:
  schedule:
    - cron: '0 2 1 * *'  # First of month at 02:00 UTC
  workflow_dispatch:

jobs:
  sync-patterns:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        
      - name: Sync from patterns repository
        run: |
          echo "🔄 Syncing patterns from $PATTERNS_REPO@$PATTERNS_VERSION"
          
          # Download latest templates
          curl -fsSL "https://raw.githubusercontent.com/$PATTERNS_REPO/$PATTERNS_VERSION/.github/templates/PULL_REQUEST_TEMPLATE.md" -o .github/PULL_REQUEST_TEMPLATE.md.new
          curl -fsSL "https://raw.githubusercontent.com/$PATTERNS_REPO/$PATTERNS_VERSION/.github/configs/codecov.yml" -o .codecov.yml.new
          curl -fsSL "https://raw.githubusercontent.com/$PATTERNS_REPO/$PATTERNS_VERSION/.github/configs/renovate.json" -o renovate.json.new
          
          # Compare and update if changed
          files_updated=false
          
          for file in .github/PULL_REQUEST_TEMPLATE.md .codecov.yml renovate.json; do
            if [[ -f "\${file}.new" ]]; then
              if ! diff -q "\$file" "\${file}.new" >/dev/null 2>&1; then
                mv "\${file}.new" "\$file"
                git add "\$file"
                files_updated=true
                echo "📝 Updated \$file"
              else
                rm -f "\${file}.new"
              fi
            fi
          done
          
          if [[ "\$files_updated" == "true" ]]; then
            git config --local user.email "action@github.com"
            git config --local user.name "GitHub Action"
            git commit -m "chore: sync patterns from $PATTERNS_REPO@$PATTERNS_VERSION"
            git push
            echo "✅ Patterns synchronized successfully"
          else
            echo "ℹ️  No pattern updates needed"
          fi
EOF

# Make bootstrap script executable
chmod +x scripts/bootstrap-project.sh

echo ""
echo "🎉 Project bootstrapped successfully!"
echo "📚 Next steps:"
echo "   1. Review and customize the downloaded configurations"
echo "   2. Update project-specific settings in workflows"
echo "   3. Commit and push the changes"
echo "   4. Test the CI/CD pipeline"
echo ""
echo "📖 Documentation: https://github.com/$PATTERNS_REPO/blob/main/docs/getting-started.md"