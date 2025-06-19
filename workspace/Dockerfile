# Use official n8n image
FROM n8nio/n8n

# Create the working directory
RUN mkdir -p /root/.n8n

COPY ./n8n_workspace.json /root/.n8n/workflow.json

# Set working directory (where n8n stores data)
WORKDIR /root/.n8n
