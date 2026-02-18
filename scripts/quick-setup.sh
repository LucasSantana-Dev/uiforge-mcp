#!/bin/bash

# UIForge MCP Quick Setup Script
# This script helps set up the Codecov and Snyk integration quickly

set -e

echo "🚀 UIForge MCP Quick Setup"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    echo ""
    
    # Check if git is available
    if command -v git &> /dev/null; then
        print_status "success" "Git is available"
    else
        print_status "error" "Git is not available"
        exit 1
    fi
    
    # Check if npm is available
    if command -v npm &> /dev/null; then
        print_status "success" "npm is available"
    else
        print_status "error" "npm is not available"
        exit 1
    fi
    
    # Check if we're in a git repository
    if [ -d ".git" ]; then
        print_status "success" "Git repository detected"
    else
        print_status "error" "Not in a git repository"
        exit 1
    fi
    
    echo ""
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    echo ""
    
    if npm ci --legacy-peer-deps; then
        print_status "success" "Dependencies installed successfully"
    else
        print_status "error" "Failed to install dependencies"
        exit 1
    fi
    
    echo ""
}

# Run tests to ensure everything works
run_tests() {
    echo "🧪 Running tests..."
    echo ""
    
    if npm test; then
        print_status "success" "Tests passed"
    else
        print_status "error" "Tests failed"
        exit 1
    fi
    
    echo ""
}

# Generate coverage
generate_coverage() {
    echo "📊 Generating coverage report..."
    echo ""
    
    if npm run test:coverage; then
        print_status "success" "Coverage report generated"
        
        if [ -f "coverage/coverage-summary.json" ]; then
            local coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct // 0' 2>/dev/null || echo "0")
            print_status "info" "Current coverage: ${coverage}%"
            
            if (( $(echo "$coverage >= 80" | bc -l) )); then
                print_status "success" "Coverage meets 80% threshold"
            else
                print_status "warning" "Coverage is below 80% threshold"
            fi
        fi
    else
        print_status "error" "Failed to generate coverage"
        exit 1
    fi
    
    echo ""
}

# Build the project
build_project() {
    echo "🔨 Building project..."
    echo ""
    
    if npm run build; then
        print_status "success" "Build completed successfully"
        
        if [ -f "dist/index.js" ]; then
            local size=$(stat -f%s dist/index.js 2>/dev/null || stat -c%s dist/index.js 2>/dev/null || echo "0")
            local size_kb=$((size / 1024))
            print_status "info" "Bundle size: ${size_kb}KB"
        fi
    else
        print_status "error" "Build failed"
        exit 1
    fi
    
    echo ""
}

# Validate setup
validate_setup() {
    echo "🔍 Validating setup..."
    echo ""
    
    # Check if all workflow files exist
    local workflows=(
        ".github/workflows/ci.yml"
        ".github/workflows/setup-deployment.yml"
        ".github/workflows/security-monitoring.yml"
    )
    
    for workflow in "${workflows[@]}"; do
        if [ -f "$workflow" ]; then
            print_status "success" "Found $(basename "$workflow")"
        else
            print_status "error" "Missing $(basename "$workflow")"
        fi
    done
    
    # Check documentation
    if [ -f "docs/SECURITY_COVERAGE_SETUP.md" ]; then
        print_status "success" "Setup documentation available"
    else
        print_status "warning" "Setup documentation not found"
    fi
    
    echo ""
}

# Show next steps
show_next_steps() {
    echo "🎯 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up GitHub secrets:"
    echo "   - SNYK_TOKEN: Get from https://app.snyk.io/account"
    echo "   - CODECOV_TOKEN: Get from https://codecov.io/"
    echo "   - NPM_TOKEN: Get from https://www.npmjs.com/settings/tokens"
    echo ""
    echo "2. Commit and push changes:"
    echo "   git add ."
    echo "   git commit -m 'feat: Add Codecov and Snyk integrations'"
    echo "   git push origin main"
    echo ""
    echo "3. Monitor GitHub Actions:"
    echo "   - Check CI workflow execution"
    echo "   - Review security scan results"
    echo "   - Verify coverage reports"
    echo ""
    echo "4. Configure external services:"
    echo "   - Activate repository on Codecov"
    echo "   - Set up Snyk project monitoring"
    echo "   - Configure GitHub Security settings"
    echo ""
    echo "📚 For detailed setup instructions, see:"
    echo "   - docs/SECURITY_COVERAGE_SETUP.md"
    echo "   - docs/INTEGRATION_SUMMARY.md"
    echo ""
    
    print_status "success" "Quick setup completed!"
}

# Main execution
main() {
    echo "Starting UIForge MCP quick setup..."
    echo ""
    
    check_prerequisites
    install_dependencies
    run_tests
    generate_coverage
    build_project
    validate_setup
    show_next_steps
}

# Run main function
main
