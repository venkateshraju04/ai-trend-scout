FROM n8nio/n8n

# Set working directory
WORKDIR /data

# Copy workflow JSON
COPY ./n8n_workspace.json /data/workflow.json

# Import the workflow and run n8n
CMD n8n import:workflow --input /data/workflow.json && n8n start
