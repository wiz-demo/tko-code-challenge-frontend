---
name: wizcli-setup
description: Guides AI agents through installing the Wiz CLI tool. Use this skill when wizcli is needed but not yet installed.
---

# Wiz CLI Setup

Only Wiz CLI **v1.x** is supported. Always install or upgrade to v1.x.

## Step 1: Check if Already Installed

```bash
which wizcli && wizcli version
```

- **v1.x**: Already good, no action needed.
- **v0.x**: Deprecated — remove and reinstall (see Step 2).
- **Not found**: Proceed to Step 2.

## Step 2: Install (Linux)

```bash
curl -Lo wizcli https://downloads.wiz.io/v1/wizcli/latest/wizcli-linux-amd64
chmod +x wizcli
sudo mv wizcli /usr/local/bin/
wizcli version
```

If `sudo` is unavailable:

```bash
mkdir -p ~/bin
mv wizcli ~/bin/
export PATH="$PATH:$HOME/bin"
```
