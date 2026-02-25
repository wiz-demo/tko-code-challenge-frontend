---
name: wizcli-security-scanner
description: Enables AI agents to leverage the Wiz CLI (wizcli) for security scanning, vulnerability detection, and remediation recommendations. Use this skill when analyzing code for security issues, running compliance scans, or when developers need security guidance.
---

# Wiz CLI Security Scanner

## Overview

This skill enables AI agents to use the Wiz CLI (`wizcli`) to scan code, containers, and infrastructure for security vulnerabilities, misconfigurations, and compliance issues. It provides structured guidance for interpreting scan results and recommending actionable remediations.

## Prerequisites

**CRITICAL**: This skill requires Wiz CLI **v1.x or higher**. Version 0.x is deprecated and end-of-life.

- If wizcli is not installed or is v0.x, use the **wizcli-setup** skill first to install/upgrade to v1.x
- Verify version with: `wizcli version` (must show v1.x)
- Ensure authentication is configured (device code or service account)

## When to Use This Skill

- When a developer asks to scan their code or infrastructure for security issues
- When running automated security checks in CI/CD pipelines
- When analyzing Docker images, Kubernetes configurations, or IaC templates
- When investigating specific vulnerabilities or compliance violations
- When a background agent needs to proactively monitor for security issues
- When providing security remediation guidance

## Core Instructions

### Step 1: Understand the Scan Context

Before running any scans, determine:

- **What to scan**: Code directory, Docker image, Kubernetes manifest, IaC template
- **Scan type needed**: Vulnerability scan, misconfiguration check, secret detection, compliance audit
- **Scope**: Specific files/directories or entire project
- **Severity threshold**: What level of issues to report (CRITICAL, HIGH, MEDIUM, LOW)

### Step 2: Run the Appropriate Wiz CLI Command

Use the appropriate wizcli v1 command based on the context:

#### Directory/Code Scanning

```bash
# Scan current directory for all issues
wizcli scan dir .

# Scan with JSON output to a file
wizcli scan dir . --stdout=json --json-output-file results.json

# Scan with specific policies
wizcli scan dir . --policies production-ready,security-baseline

# Scan only for specific issues (disable other scanners)
wizcli scan dir . --disabled-scanners=Misconfiguration,SoftwareSupplyChain

# Scan and filter to only BLOCK policy hits
wizcli scan dir /path/to/code --by-policy-hits=BLOCK
```

#### Container Image Scanning

```bash
# Scan a Docker image
wizcli scan container-image myimage:latest

# Scan with JSON output
wizcli scan container-image myimage:latest --stdout=json --json-output-file results.json

# Scan a local image tar file
wizcli scan container-image /path/to/image.tar

# Scan with Dockerfile context for better accuracy
wizcli scan container-image myimage:latest --dockerfile ./Dockerfile

# Scan and disable specific scanners
wizcli scan container-image myimage:latest --disabled-scanners=SoftwareSupplyChain,Malware
```

#### IaC (Infrastructure as Code) Scanning

```bash
# Scan directory for IaC files (auto-detects types)
wizcli scan dir ./infrastructure

# Scan only specific IaC types
wizcli scan dir . --types=Terraform,Kubernetes,Dockerfile

# Scan Terraform with resource discovery
wizcli scan dir ./terraform --types=Terraform --discovered-resources

# Scan CloudFormation with expanded intrinsics
wizcli scan dir ./cloudformation --types=Cloudformation --expand-cloudformation-intrinsics

# Scan with parameter files for CloudFormation
wizcli scan dir ./cloudformation --types=Cloudformation --parameter-files='*.parameters.json'
```

#### Scanner-Specific Scans

```bash
# Scan only for secrets
wizcli scan dir . --disabled-scanners=Vulnerability,Misconfiguration,SensitiveData,SoftwareSupplyChain,AIModels,SAST,Malware

# Scan only for vulnerabilities
wizcli scan dir . --disabled-scanners=Secret,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware

# Scan only for misconfigurations
wizcli scan dir . --disabled-scanners=Vulnerability,Secret,SensitiveData,SoftwareSupplyChain,AIModels,SAST,Malware

# Scan for SAST issues
wizcli scan dir . --disabled-scanners=Vulnerability,Secret,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,Malware
```

### Step 3: Interpret Scan Results

When analyzing wizcli output, focus on:

