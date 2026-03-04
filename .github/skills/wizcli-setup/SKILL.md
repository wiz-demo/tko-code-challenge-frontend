---
name: wizcli-setup
description: Guides AI agents through installing and authenticating the Wiz CLI tool. Use this skill when wizcli is needed but not yet installed or configured, or when authentication issues occur.
---

# Wiz CLI Setup and Authentication

## Overview

This skill enables AI agents to guide users through installing the Wiz CLI (`wizcli`) **v1.x** and configuring authentication. It provides platform-specific installation instructions, multiple authentication methods, and verification steps to ensure the tool is ready for use.

**IMPORTANT**: Only Wiz CLI v1.x is supported. Version 0.x is deprecated and will be end-of-lifed. Always install or upgrade to v1.x.

## When to Use This Skill

- When wizcli command is not found or not installed
- **When wizcli v0.x is detected (must upgrade to v1.x)**
- When authentication errors occur during wizcli scans
- When setting up a new development environment
- When onboarding new team members to Wiz security scanning
- Before running any wizcli commands for the first time
- When troubleshooting "unauthorized" or "invalid credentials" errors

## Core Instructions

### Step 1: Check if Wiz CLI is Already Installed

Before providing installation instructions, verify if wizcli is already installed:

```bash
# Check if wizcli is installed
which wizcli

# If installed, check version
wizcli version
```

**Version Check:**

- If version shows **v1.x or higher**: Skip to **Step 3: Authentication** and use the device code flow for easiest setup.
- If version shows **v0.x**: This version is deprecated and end-of-life. **You must upgrade to v1.x** - proceed to Step 2 to reinstall.
- If wizcli is not found: Proceed to Step 2 to install v1.x.

### Step 2: Install Wiz CLI

Provide platform-specific installation instructions based on the user's operating system.

**CRITICAL**: Always install v1.x from the `/v1/wizcli/latest/` path. Do not use v0.x URLs.

#### macOS Installation

**Direct Download (Recommended)**

```bash
# For Intel Macs
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-amd64

# For Apple Silicon (M1/M2/M3/M4)
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-arm64

# Make executable
chmod +x wizcli

# Move to PATH
sudo mv wizcli /usr/local/bin/

# Verify installation
wizcli version
```

#### Linux Installation

```bash
# Download the latest Linux binary (x86_64)
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-linux-amd64

# For ARM64 architecture
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-linux-arm64

# Make executable
chmod +x wizcli

# Move to PATH
sudo mv wizcli /usr/local/bin/

# Verify installation
wizcli version
```

#### Windows Installation

**Method 1: PowerShell**

```powershell
# Download the latest Windows binary
Invoke-WebRequest -Uri https://downloads.wiz.io/v1/wizcli/latest/wizcli-windows-amd64.exe -OutFile wizcli.exe

# Move to a directory in PATH (example: C:\Program Files\Wiz)
New-Item -ItemType Directory -Force -Path "C:\Program Files\Wiz"
Move-Item wizcli.exe "C:\Program Files\Wiz\wizcli.exe"

# Add to PATH (requires admin)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Wiz", [EnvironmentVariableTarget]::Machine)

# Verify installation (restart terminal first)
wizcli version
```

**Method 2: Manual Download**

1. Download from: https://downloads.wiz.io/v1/wizcli/latest/wizcli-windows-amd64.exe
2. Rename to `wizcli.exe`
3. Add directory to system PATH
4. Restart terminal and verify with `wizcli version`

#### Docker Container

For CI/CD or containerized environments:

```bash
# Use official Wiz CLI Docker image
docker pull wizio/wizcli:latest

# Run wizcli in container
docker run --rm -v $(pwd):/app wizio/wizcli:latest version

# Create alias for convenience
alias wizcli='docker run --rm -v $(pwd):/app wizio/wizcli:latest'
```

### Step 3: Authentication

Wiz CLI supports multiple authentication methods. However, the **device code flow** is highly recommended for most users due to its simplicity and security. Service accounts are really only necessary for automation and CI/CD pipelines.

#### Method 1: Interactive Device Code (Recommended for Individual Developers)

The device code flow is the simplest and most user-friendly authentication method for local development.

