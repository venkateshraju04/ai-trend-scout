# Use official n8n image
FROM n8nio/n8n

# Set working directory to a non-root path
WORKDIR /home/node

# Create n8n config directory
RUN mkdir -p /home/node/.n8n

# Copy workflow file to config directory
COPY ./workflow/n8n_workspace.json /home/node/.n8n/workflow.json

# Ensure correct permissions
RUN chown -R node:node /home/node/.n8n

# Use non-root user
USER node

# Start n8n (Render will auto-run `CMD`)
