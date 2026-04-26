import os
from datetime import datetime

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "..", "memory", "memory.md")

def update_memory(event: str):
    """Appends an event to the memory.md file with a timestamp."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"* {timestamp} : {event}\n"
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    
    with open(MEMORY_FILE, "a") as f:
        f.write(log_entry)