```bash
# Start device code authentication flow
wizcli auth --use-device-code

# Follow the prompts:
# 1. CLI will display a URL and code
# 2. Open the URL in browser
# 3. Enter the code shown
# 4. Authenticate with your Wiz credentials
# 5. Return to CLI - authentication is now cached

# You're ready to scan! Test with:
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

**Benefits:**

- No need to create or manage service accounts
- Uses your existing Wiz user credentials
- Authentication is cached locally for convenience
- Most secure for individual use (no credentials stored in files)

#### Method 2: Service Account (For CI/CD and Automation)

Service accounts provide non-interactive authentication ideal for scripts and automation where device code flow isn't practical.

**Creating a Service Account:**

1. Log into Wiz portal: https://app.wiz.io
2. Navigate to Settings → Service Accounts
3. Click "Add Service Account"
4. Provide a name (e.g., "CLI Scanner")
5. Select appropriate permissions:
   - **Read-only scanning**: `read:resources`, `read:vulnerabilities`
   - **Full scanning with publishing**: `create:scan_results`, `read:resources`
6. Click "Create" and save the Client ID and Client Secret

**Authenticating with Service Account:**

```bash
# Method A: Using command-line flags (not recommended - credentials visible in history)
wizcli auth --client-id="your-client-id" --client-secret="your-client-secret"

# Method B: Using environment variables (recommended)
export WIZ_CLIENT_ID="your-client-id"
export WIZ_CLIENT_SECRET="your-client-secret"

# Test authentication with a quick scan
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

**Storing Credentials Securely:**

```bash
# Add to shell profile (~/.zshrc, ~/.bashrc, or ~/.bash_profile)
echo 'export WIZ_CLIENT_ID="your-client-id"' >> ~/.zshrc
echo 'export WIZ_CLIENT_SECRET="your-client-secret"' >> ~/.zshrc
source ~/.zshrc

# Or use a secure credential manager
# macOS Keychain example:
security add-generic-password -a "$USER" -s "wiz_client_id" -w "your-client-id"
security add-generic-password -a "$USER" -s "wiz_client_secret" -w "your-client-secret"

# Retrieve from keychain in scripts
export WIZ_CLIENT_ID=$(security find-generic-password -a "$USER" -s "wiz_client_id" -w)
export WIZ_CLIENT_SECRET=$(security find-generic-password -a "$USER" -s "wiz_client_secret" -w)
```

#### Method 3: SSO/SAML Integration

For organizations using SSO:

```bash
# Authenticate via SSO
wizcli auth --use-sso

# Follow browser redirect to your organization's SSO portal
# Complete authentication
# Return to CLI
```

#### Method 4: Configuration File

For managing multiple environments or tenants:

```bash
# Create a .wiz configuration file in your project
cat > .wiz << EOF
{
  "client_id": "your-client-id",
  "client_secret": "your-client-secret",
  "api_endpoint": "https://api.us1.app.wiz.io"
}
EOF

# Point wizcli to the config file
wizcli scan dir . --wiz-configuration-file ./.wiz

# Add .wiz to .gitignore to prevent credential exposure
echo ".wiz" >> .gitignore
```

### Step 4: Verify Setup

After installation and authentication, verify everything is working:

```bash
# Check version (should show v1.x or higher)
wizcli version

# Test authentication with a quick scan
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt

# If all commands succeed, setup is complete!
```

### Step 5: Configure for Team Use

For teams, set up consistent configuration:

```bash
# Create a team configuration template
cat > .wiz.template << 'EOF'
{
  "api_endpoint": "https://api.us1.app.wiz.io",
  "default_policies": ["production-ready", "security-baseline"],
  "disabled_scanners": ["AIModels"],
  "timeout": "1h"
}
EOF

# Team members copy and add their credentials
cp .wiz.template .wiz
# Edit .wiz to add client_id and client_secret

# Add to .gitignore
echo ".wiz" >> .gitignore
```

## Guidelines

### Security Best Practices

- **Never commit credentials** to version control
- **Use environment variables** or secure credential managers
- **Rotate service account credentials** regularly (quarterly)
- **Use least-privilege access** - only grant necessary permissions
- **Separate credentials** for dev/staging/prod environments
- **Audit service account usage** periodically
- **Revoke unused service accounts** immediately

### Platform-Specific Considerations

**macOS:**

- Direct download is the standard installation method
- Use macOS Keychain for credential storage
- Apple Silicon (M1/M2/M3/M4) requires ARM64 binary (`wizcli-darwin-arm64`)
- Intel Macs require AMD64 binary (`wizcli-darwin-amd64`)

**Linux:**

- Direct download is the standard installation method
- Consider using systemd secrets for credential management
- Docker method works well in containerized environments

**Windows:**

- PowerShell script requires admin privileges
- Use Windows Credential Manager for secure storage
- WSL2 users can follow Linux instructions

**CI/CD:**

- Use environment variables from CI secret stores (GitHub Secrets, GitLab CI Variables, etc.)
- Use Docker image for consistent cross-platform execution
- Set `--no-publish` flag for PR scans to avoid noise

