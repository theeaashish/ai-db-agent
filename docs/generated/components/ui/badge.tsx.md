# Badge Component

The `Badge` component is a reusable UI element used to display status indicators, categories, or labels. It is built using `class-variance-authority` (CVA) to manage variant styles efficiently and leverages the `cn` utility for flexible class merging.

## Overview

This component provides a consistent visual style for small pieces of information across the application. It is commonly used in headers or metadata sections, such as the `DocumentPreview` component, to highlight document types or status tags.

## Key Components

### `Badge`
The primary functional component. It renders a `div` element styled as a badge.

*   **Props**:
    *   `variant`: Determines the visual style of the badge.
    *   `className`: Optional string to override or extend existing styles.
    *   Inherits all standard `HTMLDivElement` attributes.

### `badgeVariants`
A CVA configuration object that defines the base styles and variant-specific styles.

#### Variants
| Variant | Description |
| :--- | :--- |
| `default` | Primary brand color background with white text. |
| `secondary` | Secondary theme color background. |
| `destructive` | Red background, typically used for errors or deletions. |
| `outline` | Transparent background with a border and standard text color. |

## Usage Example

```tsx
import { Badge } from "@/components/ui/badge"

// Default badge
<Badge>New</Badge>

// Outline badge (often used for metadata)
<Badge variant="outline">
  <FileText className="w-3 h-3 mr-2" />
  Generated Report
</Badge>

// Destructive badge
<Badge variant="destructive">Error</Badge>
```

## Dependencies
- **`class-variance-authority`**: Used to generate the variant-based class strings.
- **`@/lib/utils`**: Provides the `cn` utility function for merging Tailwind classes safely.