---
name: wizcli-security-scanner
description: Enables AI agents to leverage the Wiz CLI (wizcli) for security scanning, vulnerability detection, and remediation recommendations. Use this skill when analyzing code for security issues, running compliance scans, or when developers need security guidance.
---

# Wiz CLI Security Scanner

## Hard Requirements

Every scan command must include:
- `--no-publish` — do not publish results to the Wiz portal
- `--use-device-code --no-browser` — correct authentication method
- `--by-policy-hits=DISABLED` – return all results, regardless of whether they match a policy

## Scanning a Directory

```bash
# Full scan
wizcli scan dir . --no-publish --use-device-code --no-browser --by-policy-hits=DISABLED

# Limit to specific scanners (disable the rest)
wizcli scan dir . --disabled-scanners=Vulnerability,Secret,SensitiveData,Misconfiguration,SoftwareSupplyChain,AIModels,SAST,Malware --no-publish --use-device-code --no-browser --by-policy-hits=DISABLED
```

Available scanners: `Vulnerability`, `Secret`, `SensitiveData`, `Misconfiguration`, `SoftwareSupplyChain`, `AIModels`, `SAST`, `Malware`

## Results Format

Report findings using this structure:

```
## Wiz Scan Results

### Summary
- CRITICAL: X
- HIGH: X
- MEDIUM: X
- LOW: X

### Critical & High Findings
1. [Severity] Finding title (file:line)
   - What: brief description
   - Risk: what could happen
   - Fix: specific remediation

### Other Findings
[Group MEDIUM/LOW findings by category with brief descriptions]

### Next Steps
1. [Immediate action]
2. [Short-term action]
```