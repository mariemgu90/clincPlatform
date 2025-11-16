#!/bin/bash

# Script to identify pages that need updating to use AppLayout
# Shows which pages still have Header/Sidebar imports

echo "================================================"
echo "Scanning for pages that need AppLayout update..."
echo "================================================"
echo ""

# Find all page.jsx files in (app) directory
find src/app/\(app\) -name "page.jsx" -type f | while read -r file; do
    # Check if file contains Header or Sidebar imports
    if grep -q "from.*Header\|from.*Sidebar" "$file"; then
        echo "❌ NEEDS UPDATE: $file"
        echo "   Contains: $(grep -o "import.*Header\|import.*Sidebar" "$file" | head -2 | tr '\n' ' ')"
        echo ""
    fi
done

echo ""
echo "================================================"
echo "✅ Pages already updated:"
echo "================================================"
echo ""

find src/app/\(app\) -name "page.jsx" -type f | while read -r file; do
    if ! grep -q "from.*Header\|from.*Sidebar" "$file"; then
        echo "✓ $file"
    fi
done

echo ""
echo "================================================"
echo "Summary"
echo "================================================"
total=$(find src/app/\(app\) -name "page.jsx" -type f | wc -l)
needs_update=$(find src/app/\(app\) -name "page.jsx" -type f -exec grep -l "from.*Header\|from.*Sidebar" {} \; | wc -l)
updated=$((total - needs_update))

echo "Total pages: $total"
echo "✅ Updated: $updated"
echo "❌ Needs update: $needs_update"
