#!/bin/bash

# UOG TEDE Campus HRMS - Server Security Script
# This script implements the "SSH Method" security requirements defined in System Design
# It secures the SSH daemon by disabling password auth and rooting.

CONFIG_FILE="/etc/ssh/sshd_config"
BACKUP_FILE="/etc/ssh/sshd_config.bak.$(date +%F_%T)"

echo "Starting SSH Security Hardening..."

# 1. Backup existing config
if [ -f "$CONFIG_FILE" ]; then
    echo "Backing up sshd_config to $BACKUP_FILE..."
    cp "$CONFIG_FILE" "$BACKUP_FILE"
else
    echo "Error: sshd_config not found at $CONFIG_FILE"
    exit 1
fi

# 2. Configure SSH parameters
# We use sed to find and replace or append the settings

# Disable Password Authentication (Force Key-Based Auth)
# sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' $CONFIG_FILE
# sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' $CONFIG_FILE
# Using a function to ensure it creates the line if missing
set_config() {
    local param=$1
    local value=$2
    if grep -q "^#\?${param}" "$CONFIG_FILE"; then
        sed -i "s/^#\?${param}.*/${param} ${value}/" "$CONFIG_FILE"
    else
        echo "${param} ${value}" >> "$CONFIG_FILE"
    fi
}

echo "Configuring: Disable Password Authentication..."
set_config "PasswordAuthentication" "no"

echo "Configuring: Disable Root Login..."
set_config "PermitRootLogin" "no"

echo "Configuring: Disable Empty Passwords..."
set_config "PermitEmptyPasswords" "no"

echo "Configuring: Max Auth Tries (3)..."
set_config "MaxAuthTries" "3"

echo "Configuring: SSH Protocol 2..."
set_config "Protocol" "2"

# 3. Validation
echo "Verifying configuration..."
sshd -t
if [ $? -eq 0 ]; then
    echo "Configuration valid."
    echo "IMPORTANT: Ensure you have copied your SSH Public Key to ~/.ssh/authorized_keys BEFORE restarting the service!"
    echo "To apply changes, run: sudo systemctl restart sshd"
else
    echo "Configuration invalid! Restoring backup..."
    cp "$BACKUP_FILE" "$CONFIG_FILE"
    exit 1
fi

echo "SSH 'Method' Implementation Complete."
