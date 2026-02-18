#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$SCRIPT_DIR/lib/bootstrap.sh"
load_env || { log_err ".env not found in $REPO_ROOT"; exit 1; }
source "$SCRIPT_DIR/lib/gateway.sh"

if [[ -n "${MCP_CLIENT_SERVER_URL:-}" ]]; then
  MCP_SERVER_URL="$MCP_CLIENT_SERVER_URL"
else
  url_file="$REPO_ROOT/data/.mcp-client-url"
  if [[ ! -f "$url_file" ]] || [[ ! -s "$url_file" ]]; then
    log_err "Missing or empty data/.mcp-client-url. Run: make start && make register"
    log_err "Then run: make verify-mcp-client-setup (optional) and restart your IDE fully."
    exit 1
  fi
  MCP_SERVER_URL=$(head -n1 "$url_file" | tr -d '\r\n')
  if [[ -z "$MCP_SERVER_URL" ]]; then
    log_err "data/.mcp-client-url is empty. Run: make register"
    exit 1
  fi
  if [[ ! "$MCP_SERVER_URL" =~ /servers/[a-f0-9-]+/mcp ]]; then
    log_err "data/.mcp-client-url should be .../servers/UUID/mcp. Run: make register"
    exit 1
  fi
fi

JWT=$(get_jwt) || { log_err "Failed to generate JWT (need PyJWT or running gateway container)."; exit 1; }

docker_args=(run --rm -i
  -e "MCP_SERVER_URL=$MCP_SERVER_URL"
  -e "MCP_AUTH=Bearer $JWT"
  -e "MCP_TOOL_CALL_TIMEOUT=120"
)
if [[ "$(uname -s)" == "Linux" ]]; then
  docker_args+=(--add-host=host.docker.internal:host-gateway)
fi
docker_args+=(ghcr.io/ibm/mcp-context-forge:1.0.0-BETA-2 python3 -m mcpgateway.wrapper)

exec docker "${docker_args[@]}"
