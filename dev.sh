#!/bin/bash
# Use local Node.js if available
if [ -d ".node_bin" ]; then
  export PATH="$PWD/.node_bin/bin:$PATH"
fi

# Run the dev server
npm run dev
