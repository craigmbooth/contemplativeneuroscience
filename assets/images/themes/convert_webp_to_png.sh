#!/bin/bash

# Script to convert WebP images to PNG format in the current directory
# Usage: ./convert_webp_to_png.sh [filename.webp]
# If no filename is provided, converts all WebP files in the current directory

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed."
    echo "Please install it with: sudo apt-get install imagemagick"
    exit 1
fi

# Current directory is the themes directory
CURRENT_DIR="$(pwd)"

# If arguments are provided, process only those files
if [ $# -gt 0 ]; then
    WEBP_FILES=("$@")
else
    # Otherwise, find all WebP files in the current directory
    WEBP_FILES=(*.webp)
    # Check if any WebP files were found
    if [ "${#WEBP_FILES[@]}" -eq 1 ] && [ ! -f "${WEBP_FILES[0]}" ]; then
        echo "No WebP files found in the current directory."
        exit 0
    fi
fi

# Process each WebP file
for webp_file in "${WEBP_FILES[@]}"; do
    # Check if the file exists
    if [ ! -f "$webp_file" ]; then
        echo "Error: File not found: $webp_file"
        continue
    fi

    # Check if it's a WebP file
    if [[ "$webp_file" != *.webp ]]; then
        echo "Warning: $webp_file is not a WebP file. Skipping."
        continue
    fi

    # Extract just the filename without extension
    filename=$(basename "$webp_file" .webp)

    # Define the output PNG file path (in the same directory)
    output_file="$CURRENT_DIR/$filename.png"

    echo "Converting $webp_file to $output_file..."

    # Convert WebP to PNG using ImageMagick
    convert "$webp_file" "$output_file"

    # Check if conversion was successful
    if [ $? -eq 0 ]; then
        echo "Successfully converted to $output_file"
    else
        echo "Error: Failed to convert $webp_file"
    fi
done

# If no files were processed, show usage information
if [ "${#WEBP_FILES[@]}" -eq 0 ]; then
    echo "Usage: $0 [filename.webp [filename2.webp ...]]"
    echo "       Converts WebP images to PNG format in the current directory."
    echo "       If no filenames are provided, converts all WebP files."
fi

exit 0