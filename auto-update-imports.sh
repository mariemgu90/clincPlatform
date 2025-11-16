#!/bin/bash

# Script to automatically update pages to use AppLayout structure
# This removes Header/Sidebar imports and wraps content with proper structure

echo "Starting automatic page updates..."
echo ""

# Counter for updated files
updated_count=0

# Find all page.jsx files that still have Header/Sidebar imports
find src/app/\(app\) -name "page.jsx" -type f | while read -r file; do
    if grep -q "from.*Header\|from.*Sidebar" "$file"; then
        echo "Processing: $file"
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Remove Header and Sidebar imports (and their session/router if not used elsewhere)
        sed -i "/import.*Header.*from/d" "$file"
        sed -i "/import.*Sidebar.*from/d" "$file"
        
        # Check if useSession and useRouter are still needed
        # If the file has authentication checks, we might need to keep them
        # For now, we'll handle this case-by-case
        
        echo "  ✓ Removed Header/Sidebar imports"
        
        # Note: The actual content restructuring needs to be done manually
        # as it requires understanding the specific structure of each page
        
        updated_count=$((updated_count + 1))
    fi
done

echo ""
echo "================================================"
echo "Import cleanup complete!"
echo "Updated $updated_count files"
echo "Backups saved with .backup extension"
echo ""
echo "Next steps:"
echo "1. Review each updated file"
echo "2. Remove old layout wrapper divs (Header, Sidebar, main)"
echo "3. Add RoleGuard if needed for protected pages"
echo "4. Remove unused useSession/useRouter if authentication is not needed"
echo "================================================"
