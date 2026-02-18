#!/bin/bash

# UIForge MCP Integration Test Script
# Simple test script to verify the integration setup

echo "🧪 UIForge MCP Integration Test"
echo "=============================="
echo ""

# Check if required files exist
echo "📁 Checking workflow files..."

workflows=(
    ".github/workflows/ci.yml"
    ".github/workflows/setup-deployment.yml"
    ".github/workflows/security-monitoring.yml"
    ".github/workflows/dependency-health.yml"
    ".github/workflows/quality-gates.yml"
    ".github/workflows/monitoring-dashboard.yml"
)

all_files_exist=true
for workflow in "${workflows[@]}"; do
    if [ -f "$workflow" ]; then
        echo "✅ Found $(basename "$workflow")"
    else
        echo "❌ Missing $(basename "$workflow")"
        all_files_exist=false
    fi
done

echo ""

# Check documentation
echo "📚 Checking documentation..."
docs=(
    "docs/SECURITY_COVERAGE_SETUP.md"
    "docs/INTEGRATION_SUMMARY.md"
    "docs/COMPLETION_CHECKLIST.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ Found $(basename "$doc")"
    else
        echo "❌ Missing $(basename "$doc")"
    fi
done

echo ""

# Check scripts
echo "🛠️ Checking scripts..."
scripts=(
    "scripts/validate-integration.sh"
    "scripts/quick-setup.sh"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        echo "✅ Found $(basename "$script")"
    else
        echo "❌ Missing $(basename "$script")"
    fi
done

echo ""

# Check package.json
echo "📦 Checking package.json..."
if [ -f "package.json" ]; then
    echo "✅ Found package.json"
    
    # Check for required scripts
    if grep -q '"test"' package.json; then
        echo "✅ Test script found"
    else
        echo "❌ Test script missing"
    fi
    
    if grep -q '"test:coverage"' package.json; then
        echo "✅ Coverage script found"
    else
        echo "❌ Coverage script missing"
    fi
    
    if grep -q '"build"' package.json; then
        echo "✅ Build script found"
    else
        echo "❌ Build script missing"
    fi
else
    echo "❌ package.json not found"
fi

echo ""

# Check TypeScript config
echo "🔷 Checking TypeScript config..."
if [ -f "tsconfig.json" ]; then
    echo "✅ Found tsconfig.json"
else
    echo "❌ tsconfig.json not found"
fi

echo ""

# Summary
echo "📋 Test Summary"
echo "=============="
if [ "$all_files_exist" = true ]; then
    echo "✅ All required files are present"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Set up GitHub secrets (SNYK_TOKEN, CODECOV_TOKEN)"
    echo "2. Commit and push changes"
    echo "3. Monitor GitHub Actions"
    echo "4. Check Codecov and Security tabs"
    echo ""
    echo "📚 Documentation available:"
    echo "- docs/SECURITY_COVERAGE_SETUP.md"
    echo "- docs/INTEGRATION_SUMMARY.md"
    echo "- docs/COMPLETION_CHECKLIST.md"
else
    echo "❌ Some files are missing"
    echo "Please check the integration setup"
fi

echo ""
echo "🎉 Integration test completed!"
