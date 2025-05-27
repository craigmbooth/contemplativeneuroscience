#!/bin/bash

# Script to run Jekyll serve with automatic JS minification
# This runs Jekyll and a file watcher in parallel

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
JS_DIR="$PROJECT_ROOT/assets/js"
MINIFY_SCRIPT="$SCRIPT_DIR/minify-js.sh"

# Check if fswatch is installed (for file watching)
check_fswatch() {
    if ! command -v fswatch &> /dev/null; then
        echo -e "${YELLOW}Warning: fswatch is not installed.${NC}"
        echo "File watching won't work. Install it with:"
        echo "  brew install fswatch (macOS)"
        echo "  sudo apt-get install fswatch (Ubuntu/Debian)"
        echo ""
        echo "Falling back to Jekyll serve only..."
        return 1
    fi
    return 0
}

# Function to watch JS files and minify on change
watch_and_minify() {
    echo -e "${BLUE}Starting JS file watcher...${NC}"
    
    # Initial minification
    echo -e "${YELLOW}Running initial minification...${NC}"
    "$MINIFY_SCRIPT"
    
    # Watch for changes
    fswatch -o "$JS_DIR" --exclude="\.min\.js$" | while read num ; do
        echo -e "\n${YELLOW}JS file changed, running minification...${NC}"
        "$MINIFY_SCRIPT"
        echo -e "${GREEN}Minification complete.${NC}\n"
    done
}

# Cleanup function to kill all background processes
cleanup() {
    echo -e "\n${YELLOW}Stopping all processes...${NC}"
    jobs -p | xargs -r kill 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) to cleanup properly
trap cleanup SIGINT

# Main execution
main() {
    echo -e "${GREEN}Starting Jekyll with automatic JS minification${NC}"
    echo "============================================="
    echo ""
    
    # Change to project root
    cd "$PROJECT_ROOT" || exit 1
    
    # Check if we can watch files
    if check_fswatch; then
        # Start the file watcher in the background
        watch_and_minify &
        WATCHER_PID=$!
        echo -e "${GREEN}JS file watcher started (PID: $WATCHER_PID)${NC}"
        echo ""
    fi
    
    # Start Jekyll serve
    echo -e "${BLUE}Starting Jekyll server...${NC}"
    echo ""
    bundle exec jekyll serve --watch
}

# Alternative implementation using inotifywait (Linux)
watch_and_minify_linux() {
    echo -e "${BLUE}Starting JS file watcher (using inotifywait)...${NC}"
    
    # Initial minification
    echo -e "${YELLOW}Running initial minification...${NC}"
    "$MINIFY_SCRIPT"
    
    # Watch for changes
    while true; do
        inotifywait -e modify,create -q "$JS_DIR"/*.js --exclude '.*\.min\.js$' 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "\n${YELLOW}JS file changed, running minification...${NC}"
            "$MINIFY_SCRIPT"
            echo -e "${GREEN}Minification complete.${NC}\n"
        fi
    done
}

# Check for inotifywait as alternative to fswatch (Linux)
check_inotifywait() {
    if command -v inotifywait &> /dev/null; then
        echo -e "${GREEN}Using inotifywait for file watching${NC}"
        watch_and_minify_linux &
        WATCHER_PID=$!
        echo -e "${GREEN}JS file watcher started (PID: $WATCHER_PID)${NC}"
        echo ""
        return 0
    fi
    return 1
}

# Enhanced main function that tries both fswatch and inotifywait
main_enhanced() {
    echo -e "${GREEN}Starting Jekyll with automatic JS minification${NC}"
    echo "============================================="
    echo ""
    
    # Change to project root
    cd "$PROJECT_ROOT" || exit 1
    
    # Try fswatch first, then inotifywait
    if check_fswatch; then
        watch_and_minify &
        WATCHER_PID=$!
        echo -e "${GREEN}JS file watcher started (PID: $WATCHER_PID)${NC}"
        echo ""
    elif check_inotifywait; then
        # Already handled in check_inotifywait
        :
    else
        echo -e "${YELLOW}No file watching tool found. JS files won't be automatically minified.${NC}"
        echo "Install one of these:"
        echo "  fswatch: brew install fswatch (macOS) or sudo apt-get install fswatch"
        echo "  inotify-tools: sudo apt-get install inotify-tools (Linux)"
        echo ""
    fi
    
    # Start Jekyll serve
    echo -e "${BLUE}Starting Jekyll server...${NC}"
    echo ""
    bundle exec jekyll serve --watch
}

# Run the enhanced main function
main_enhanced