### Troubleshooting Common Issues

**Issue: "Wizcli v0.x detected - need to upgrade"**

Wiz CLI v0.x is deprecated and end-of-life. Upgrade to v1.x immediately:

```bash
# Check current version
wizcli version

# If v0.x is shown, remove old version
sudo rm $(which wizcli)

# Install v1.x (macOS Apple Silicon example)
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-arm64
chmod +x wizcli
sudo mv wizcli /usr/local/bin/

# Verify v1.x is installed
wizcli version  # Should show v1.x

# Re-authenticate (device code recommended)
wizcli auth --use-device-code
```

**Issue: "command not found: wizcli"**

```bash
# Verify installation path
which wizcli

# Check if directory is in PATH
echo $PATH

# Reinstall to /usr/local/bin which is usually in PATH
sudo mv wizcli /usr/local/bin/

# Or add current directory to PATH
export PATH="$PATH:$(pwd)"
```

**Issue: "authentication failed" or "unauthorized"**

```bash
# Verify credentials are set
echo $WIZ_CLIENT_ID
echo $WIZ_CLIENT_SECRET

# Check if credentials are valid in Wiz portal
# Settings → Service Accounts → verify account is Active

# Re-authenticate
unset WIZ_CLIENT_ID WIZ_CLIENT_SECRET
export WIZ_CLIENT_ID="your-client-id"
export WIZ_CLIENT_SECRET="your-client-secret"

# Test the connection and authentication
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

**Issue: "invalid API endpoint"**

```bash
# Check your Wiz region and set correct endpoint
# US1: https://api.us1.app.wiz.io
# US2: https://api.us2.app.wiz.io
# EU1: https://api.eu1.app.wiz.io
# EU2: https://api.eu2.app.wiz.io
# GOV: https://api.gov.app.wiz.io

export WIZ_API_ENDPOINT="https://api.us1.app.wiz.io"

# Or specify in scan command
wizcli scan dir . --api-endpoint="https://api.us1.app.wiz.io"
```

**Issue: SSL/TLS errors**

```bash
# Update CA certificates (Linux)
sudo apt update && sudo apt install ca-certificates

# macOS - update system certificates
# Open Keychain Access → Certificate Assistant → Request a Certificate

# Bypass SSL verification (NOT recommended for production)
wizcli scan dir . --insecure-skip-tls-verify
```

**Issue: Slow downloads or network issues**

```bash
# Use alternative download mirror
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/v1.29.0/wizcli-darwin-amd64

# Or download via browser and install manually

# Check network connectivity to Wiz
curl -I https://api.us1.app.wiz.io
```

**Issue: Permission denied**

```bash
# Make binary executable
chmod +x wizcli

# If moving to system directory, use sudo
sudo mv wizcli /usr/local/bin/

# Or install to user directory (no sudo needed)
mkdir -p ~/bin
mv wizcli ~/bin/
export PATH="$PATH:$HOME/bin"
```

## Examples

### Example 1: First-Time Setup (macOS Developer)

**User Request:**
"I need to scan my code for security issues but don't have Wiz CLI installed"

**Agent Response:**

I'll help you install and set up Wiz CLI. Let me first check if it's already installed.

```bash
# Check for existing installation
which wizcli
```

Since wizcli is not found, I'll download and install it:

```bash
# Download Wiz CLI (for Apple Silicon Macs)
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-arm64

# For Intel Macs, use:
# curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-amd64

# Make executable and install
chmod +x wizcli
sudo mv wizcli /usr/local/bin/

