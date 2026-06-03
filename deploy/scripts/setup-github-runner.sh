#!/usr/bin/env bash
# One-time setup: install GitHub Actions self-hosted runner on this VPS.
# Run as root on the server after creating a runner token in GitHub.
#
# GitHub → Repo → Settings → Actions → Runners → New self-hosted runner → Linux
# Copy the token from the configure step, then:
#
#   bash deploy/scripts/setup-github-runner.sh YOUR_RUNNER_TOKEN
#
set -euo pipefail

TOKEN="${1:-}"
REPO="MafateehITBU/mafateehwebsite"
RUNNER_DIR="/opt/actions-runner"

if [[ -z "$TOKEN" ]]; then
  echo "Usage: bash deploy/scripts/setup-github-runner.sh <RUNNER_REGISTRATION_TOKEN>"
  echo ""
  echo "Get token from:"
  echo "  https://github.com/${REPO}/settings/actions/runners/new"
  exit 1
fi

apt-get update
apt-get install -y curl jq

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [[ ! -f ./config.sh ]]; then
  curl -fsSL -o actions-runner-linux-x64.tar.gz \
    https://github.com/actions/runner/releases/download/v2.334.0/actions-runner-linux-x64-2.334.0.tar.gz
  tar xzf actions-runner-linux-x64.tar.gz
fi

./config.sh --url "https://github.com/${REPO}" --token "$TOKEN" --name "srv1719442" --work _work --unattended --replace

./svc.sh install
./svc.sh start
./svc.sh status

echo ""
echo "Self-hosted runner installed. Push to main to trigger deploy."
echo "Check: https://github.com/${REPO}/settings/actions/runners"