1. **Severity Levels**:
   - `CRITICAL`: Immediate action required (e.g., RCE vulnerabilities, exposed secrets)
   - `HIGH`: Important security issues that should be fixed soon
   - `MEDIUM`: Issues to address in regular maintenance
   - `LOW`: Minor issues or best practice improvements
   - `INFORMATIONAL`: Recommendations and guidance

2. **Issue Categories**:
   - **Vulnerabilities**: CVEs in dependencies with known exploits
   - **Misconfigurations**: Security settings that increase risk
   - **Secrets**: Exposed API keys, passwords, tokens
   - **Compliance**: Policy violations (PCI-DSS, SOC 2, etc.)
   - **Best Practices**: Code patterns that could improve security

3. **Key Fields to Extract**:
   - Issue ID/CVE number
   - Affected file and line number
   - Current configuration vs. recommended configuration
   - CVSS score (for vulnerabilities)
   - Available patches or updates

### Step 4: Provide Actionable Remediations

For each issue found, provide:

1. **Clear Explanation**: What the issue is and why it matters
2. **Risk Assessment**: What could happen if not fixed
3. **Specific Fix**: Exact code changes or configuration updates
4. **Priority**: When this should be addressed
5. **Verification**: How to confirm the fix worked

## Guidelines

- **Always run scans in the project directory** or specify the correct path
- **Use JSON output** (`--stdout=json --json-output-file results.json`) for programmatic parsing
- **Leverage output formats**: Use `--stdout=sarif` for GitHub integration, `--stdout=csv` for reports
- **Filter by policy hits** - use `--by-policy-hits=BLOCK` to show only critical violations
- **Disable unnecessary scanners** to speed up scans with `--disabled-scanners`
- **Scope to projects** - use `--projects` to limit scan scope when working with multiple Wiz projects
- **Provide context** - explain why each issue matters in the project's specific context
- **Suggest quick wins** - prioritize easy-to-fix issues that have high security impact
- **Check for false positives** - some findings may not apply to the specific use case
- **Preserve output** - save scan results for tracking progress over time
- **Use SBOM generation** - `--sbom-format=cyclonedx-json` for supply chain visibility

## Background Agent Workflow

For proactive monitoring by background agents:

1. **Schedule Regular Scans**:
   - Run daily scans during off-peak hours
   - Trigger scans on code commits or PR creation
   - Monitor for new CVE disclosures affecting dependencies

2. **Smart Alerting**:
   - Only alert on CRITICAL and HIGH severity issues
   - Group related issues to avoid notification fatigue
   - Track issue trends (are things getting better or worse?)

3. **Automated Triage**:
   - Categorize issues by component/owner
   - Suggest assignees based on file ownership
   - Link to relevant documentation or PRs

4. **Progress Tracking**:
   - Compare current scan to previous baseline
   - Celebrate improvements (issues fixed)
   - Flag regressions (new issues introduced)

## Examples

### Example 1: Full Project Security Scan

**User Request:**
"Scan this project for security issues"

**Agent Response:**

```bash
# Running comprehensive security scan
wizcli scan dir . --stdout=json --json-output-file wiz-scan-results.json

# Analyzing results...
```

**Report Format:**

```
🔍 Wiz Security Scan Results

📊 Summary:
- 2 CRITICAL issues found
- 5 HIGH severity issues
- 12 MEDIUM severity issues
- 8 LOW severity issues

🚨 CRITICAL Issues:

1. Exposed AWS Secret Key (secrets/aws.json:12)
   - Risk: Full AWS account compromise
   - Fix: Remove from code, use AWS Secrets Manager
   - Action: Rotate credentials immediately

2. SQL Injection Vulnerability (api/users.py:45)
   - Risk: Database compromise, data exfiltration
   - Fix: Use parameterized queries
   - Action: Fix before next deployment

⚠️ HIGH Severity Issues:
[... detailed list ...]

📋 Recommended Actions:
1. Immediate: Fix CRITICAL issues (estimated 2 hours)
2. This Sprint: Address HIGH severity (estimated 1 day)
3. Next Sprint: Review and address MEDIUM priority issues
```

### Example 2: Container Image Vulnerability Check

**User Request:**
"Check if our Docker image has any critical vulnerabilities before deploying to production"

**Agent Response:**

```bash
# Scanning container image for vulnerabilities
wizcli scan container-image myapp:latest --stdout=json --json-output-file scan-results.json

# Optionally filter to only blocking issues
wizcli scan container-image myapp:latest --by-policy-hits=BLOCK

# Analyzing results...
```

**Report Format:**

````
🐳 Docker Image Security Report: myapp:latest

