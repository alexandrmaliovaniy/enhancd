# @enhancd/disclosure

Promise-based modal/dialog/popup state management for React. Wraps any dialog UI component and lets you `await` user interactions instead of managing open/close state manually.

## Installation

```
npm i @enhancd/disclosure
```

## How It Works

`@enhancd/disclosure` turns imperative modal patterns into async/await flows:

```typescript
// Before: boolean flags, callbacks, scattered state
const [open, setOpen] = useState(false);
const [result, setResult] = useState(null);
const handleConfirm = (value) => { setResult(value); setOpen(false); };

// After: one await call
const result = await dialog.show(ConfirmDialog, { message: "Are you sure?" });
```

When a modal closes without resolving (user presses Escape, clicks outside, etc.) the promise rejects automatically, so you never get a hanging promise.

## Getting Started

### 1. Create a disclosure instance

Create a file that wires the disclosure to your UI dialog component (shadcn, Headless UI, MUI, etc.):

```typescript
// src/dialog.tsx
import {
  createDisclosureContext,
  useDisclosure,
  DisclosureProvider as EnhancedDisclosureProvider,
  type DisclosureProps,
} from "@enhancd/disclosure";
import { Dialog } from "@/components/ui/dialog"; // shadcn Dialog or any other
import type { ReactNode } from "react";

const DialogContext = createDisclosureContext();

// Re-export for modal component props
export interface DialogProps<T> extends DisclosureProps<T> {}

// Hook used inside the app
export const useDialog = () => useDisclosure(DialogContext);

// Provider that renders the actual dialog shell
export const DialogProvider = ({ children }: { children?: ReactNode }) => (
  <EnhancedDisclosureProvider context={DialogContext}>
    {({ setOpened, opened, modalContent }) => (
      <>
        <Dialog open={opened} onOpenChange={setOpened} modal={false}>
          {modalContent}
        </Dialog>
        {children}
      </>
    )}
  </EnhancedDisclosureProvider>
);
```

### 2. Add the provider to your app root

```typescript
// src/main.tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { DialogProvider } from "./dialog";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </StrictMode>
);
```

### 3. Define a modal component

Modal components receive `resolve` and `reject` via props (injected automatically by the disclosure):

```typescript
// src/components/ConfirmDialog.tsx
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { DialogProps } from "../dialog";

interface ConfirmDialogProps extends DialogProps<boolean> {
  title: string;
  message: string;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => (
  <DialogContent>
    <DialogTitle>{props.title}</DialogTitle>
    <p>{props.message}</p>
    <button onClick={() => props.resolve(true)}>Confirm</button>
    <button onClick={() => props.reject(new Error("Cancelled"))}>Cancel</button>
  </DialogContent>
);
```

### 4. Show the modal and await the result

```typescript
// src/components/DeleteButton.tsx
import { useDialog } from "../dialog";
import { ConfirmDialog } from "./ConfirmDialog";

export const DeleteButton = () => {
  const dialog = useDialog();

  const handleClick = async () => {
    try {
      const confirmed = await dialog.show(ConfirmDialog, {
        title: "Delete item",
        message: "This action cannot be undone.",
      });
      if (confirmed) {
        // proceed with deletion
      }
    } catch {
      // user dismissed the dialog
    }
  };

  return <button onClick={handleClick}>Delete</button>;
};
```

## API Reference

### `createDisclosureContext()`

Creates a React context for a disclosure instance. Call once per dialog type (e.g. one for confirmations, one for alerts).

```typescript
const DialogContext = createDisclosureContext();
```

---

### `DisclosureProvider`

Provider component that manages state and renders the modal content.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `context` | `Context` | The context created by `createDisclosureContext()` |
| `children` | `(service) => ReactElement` | Render function that receives the disclosure service |

**Service object passed to `children`:**

| Property | Type | Description |
|----------|------|-------------|
| `opened` | `boolean` | Whether the modal is currently open |
| `setOpened` | `(value: boolean) => void` | Manually set the open state |
| `modalContent` | `ReactNode \| null` | The rendered modal component |
| `show` | `(Modal, params?) => Promise` | Open a modal and await the result |
| `close` | `() => void` | Close the modal and reset state |

---

### `useDisclosure(context)`

Hook to access the disclosure service from within the provider tree.

```typescript
const dialog = useDisclosure(DialogContext);
```

Throws `"Disclosure provider not found!"` if called outside a matching `DisclosureProvider`.

---

### `show(Modal, params?)`

Opens a modal component and returns a promise that resolves/rejects based on user interaction.

```typescript
const result = await dialog.show(MyModal, { paramA: "value" });
```

- `Modal` — any React component whose props extend `DisclosureProps<RT>`
- `params` — all props except `resolve` and `reject` (those are injected automatically)
- Returns `Promise<RT>` where `RT` is inferred from the modal's `resolve` prop type

---

### `DisclosureProps<RT>`

Interface for modal component props. Extend it in every modal:

```typescript
interface MyModalProps extends DisclosureProps<string> {
  // your custom props
}
```

| Property | Type | Description |
|----------|------|-------------|
| `resolve` | `(value: RT) => unknown` | Call to close the modal and resolve the promise |
| `reject` | `(reason?: unknown) => void` | Call to close the modal and reject the promise |

## Multiple Disclosure Types

You can have independent disclosure instances for different dialog types:

```typescript
const DialogContext = createDisclosureContext();
const AlertContext  = createDisclosureContext();
const DrawerContext = createDisclosureContext();

export const useDialog = () => useDisclosure(DialogContext);
export const useAlert  = () => useDisclosure(AlertContext);
export const useDrawer = () => useDisclosure(DrawerContext);
```

Each requires its own `DisclosureProvider` wrapping the component tree.

## Automatic Rejection on Close

If the dialog shell closes (e.g. user clicks outside) without `resolve` or `reject` being called, the promise rejects with `new Error("Disclosure was closed")`. Always wrap `await dialog.show(...)` in a `try/catch`.
