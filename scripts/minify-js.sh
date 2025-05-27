#!/bin/bash

# JavaScript Minification Script
# This script minifies all .js files in assets/js directory

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Set the directory containing JavaScript files
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JS_DIR="$SCRIPT_DIR/../assets/js"

# Function to check if uglifyjs is installed
check_uglifyjs() {
    if ! command -v uglifyjs &> /dev/null; then
        echo -e "${RED}Error: uglifyjs is not installed.${NC}"
        echo "Please install it using one of these methods:"
        echo "  npm install -g uglify-js"
        echo "  OR"
        echo "  sudo apt-get install node-uglify (Ubuntu/Debian)"
        exit 1
    fi
}

# Function to format file size
format_size() {
    local size=$1
    if [ $size -lt 1024 ]; then
        echo "${size} bytes"
    else
        echo "$(( size / 1024 )) KB"
    fi
}

# Function to minify a single JavaScript file
minify_file() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local output_file="${input_file%.js}.min.js"
    
    echo -e "${YELLOW}Minifying ${filename}...${NC}"
    
    # Get original file size
    local original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
    
    # Minify the file
    if uglifyjs "$input_file" \
        --compress drop_console=false,drop_debugger=true \
        --mangle toplevel=false,reserved=['$','jQuery'] \
        --output "$output_file" 2>/dev/null; then
        
        # Get minified file size
        local minified_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
        
        # Calculate reduction percentage
        local reduction=$(( 100 - (minified_size * 100 / original_size) ))
        
        echo -e "${GREEN}✓ ${filename} minified successfully${NC}"
        echo "  Original: $(format_size $original_size)"
        echo "  Minified: $(format_size $minified_size) (${reduction}% reduction)"
        echo "  Output: $(basename "$output_file")"
        echo ""
        
        return 0
    else
        echo -e "${RED}✗ Error minifying ${filename}${NC}"
        return 1
    fi
}

# Main script
main() {
    echo "JavaScript Minification Script"
    echo "=============================="
    echo ""
    
    # Check if uglifyjs is installed
    check_uglifyjs
    
    # Change to JS directory
    cd "$JS_DIR" || exit 1
    
    # Find all .js files that aren't already minified
    local js_files=()
    while IFS= read -r -d '' file; do
        js_files+=("$file")
    done < <(find . -maxdepth 1 -name "*.js" ! -name "*.min.js" -type f -print0)
    
    if [ ${#js_files[@]} -eq 0 ]; then
        echo "No JavaScript files found to minify in $JS_DIR"
        exit 0
    fi
    
    echo "Found ${#js_files[@]} JavaScript file(s) to minify:"
    echo ""
    
    # Counter for successful minifications
    local success_count=0
    local total_count=${#js_files[@]}
    
    # Process each file
    for file in "${js_files[@]}"; do
        if minify_file "$file"; then
            ((success_count++))
        fi
    done
    
    # Summary
    echo "=============================="
    echo -e "${GREEN}Minification complete!${NC}"
    echo "Successfully minified $success_count out of $total_count files."
    
    # List all minified files
    if [ $success_count -gt 0 ]; then
        echo ""
        echo "Minified files:"
        find . -maxdepth 1 -name "*.min.js" -type f | sort | sed 's/^\.\//  /'
    fi
}

# Run the main function
main "$@"