✅ Overall Status: PASS (no critical vulnerabilities)

📦 Vulnerabilities Found:
- 0 CRITICAL
- 3 HIGH severity (all have patches available)
- 7 MEDIUM severity

🔧 Recommended Updates:

HIGH: CVE-2024-1234 in openssl (1.1.1k)
- Current: openssl 1.1.1k
- Fixed in: 1.1.1w
- Impact: Potential DoS attack vector
- Fix: Update base image to use openssl 1.1.1w
  ```dockerfile
  FROM alpine:3.19  # Uses openssl 1.1.1w
````

✅ Safe to Deploy: YES (after applying HIGH priority patches)
Estimated fix time: 30 minutes

````

### Example 3: IaC Configuration Review

**User Request:**
"Review our Kubernetes deployment for security misconfigurations"

**Agent Response:**

```bash
# Scanning Kubernetes manifests
wizcli scan dir ./k8s --types=Kubernetes --stdout=json --json-output-file k8s-scan.json

# Analyzing results...
````

**Report Format:**

````
⎈ Kubernetes Security Review: ./k8s

❌ Misconfigurations Found:

1. Container running as root (deployment.yaml:25)
   Severity: HIGH
   Current:
   ```yaml
   securityContext: {}
````

Recommended:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  capabilities:
    drop: ["ALL"]
```

2. No resource limits defined (deployment.yaml:18)
   Severity: MEDIUM
   Fix: Add resource constraints
   ```yaml
   resources:
     limits:
       cpu: "500m"
       memory: "512Mi"
     requests:
       cpu: "250m"
       memory: "256Mi"
   ```

[... more issues ...]

📋 Summary:

- 2 HIGH: Fix before production deployment
- 6 MEDIUM: Address in next release
- All issues have automated fixes available

````

### Example 4: Secret Detection

**User Request:**
"Check if we've accidentally committed any API keys or secrets"

**Agent Response:**

```bash
# Scanning for secrets only (disable other scanners)
wizcli scan dir . --disabled-scanners=Vulnerability,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --stdout=json --json-output-file secrets-scan.json

# Also check git history for secrets removed from current branch
git log --all --full-history -- '*.env*' '*.pem' '*.key'
```

**Report Format:**

```
🔐 Secret Detection Report

✅ Current Branch: No secrets detected

⚠️ Git History Alert:
Found 2 potential secrets in commit history:

1. AWS Access Key (commit abc123, 2024-01-15)
   File: config/prod.env (deleted in commit def456)
   ⚠️ Action Required: Rotate this credential even though file was deleted

2. API Token (commit xyz789, 2024-02-01)
   File: .env.local (now in .gitignore)
   ✅ File protected, but token should be rotated

🔧 Immediate Actions:
1. Rotate all exposed credentials
2. Review .gitignore completeness
3. Consider using git-secrets or pre-commit hooks
4. Store secrets in proper secret management (AWS Secrets Manager, etc.)
```

## Output Format

Always structure scan results with:

1. **Executive Summary**: Quick overview of findings and overall status
2. **Critical/High Issues**: Detailed breakdown with immediate actions
3. **Medium/Low Issues**: Grouped summary with batch remediation suggestions
4. **Actionable Steps**: Numbered list of what to do next with time estimates
5. **Verification Commands**: Commands to verify fixes
6. **Prevention Tips**: How to avoid similar issues in the future

### Standard Report Structure

```markdown
## 🔍 Wiz Security Scan Report

### 📊 Summary

[Issue counts by severity]

### 🚨 Critical Issues (Immediate Action Required)

[Detailed critical issues with specific fixes]

### ⚠️ High Priority Issues

[High severity issues with remediation guidance]

### 📋 Other Findings

[Medium/Low issues grouped by category]

### ✅ Recommended Actions

1. [Immediate action]
2. [Short-term action]
3. [Long-term improvement]

### 🔧 Verification

[Commands to verify fixes]

### 🛡️ Prevention

[Tips to prevent similar issues]
```

## Advanced Features

### Policy and Project Scoping

```bash
# Apply specific policies to the scan
wizcli scan dir . --policies policy-name-1,policy-name-2

# Scope scan to specific Wiz projects
wizcli scan dir . --projects project-id-1,project-id-2

# Scan with application context for ignore rules
wizcli scan dir . --applications production,backend-api
```

### Baseline Comparisons

