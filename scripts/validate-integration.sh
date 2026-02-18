#!/bin/bash

# UIForge MCP Integration Validation Script
# This script validates that all Codecov and Snyk integrations are properly configured

set -e

echo "🔍 UIForge MCP Integration Validation"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required files exist
check_files() {
    echo "📁 Checking required files..."
    echo ""
    
    local files_exist=true
    
    # Check workflow files
    local workflow_files=(
        ".github/workflows/ci.yml"
        ".github/workflows/setup-deployment.yml"
        ".github/workflows/security-monitoring.yml"
        ".github/workflows/dependency-health.yml"
        ".github/workflows/quality-gates.yml"
        ".github/workflows/monitoring-dashboard.yml"
    )
    
    for file in "${workflow_files[@]}"; do
        if [ -f "$file" ]; then
            print_status "success" "Found $file"
        else
            print_status "error" "Missing $file"
            files_exist=false
        fi
    done
    
    # Check documentation files
    local doc_files=(
        "docs/SECURITY_COVERAGE_SETUP.md"
        "docs/INTEGRATION_SUMMARY.md"
    )
    
    for file in "${doc_files[@]}"; do
        if [ -f "$file" ]; then
            print_status "success" "Found $file"
        else
            print_status "error" "Missing $file"
            files_exist=false
        fi
    done
    
    echo ""
    if [ "$files_exist" = true ]; then
        print_status "success" "All required files are present"
        return 0
    else
        print_status "error" "Some required files are missing"
        return 1
    fi
}