# Verify installation
wizcli version
```

Great! Now let's set up authentication using the device code flow:

````bash
# Authenticate with device code (easiest method)
wizcli auth --use-device-code

# The CLI will show you a URL and code
# Open the URL in your browser and enter the code
# Sign in with your Wiz credentials
# Return to the terminal - you're authenticated!

# Test with a quick scan
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

All set! Authentication is complete and verified.

**Note:** For CI/CD pipelines or automation, you'll want to use a service account instead. See the skill documentation for service account setup instructions.

### Example 2: CI/CD Pipeline Setup (GitHub Actions)

**User Request:**
"How do I set up Wiz CLI scanning in our GitHub Actions pipeline?"

**Agent Response:**

Here's a complete GitHub Actions workflow for Wiz CLI scanning:

**Step 1: Add secrets to GitHub repository**

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `WIZ_CLIENT_ID`: Your Wiz service account client ID
   - `WIZ_CLIENT_SECRET`: Your Wiz service account client secret

**Step 2: Create workflow file** (`.github/workflows/wiz-scan.yml`):

```yaml
name: Wiz Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  wiz-scan:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Wiz CLI
        run: |
          curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-linux-amd64
          chmod +x wizcli
          sudo mv wizcli /usr/local/bin/
          wizcli version

      - name: Authenticate Wiz CLI
        env:
          WIZ_CLIENT_ID: ${{ secrets.WIZ_CLIENT_ID }}
          WIZ_CLIENT_SECRET: ${{ secrets.WIZ_CLIENT_SECRET }}
        run: |
          wizcli version

      - name: Run Wiz Scan
        env:
          WIZ_CLIENT_ID: ${{ secrets.WIZ_CLIENT_ID }}
          WIZ_CLIENT_SECRET: ${{ secrets.WIZ_CLIENT_SECRET }}
        run: |
          wizcli scan dir . \
            --stdout=sarif \
            --sarif-output-file results.sarif \
            --by-policy-hits=BLOCK

      - name: Upload SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif

      - name: Check for blocking issues
        env:
          WIZ_CLIENT_ID: ${{ secrets.WIZ_CLIENT_ID }}
          WIZ_CLIENT_SECRET: ${{ secrets.WIZ_CLIENT_SECRET }}
        run: |
          # Fail the build if critical issues are found
          wizcli scan dir . --by-policy-hits=BLOCK --stdout=json --json-output-file results.json

          # Parse results and exit with error if critical issues exist
          if grep -q '"severity":"CRITICAL"' results.json; then
            echo "❌ Critical security issues found!"
            exit 1
          fi
````

This workflow will:

- Install Wiz CLI on each run
- Authenticate using GitHub secrets
- Scan code on push and pull requests
- Upload results to GitHub Security tab
- Fail the build if critical issues are found

### Example 3: Authentication Troubleshooting

**User Request:**
"I'm getting 'unauthorized' errors when trying to scan"

**Agent Response:**

Let's troubleshoot your authentication. First, let me check your current setup:

```bash
# Check if credentials are set
echo "Client ID set: $([ -n "$WIZ_CLIENT_ID" ] && echo 'Yes' || echo 'No')"
echo "Client Secret set: $([ -n "$WIZ_CLIENT_SECRET" ] && echo 'Yes' || echo 'No')"
```

If credentials are not set, let's configure them:

```bash
# Set environment variables
export WIZ_CLIENT_ID="your-client-id"
export WIZ_CLIENT_SECRET="your-client-secret"

# Test authentication with a quick scan
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

If you're still getting unauthorized errors, verify the following:

**1. Check service account status in Wiz portal:**

- Go to https://app.wiz.io → Settings → Service Accounts
- Verify your service account shows as "Active"
- Check that it hasn't expired

**2. Verify correct API endpoint for your region:**

```bash
# Set the correct endpoint
export WIZ_API_ENDPOINT="https://api.us1.app.wiz.io"  # Change based on your region

# Test connection with a quick scan
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

**3. Check for typos in credentials:**

```bash
# Ensure no extra spaces or quotes
export WIZ_CLIENT_ID="abc123..."  # No trailing spaces
export WIZ_CLIENT_SECRET="xyz789..."  # Ensure complete string
```

**4. Try re-creating the service account:**

- Delete the old service account in Wiz portal
- Create a new one with the same permissions
- Update your environment variables with new credentials

**5. Make credentials persistent:**

```bash
# Add to shell profile
echo "export WIZ_CLIENT_ID=\"your-client-id\"" >> ~/.zshrc
echo "export WIZ_CLIENT_SECRET=\"your-client-secret\"" >> ~/.zshrc
source ~/.zshrc
```

### Example 4: Multi-Environment Setup

**User Request:**
"We have separate Wiz accounts for dev and prod - how do we manage both?"

**Agent Response:**

You can manage multiple Wiz environments using configuration files and shell functions. Here's a recommended setup:

**Create separate config files:**

```bash
# Dev environment config
cat > ~/.wiz-dev.json << 'EOF'
{
  "client_id": "dev-client-id",
  "client_secret": "dev-client-secret",
  "api_endpoint": "https://api.us1.app.wiz.io"
}
EOF

# Production environment config
cat > ~/.wiz-prod.json << 'EOF'
{
  "client_id": "prod-client-id",
  "client_secret": "prod-client-secret",
  "api_endpoint": "https://api.us1.app.wiz.io"
}
EOF

# Secure the files
chmod 600 ~/.wiz-dev.json ~/.wiz-prod.json
```

**Create shell functions for easy switching:**

