#!/usr/bin/env bash
# Integration test: render → HTTP serve → second render triggers SSE reload.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CANVAS="$SKILL_DIR/canvas.cjs"

TMP=$(mktemp -d)
cleanup() {
  if [[ -f "$TMP/docs/brainstorm/itest/.canvas.lock" ]]; then
    PID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$TMP/docs/brainstorm/itest/.canvas.lock','utf8')).pid)" 2>/dev/null || echo "")
    [[ -n "$PID" ]] && kill "$PID" 2>/dev/null || true
  fi
  rm -rf "$TMP"
}
trap cleanup EXIT

cd "$TMP"

# 1. First write the file the model would write
mkdir -p docs/brainstorm/itest
cat > docs/brainstorm/itest/visual.html <<'EOF'
<!DOCTYPE html>
<html><head><title>itest</title></head>
<body><h1>first render</h1></body></html>
EOF

# 2. Render: starts server, prints JSON
JSON=$(node "$CANVAS" render --topic itest)
echo "Render output: $JSON"

URL=$(node -e "console.log(JSON.parse(process.argv[1]).url)" "$JSON")
PORT=$(node -e "console.log(JSON.parse(process.argv[1]).port)" "$JSON")
TOPIC_DIR=$(node -e "console.log(JSON.parse(process.argv[1]).topic_dir)" "$JSON")

[[ -n "$URL" ]] || { echo "FAIL: no url"; exit 1; }
[[ -d "$TOPIC_DIR" ]] || { echo "FAIL: topic_dir $TOPIC_DIR missing"; exit 1; }
[[ -f "$TOPIC_DIR/.canvas.lock" ]] || { echo "FAIL: lock file not created"; exit 1; }

# 3. Curl the canvas — should see content + injected SSE script
sleep 0.3
RESP=$(curl -s "$URL/")
echo "$RESP" | grep -q "first render" || { echo "FAIL: content not served"; exit 1; }
echo "$RESP" | grep -q "EventSource" || { echo "FAIL: SSE script not injected into response"; exit 1; }

# 4. Verify on-disk file is NOT polluted with reload script
grep -q "EventSource" "$TOPIC_DIR/visual.html" && { echo "FAIL: disk file polluted with SSE script"; exit 1; }

# 5. Subscribe to SSE in background, then trigger second render
SSE_OUT=$(mktemp)
( curl -sN --max-time 3 "$URL/_e" > "$SSE_OUT" & )
sleep 0.5

# Update the canvas file
cat > "$TOPIC_DIR/visual.html" <<'EOF'
<!DOCTYPE html>
<html><head><title>itest</title></head>
<body><h1>second render</h1></body></html>
EOF

# Second render — server already running, should broadcast reload
JSON2=$(node "$CANVAS" render --topic itest)
URL2=$(node -e "console.log(JSON.parse(process.argv[1]).url)" "$JSON2")
[[ "$URL2" == "$URL" ]] || { echo "FAIL: second render returned different URL ($URL2 vs $URL)"; exit 1; }

# Wait for SSE event to arrive
sleep 1.5
grep -q "reload" "$SSE_OUT" || { echo "FAIL: SSE reload event not received. Got: $(cat $SSE_OUT)"; exit 1; }

# 6. Verify the served content updated
RESP2=$(curl -s "$URL/")
echo "$RESP2" | grep -q "second render" || { echo "FAIL: updated content not served"; exit 1; }

echo "PASS"