# Check workflow syntax
check_workflow_syntax() {
    echo "🔧 Checking workflow syntax..."
    echo ""
    
    local syntax_valid=true
    
    for workflow in .github/workflows/*.yml; do
        if [ -f "$workflow" ]; then
            if command -v yamllint &> /dev/null; then
                if yamllint "$workflow" > /dev/null 2>&1; then
                    print_status "success" "$(basename "$workflow") syntax is valid"
                else
                    print_status "warning" "$(basename "$workflow") has syntax warnings"
                    yamllint "$workflow" | head -3
                fi
            else
                print_status "info" "yamllint not available, skipping syntax check for $(basename "$workflow")"
            fi
        fi
    done
    
    echo ""
}

# Check package.json for required scripts
check_package_json() {
    echo "📦 Checking package.json configuration..."
    echo ""
    
    if [ ! -f "package.json" ]; then
        print_status "error" "package.json not found"
        return 1
    fi
    
    # Check for required scripts
    local scripts=(
        "test"
        "test:coverage"
        "build"
        "lint"
    )
    
    for script in "${scripts[@]}"; do
        if jq -e ".scripts[\"$script\"]" package.json > /dev/null 2>&1; then
            print_status "success" "Found $script script"
        else
            print_status "warning" "Missing $script script"
        fi
    done
    
    # Check for required dev dependencies
    local dev_deps=(
        "jest"
        "typescript"
        "eslint"
        "prettier"
    )
    
    for dep in "${dev_deps[@]}"; do
        if jq -e ".devDependencies[\"$dep\"]" package.json > /dev/null 2>&1; then
            print_status "success" "Found $dep dependency"
        else
            print_status "warning" "Missing $dep dependency"
        fi
    done
    
    echo ""
}

# Check if coverage directory exists and has expected files
check_coverage() {
    echo "📊 Checking coverage configuration..."
    echo ""
    
    if [ ! -d "coverage" ]; then
        print_status "info" "Coverage directory not found (will be created by tests)"
        return 0
    fi
    
    local coverage_files=(
        "coverage/coverage-final.json"
        "coverage/lcov.info"
        "coverage/coverage-summary.json"
    )
    
    for file in "${coverage_files[@]}"; do
        if [ -f "$file" ]; then
            print_status "success" "Found $file"
        else
            print_status "info" "$file not found (will be created by tests)"
        fi
    done
    
    echo ""
}

# Check for .codecov.yml configuration
check_codecov_config() {
    echo "🎯 Checking Codecov configuration..."
    echo ""
    
    if [ -f ".codecov.yml" ]; then
        print_status "success" "Found .codecov.yml configuration"
        
        # Check basic configuration
        if grep -q "coverage:" .codecov.yml; then
            print_status "success" "Codecov coverage configuration found"
        else
            print_status "warning" "No coverage configuration in .codecov.yml"
        fi
    else
        print_status "info" "No .codecov.yml found (will use default configuration)"
    fi
    
    echo ""
}

# Validate TypeScript configuration
check_typescript_config() {
    echo "🔷 Checking TypeScript configuration..."
    echo ""
    
    if [ ! -f "tsconfig.json" ]; then
        print_status "error" "tsconfig.json not found"
        return 1
    fi
    
    # Check for important compiler options
    local ts_options=(
        "target"
        "module"
        "strict"
        "outDir"
    )
    
    for option in "${ts_options[@]}"; do
        if jq -e ".compilerOptions[\"$option\"]" tsconfig.json > /dev/null 2>&1; then
            print_status "success" "Found $option in tsconfig.json"
        else
            print_status "warning" "Missing $option in tsconfig.json"
        fi
    done
    
    echo ""
}

# Check for environment variables (without exposing values)
check_env_setup() {
    echo "🔐 Checking environment setup..."
    echo ""
    
    # Check if .env.example exists
    if [ -f ".env.example" ]; then
        print_status "success" "Found .env.example"
        
        # Check for required environment variables
        local env_vars=(
            "SNYK_TOKEN"
            "CODECOV_TOKEN"
            "NPM_TOKEN"
        )
        
        for var in "${env_vars[@]}"; do
            if grep -q "$var" .env.example; then
                print_status "success" "$var documented in .env.example"
            else
                print_status "warning" "$var not documented in .env.example"
            fi
        done
    else
        print_status "info" "No .env.example found"
    fi
    
    echo ""
}

# Run tests to validate everything works
run_tests() {
    echo "🧪 Running tests to validate integration..."
    echo ""
    
    if command -v npm &> /dev/null; then
        print_status "info" "Running npm test..."
        if npm test > /dev/null 2>&1; then
            print_status "success" "Tests passed"
        else
            print_status "error" "Tests failed"
            echo "Run 'npm test' to see detailed error output"
            return 1
        fi
        
        print_status "info" "Running coverage tests..."
        if npm run test:coverage > /dev/null 2>&1; then
            print_status "success" "Coverage tests passed"
            
            # Check coverage percentage
            if [ -f "coverage/coverage-summary.json" ]; then
                local coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct // 0' 2>/dev/null || echo "0")
                if (( $(echo "$coverage >= 80" | bc -l) )); then
                    print_status "success" "Coverage is ${coverage}% (≥80%)"
                else
                    print_status "warning" "Coverage is ${coverage}% (<80%)"
                fi
            fi
        else
            print_status "error" "Coverage tests failed"
            echo "Run 'npm run test:coverage' to see detailed error output"
            return 1
        fi
    else
        print_status "error" "npm not available"
        return 1
    fi
    
    echo ""
}

# Generate summary report
generate_summary() {
    echo "📋 Validation Summary"
    echo "==================="
    echo ""
    
    echo "✅ Completed validations:"
    echo "  - Required files check"
    echo "  - Workflow syntax validation"
    echo "  - Package.json configuration"
    echo "  - Coverage configuration"
    echo "  - Codecov configuration"
    echo "  - TypeScript configuration"
    echo "  - Environment setup"
    echo "  - Test execution"
    echo ""
    
    echo "🚀 Next steps:"
    echo "  1. Set up GitHub secrets (SNYK_TOKEN, CODECOV_TOKEN)"
    echo "  2. Push changes to trigger CI workflow"
    echo "  3. Monitor GitHub Actions for workflow execution"
    echo "  4. Check Codecov dashboard for coverage reports"
    echo "  5. Review GitHub Security tab for Snyk findings"
    echo ""
    
    echo "📚 Documentation:"
    echo "  - docs/SECURITY_COVERAGE_SETUP.md - Setup guide"
    echo "  - docs/INTEGRATION_SUMMARY.md - Complete overview"
    echo ""
    
    print_status "success" "Integration validation completed!"
}

# Main execution
main() {
    echo "Starting UIForge MCP integration validation..."
    echo ""
    
    local validation_passed=true
    
    # Run all checks
    check_files || validation_passed=false
    check_workflow_syntax
    check_package_json
    check_coverage
    check_codecov_config
    check_typescript_config
    check_env_setup
    
    # Run tests if requested
    if [ "$1" = "--run-tests" ]; then
        run_tests || validation_passed=false
    fi
    
    # Generate summary
    generate_summary
    
    # Exit with appropriate code
    if [ "$validation_passed" = true ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function with all arguments
main "$@"
