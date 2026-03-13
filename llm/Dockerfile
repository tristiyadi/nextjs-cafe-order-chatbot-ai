# Use the official Ollama image as the base
FROM ollama/ollama:latest

# We need to start the Ollama server temporarily during build 
# to pull the models into the image layers.
# Note: models will be stored in /root/.ollama
RUN nohup sh -c "ollama serve &" && \
    sleep 5 && \
    echo "Pulling llama3.2:1b..." && \
    ollama pull llama3.2:1b && \
    echo "Pulling mistral..." && \
    ollama pull mistral && \
    echo "Pulling qwen2.5:1.5b..." && \
    ollama pull qwen2.5:1.5b

# No need for an entrypoint change, the base image already has it.