```bash
# Create baseline with timestamp
wizcli scan dir . --stdout=json --json-output-file baseline-$(date +%Y%m%d).json

# Compare current scan against baseline
wizcli scan dir . --stdout=json --json-output-file current-scan.json
# Then use jq or similar tools to identify new issues
````

### CI/CD Integration

```bash
# Generate SARIF for GitHub Security tab
wizcli scan dir . --stdout=sarif --sarif-output-file results.sarif

# Generate multiple output formats in one scan
wizcli scan dir . --stdout=human --json-output-file results.json --sarif-output-file results.sarif --csv-output-file results.zip

# Filter to only blocking policy violations (for CI/CD gates)
wizcli scan dir . --by-policy-hits=BLOCK --stdout=json

# Disable publishing to Wiz portal (for local-only scans)
wizcli scan dir . --no-publish
```

### SBOM Generation

```bash
# Generate CycloneDX SBOM
wizcli scan dir . --sbom-format=cyclonedx-json --sbom-output-file sbom.json

# Generate SPDX SBOM
wizcli scan dir . --sbom-format=spdx-json --sbom-output-file sbom-spdx.json

# Container image SBOM
wizcli scan container-image myapp:latest --sbom-format=cyclonedx-json --sbom-output-file image-sbom.json
```

### Advanced IaC Scanning

```bash
# Terraform with resource discovery
wizcli scan dir ./terraform --types=Terraform --discovered-resources --stdout=json

# CloudFormation with expanded intrinsics
wizcli scan dir ./cf-templates --types=Cloudformation --expand-cloudformation-intrinsics

# Multiple IaC types in one scan
wizcli scan dir ./infrastructure --types=Terraform,Kubernetes,Dockerfile --stdout=json
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**:

   ```bash
   # Use environment variables (recommended)
   export WIZ_CLIENT_ID="your-client-id"
   export WIZ_CLIENT_SECRET="your-client-secret"
   wizcli scan dir .

   # Or use wizcli auth command with device code
   wizcli auth --use-device-code
   wizcli scan dir .
   ```

2. **Timeout Issues**:

   ```bash
   # Increase timeout for large scans
   wizcli scan dir . --timeout=2h
   ```

3. **Filtering and Performance**:

   ```bash
   # Disable unnecessary scanners to speed up scans
   wizcli scan dir . --disabled-scanners=AIModels,SAST

   # Filter results to only show policy violations
   wizcli scan dir . --by-policy-hits=BLOCK

   # Scan specific subdirectories instead of entire project
   wizcli scan dir ./src --types=Terraform
   ```

4. **Configuration File**:

   ```bash
   # Use custom configuration file location
   wizcli scan dir . --wiz-configuration-file ./custom/.wiz

   # Create a .wiz file in your project root to set defaults
   ```

5. **False Positives**:
   - Use grace periods and ignore rules in the Wiz portal
   - Use `--show-ignored-by-grace-period` to see temporarily suppressed issues
   - Work with security team to adjust policies

6. **Debugging**:

   ```bash
   # Enable debug logging
   wizcli scan dir . --log=debug.log

   # Disable colors/styling for log parsing
   wizcli scan dir . --no-color --no-style
   ```

## Available Scanners

Wiz CLI v1 supports the following scanners (disable with `--disabled-scanners`):

- **Vulnerability**: CVE detection in dependencies and packages
- **Secret**: Exposed API keys, passwords, tokens, certificates
- **SensitiveData**: PII, financial data, credentials in data files
- **Misconfiguration**: Security misconfigurations in IaC and containers
- **SoftwareSupplyChain**: Supply chain security risks
- **AIModels**: AI/ML model security scanning
- **SAST**: Static Application Security Testing for code vulnerabilities
- **Malware**: Malware detection in images and files

## Output Formats

Available output formats via `--stdout`:

- `human`: Human-readable terminal output (default)
- `json`: Machine-readable JSON format
- `csv`: CSV format (also requires `--csv-output-file`)
- `sarif`: SARIF format for integration with security tools

## Notes

- This skill is based on **Wiz CLI v1.29.0** (built 2026-01-31)
- **REQUIRED**: You must use v1.x - v0.x is deprecated and end-of-life. Always check `wizcli version` before scanning.
- Use `wizcli scan <subcommand> --help` for detailed flag documentation
- For organization-specific policies, check with your security team
- Keep scan results confidential - they contain vulnerability details
- Environment variables `WIZ_CLIENT_ID` and `WIZ_CLIENT_SECRET` can be used for authentication
- Use `--no-publish` for local-only scans that shouldn't appear in the Wiz portal