```bash
# Add to ~/.zshrc or ~/.bashrc
cat >> ~/.zshrc << 'EOF'

# Wiz CLI environment switcher
wiz-dev() {
  export WIZ_CONFIG_FILE="$HOME/.wiz-dev.json"
  echo "🔧 Switched to Wiz DEV environment"
  wizcli "$@" --wiz-configuration-file "$WIZ_CONFIG_FILE"
}

wiz-prod() {
  export WIZ_CONFIG_FILE="$HOME/.wiz-prod.json"
  echo "🚀 Switched to Wiz PROD environment"
  wizcli "$@" --wiz-configuration-file "$WIZ_CONFIG_FILE"
}

# Show current Wiz environment
wiz-env() {
  if [ -n "$WIZ_CONFIG_FILE" ]; then
    echo "Current environment: $WIZ_CONFIG_FILE"
  else
    echo "No environment set. Use wiz-dev or wiz-prod"
  fi
}
EOF

source ~/.zshrc
```

**Usage:**

```bash
# Switch to dev and scan
wiz-dev scan dir .

# Switch to prod and scan
wiz-prod scan dir . --by-policy-hits=BLOCK

# Check current environment
wiz-env
```

**Alternative: Using environment variables with a selector:**

```bash
# Add to ~/.zshrc
export WIZ_DEV_CLIENT_ID="dev-id"
export WIZ_DEV_CLIENT_SECRET="dev-secret"
export WIZ_PROD_CLIENT_ID="prod-id"
export WIZ_PROD_CLIENT_SECRET="prod-secret"

# Function to switch environments
use-wiz-env() {
  local env=$1
  if [ "$env" = "dev" ]; then
    export WIZ_CLIENT_ID="$WIZ_DEV_CLIENT_ID"
    export WIZ_CLIENT_SECRET="$WIZ_DEV_CLIENT_SECRET"
    echo "✅ Using Wiz DEV environment"
  elif [ "$env" = "prod" ]; then
    export WIZ_CLIENT_ID="$WIZ_PROD_CLIENT_ID"
    export WIZ_CLIENT_SECRET="$WIZ_PROD_CLIENT_SECRET"
    echo "✅ Using Wiz PROD environment"
  else
    echo "❌ Unknown environment. Use: dev or prod"
  fi
}

# Usage: use-wiz-env dev
# Then: wizcli scan dir .
```

## Integration with Other Skills

This skill is a prerequisite for:

- **wizcli-security-scanner**: Scanning code for vulnerabilities (requires authenticated wizcli)
- Any future Wiz-related skills that require CLI access

When using other Wiz skills, if authentication errors occur, refer back to this skill for troubleshooting.

## Notes

- **Version Compatibility**: These instructions are for Wiz CLI v1.x (latest as of January 2026). **v0.x is deprecated and end-of-life - do not use it**
- **Regional Endpoints**: Ensure you use the correct API endpoint for your Wiz tenant region
- **Credential Rotation**: Service account credentials should be rotated every 90 days
- **Permission Scopes**: Request minimal permissions needed for your use case
- **Offline Installation**: For air-gapped environments, download binaries manually and transfer
- **Corporate Proxies**: If behind a corporate proxy, set `HTTP_PROXY` and `HTTPS_PROXY` environment variables
- **Updates**: Check for CLI updates monthly by downloading the latest version from downloads.wiz.io
- **Support**: For installation issues, contact Wiz support or check documentation at https://docs.wiz.io

## Quick Reference

**Installation Commands:**

```bash
# macOS (Apple Silicon)
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-arm64
chmod +x wizcli && sudo mv wizcli /usr/local/bin/

# macOS (Intel)
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-darwin-amd64
chmod +x wizcli && sudo mv wizcli /usr/local/bin/

# Linux
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-linux-amd64
chmod +x wizcli && sudo mv wizcli /usr/local/bin/

# Verify
wizcli version
```

**Authentication Commands:**

```bash
# Device code (recommended for local development)
wizcli auth --use-device-code

# Service account (for CI/CD)
export WIZ_CLIENT_ID="your-client-id"
export WIZ_CLIENT_SECRET="your-client-secret"

# Test scan
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt
```

**Troubleshooting Commands:**

```bash
# Check installation
which wizcli
wizcli version

# Check authentication variables
echo $WIZ_CLIENT_ID

# Test connectivity
curl -I https://api.us1.app.wiz.io

# Test authentication
echo "test" > /tmp/wiz-test.txt && wizcli scan dir /tmp/wiz-test.txt --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish && rm /tmp/wiz-test.txt

# Debug mode
wizcli scan dir . --log=debug.log
```
