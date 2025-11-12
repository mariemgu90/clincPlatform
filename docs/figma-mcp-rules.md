# Figma MCP Design System Rules — MedFlow

This file provides Figma MCP (Model Context Protocol) guidance for generating design system rules and code-connect mappings. Use these rules when creating or updating the Figma design file.

## Design System Tokens

### Colors

- **Primary**: #0f62fe (Blue 600)
- **Secondary**: #6f7c8a (Gray 500)
- **Success**: #24a148 (Green 600)
- **Warning**: #f1c21b (Yellow 500)
- **Danger**: #da1e28 (Red 600)
- **Background**: #ffffff (White)
- **Surface**: #f4f4f4 (Gray 100)
- **Text Primary**: #161616 (Gray 900)
- **Text Secondary**: #525252 (Gray 700)
- **Border**: #e0e0e0 (Gray 300)

### Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Font Sizes**:
  - xs: 12px
  - sm: 14px
  - base: 16px
  - lg: 18px
  - xl: 20px
  - 2xl: 24px
  - 3xl: 30px
- **Font Weights**:
  - normal: 400
  - medium: 500
  - semibold: 600
  - bold: 700

### Spacing Scale

- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radius

- sm: 4px
- md: 8px
- lg: 12px
- full: 9999px

## Component Library (for Figma)

Create these components as Figma components with variants and properties:

### Button

- **Variants**: primary, secondary, ghost, danger
- **States**: default, hover, active, disabled
- **Sizes**: sm, md, lg
- **Properties**: label (text), icon (optional), fullWidth (boolean)

### Input

- **States**: default, focus, error, disabled
- **Properties**: label, placeholder, helperText, errorText

### Card

- **Properties**: title, content, footer (optional), padding (md, lg)

### PatientCard

- **Properties**: patientName, dob, contact, tags (array), actions (buttons)

### AppointmentCard

- **Properties**: title, time, status (scheduled/completed/cancelled)

### Header

- **Properties**: clinicName, userName, avatarUrl

### Sidebar

- **Properties**: navItems (array of {label, icon, href, active})

## Code-Connect Mapping (sample)

When exporting components from Figma using MCP, map Figma node IDs to your React component file paths. Use the Figma MCP server tools to:

1. Call `mcp_figma_mcp-ser_get_code_connect_map` with your Figma file key and node IDs.
2. Update `docs/components-map.json` with the returned mappings.
3. Call `mcp_figma_mcp-ser_get_design_context` to generate UI code from Figma nodes.

Example mapping structure:
```json
{
  "nodeId": "123:456",
  "codeConnectSrc": "src/components/Button.jsx",
  "codeConnectName": "Button"
}
```

## Next steps for Figma integration

1. Open Figma and create a new file: "MedFlow Design System".
2. Create pages: "Tokens", "Components", "Screens".
3. Define color/text styles using the tokens above.
4. Build components (Button, Input, Card, PatientCard, etc.) with variants.
5. Design key screens: Dashboard, Patients, Calendar, Patient Portal.
6. Use Figma MCP tools to export design context and assets.
7. Run `mcp_figma_mcp-ser_get_variable_defs` to extract color/spacing variables.
8. Run `mcp_figma_mcp-ser_get_screenshot` to capture component previews.

## MCP Tool Usage (for automation)

If you have a Figma file already open in the Figma desktop app with the MCP server running, you can use these commands in your workflow:

- `mcp_figma_mcp-ser_whoami`: Check authentication.
- `mcp_figma_mcp-ser_get_metadata`: Get page/node structure overview.
- `mcp_figma_mcp-ser_get_design_context`: Generate code from a specific node.
- `mcp_figma_mcp-ser_get_screenshot`: Export node as image.
- `mcp_figma_mcp-ser_create_design_system_rules`: Generate design rules prompt for a node.

---

**Note**: Figma MCP integration requires the Figma desktop app and MCP server to be running. If you don't have a Figma file yet, create one manually using the tokens and component definitions above, then use MCP tools to export.
