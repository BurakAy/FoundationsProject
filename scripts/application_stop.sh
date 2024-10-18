#!/bin/bash

echo "Attempting to stop Node.js application: $(date)"

# Find the PID(s) of the process running 'node src/app.js'
PIDS=$(pgrep -f "node src/app.js")

if [ -z "$PIDS" ]; then
    echo "No running process found for 'node src/app.js'"
    exit 0  # No process found, exit with success
fi

# Gracefully terminate the process
echo "Found process(es): $PIDS. Sending SIGTERM..."

# Send SIGTERM to all found PIDs
echo "$PIDS" | xargs -r kill -15

# Wait for the process to stop and check if it was successful
sleep 2  # Give it some time to gracefully shut down

# Check if the process is still running
PIDS_REMAINING=$(pgrep -f "node src/app.js")
if [ -z "$PIDS_REMAINING" ]; then
    echo "Process successfully stopped."
else
    echo "Process did not stop. Forcing termination with SIGKILL..."
    echo "$PIDS_REMAINING" | xargs -r kill -9
    echo "Process forcefully terminated."
fi

exit 0
