#!/bin/bash
# Validation script for UIForge patterns
# Usage: ./scripts/validate-patterns.sh [--verbose]

set -euo pipefail

VERBOSE=${1:-"false"}
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TOTAL_TESTS++))
    
    log "Running test: $test_name"
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC} $test_name"
        ((PASSED_TESTS++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} $test_name"
        ((FAILED_TESTS++))
        return 1
    fi
}

echo "🧪 Validating UIForge Patterns in uiforge-mcp"
echo "=========================================="

# Test 1: Check required directories exist
run_test "Required directories exist" "[[ -d '.github/workflows' && -d '.github/configs' && -d 'scripts' && -d 'src' ]]"

# Test 2: Check base workflows
run_test "Base CI workflow exists" "[[ -f '.github/workflows/base/ci.yml' ]]"
run_test "Reusable setup-node workflow exists" "[[ -f '.github/workflows/reusable/setup-node.yml' ]]"
run_test "Reusable upload-coverage workflow exists" "[[ -f '.github/workflows/reusable/upload-coverage.yml' ]]"

# Test 3: Check configuration files
run_test "Codecov configuration exists" "[[ -f '.github/configs/codecov.yml' ]]"
run_test "CodeQL configuration exists" "[[ -f '.github/configs/codeql-config.yml' ]]"

# Test 4: Check scripts
run_test "Bootstrap script exists and is executable" "[[ -f 'scripts/bootstrap-project.sh' && -x 'scripts/bootstrap-project.sh' ]]"

# Test 5: Validate YAML syntax
echo ""
echo "📋 Validating YAML syntax..."

yaml_files=(
    ".github/workflows/base/ci.yml"
    ".github/workflows/reusable/setup-node.yml"
    ".github/workflows/reusable/upload-coverage.yml"
    ".github/configs/codecov.yml"
    ".github/configs/codeql-config.yml"
)

for yaml_file in "${yaml_files[@]}"; do
    if [[ -f "$yaml_file" ]]; then
        run_test "YAML syntax: $yaml_file" "yamllint '$yaml_file'"
    fi
done

# Test 6: Validate shell scripts
echo ""
echo "🔧 Validating shell scripts..."

shell_scripts=(
    "scripts/bootstrap-project.sh"
)

for shell_script in "${shell_scripts[@]}"; do
    if [[ -f "$shell_script" ]]; then
        run_test "Shell script syntax: $shell_script" "shellcheck '$shell_script'"
    fi
done

# Test 7: Check workflow content
echo ""
echo "🔄 Validating workflow content..."

run_test "CI workflow has required inputs" "grep -q 'project-type:' .github/workflows/base/ci.yml"
run_test "CI workflow has Node.js setup" "grep -q 'setup-node@' .github/workflows/base/ci.yml"
run_test "Coverage workflow has codecov" "grep -q 'codecov/codecov-action@' .github/workflows/reusable/upload-coverage.yml"

# Test 8: Check configuration content
echo ""
echo "⚙️ Validating configuration content..."

run_test "Codecov config has coverage threshold" "grep -q 'target: 80%' .github/configs/codecov.yml"
run_test "CodeQL config has languages" "grep -q 'languages:' .github/configs/codeql-config.yml"

# Test 9: Check package.json
echo ""
echo "📦 Validating package.json..."

if [[ -f "package.json" ]]; then
    run_test "Package.json has name field" "jq -e '.name' package.json"
    run_test "Package.json has version field" "jq -e '.version' package.json"
    run_test "Package.json has scripts" "jq -e '.scripts' package.json"
fi

# Test 10: Check TypeScript configuration
echo ""
echo "📘 Validating TypeScript configuration..."

if [[ -f "tsconfig.json" ]]; then
    run_test "tsconfig.json exists" "[[ -f 'tsconfig.json' ]]"
    run_test "tsconfig.json has compiler options" "grep -q 'compilerOptions' tsconfig.json"
fi

# Test 11: Check file permissions
echo ""
echo "🔒 Validating file permissions..."

run_test "Scripts are executable" "find scripts -name '*.sh' -exec test -x {} \;"

# Test 12: Validate workflow structure
echo ""
echo "🏗️ Validating workflow structure..."

run_test "Workflows have proper on triggers" "grep -q 'on:' .github/workflows/base/ci.yml"
run_test "Reusable workflows have workflow_call" "grep -q 'workflow_call:' .github/workflows/reusable/setup-node.yml"

# Test 13: Check for required secrets in workflows
echo ""
echo "🔐 Validating required secrets..."

run_test "CI workflow references CODECOV_TOKEN" "grep -q 'CODECOV_TOKEN' .github/workflows/base/ci.yml"

# Test 14: MCP-specific validations
echo ""
echo "🔧 Validating MCP-specific configuration..."

run_test "CI shared workflow uses mcp project type" "grep -q 'project-type: \"mcp\"' .github/workflows/ci-shared.yml"
run_test "CI shared workflow has MCP-specific jobs" "grep -q 'mcp-server-tests' .github/workflows/ci-shared.yml"

# Test 15: Check for source code structure
echo ""
echo "📁 Validating source code structure..."

run_test "Source directory exists" "[[ -d 'src' ]]"
if [[ -d "src" ]]; then
    run_test "Source has TypeScript files" "find src -name '*.ts' | head -1 | grep -q ."
fi

# Summary
echo ""
echo "================================"
echo "📊 Validation Summary"
echo "================================"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [[ $FAILED_TESTS -eq 0 ]]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "🎉 uiforge-mcp patterns are valid and ready for use!"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    echo ""
    echo "🔧 Please fix the failing tests before using the patterns."
    exit 1
fi