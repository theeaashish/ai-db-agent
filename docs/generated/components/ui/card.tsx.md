# Card Component

The `Card` component is a modular UI primitive used to group related content into a distinct, contained area. It is built using Tailwind CSS and follows a semantic structure, making it ideal for displaying structured information like document summaries, settings, or data panels.

## Overview
This component is designed as a set of sub-components that provide consistent styling and layout for card-based interfaces. It is heavily utilized in the `DocumentPreview` component to organize document metadata and collapsible content sections.

## Components

| Component | Description |
| :--- | :--- |
| `Card` | The main container wrapper. Provides the border, background, and shadow. |
| `CardHeader` | A container for the card's title and description. Includes default padding and spacing. |
| `CardTitle` | Styled heading component for the card. |
| `CardDescription` | Styled text component for secondary information or summaries. |
| `CardContent` | The primary body area for the card's main content. |
| `CardFooter` | A container for actions or metadata, typically placed at the bottom of the card. |

## Usage Example

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Title</CardTitle>
        <CardDescription>A brief summary of the document contents.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content goes here.</p>
      </CardContent>
    </Card>
  )
}
```

## Key Features
*   **Semantic Structure:** Uses `data-slot` attributes to identify components within the DOM, aiding in testing and styling.
*   **Customizable:** Every sub-component accepts a `className` prop, allowing for easy overrides using Tailwind CSS utility classes.
*   **Consistent Design:** Enforces standard spacing, typography, and border-radius across the application.
*   **Utility Integration:** Uses the `cn` utility function (from `@/lib/utils`) to merge class names safely and handle conditional styling.