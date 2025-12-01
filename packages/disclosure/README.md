# @enhancd/disclosure

Wrapper for react dialog, modal, popup, etc.



# Instaling

npm i @enhancd/disclosure


# Getting started

## Implement local instance (shadcn Dialog example)

```typescript
import { createDisclosureContext, useDisclosure, DisclosureProvider as EnhancedDisclosureProvider, type DisclosureProps  } from "@enhancd/disclosure";
import { Dialog } from "@widgets"; // shadcn Dialog
import type { ReactNode } from "react";

const DialogContext = createDisclosureContext();

export interface DialogProps<T> extends DisclosureProps<T> {};

export const useDialog = () => useDisclosure(DialogContext);

export const DialogProvider = ({ children }: { children?: ReactNode }) => {
  return (
    <EnhancedDisclosureProvider context={DialogContext}>
      {
        ({ setOpened, opened, modalContent }) => (
          <>
            <Dialog open={opened} onOpenChange={setOpened} modal={false}>{modalContent}</Dialog>
            {children}
          </>
        )
      }
    </EnhancedDisclosureProvider>
  )
}

```

## Render provider (in root for example)

```typescript
root.render(
  <StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </StrictMode>
);
```

## Use disclosure inside provider's children

```typescript
const dialog = useDialog();
try {
const input = await dialog.show(DialogWindow, { ...params})
} catch(e) {
  // catch tarminate disclosure
}
```

## DialogWindow shadcn example

```typescript
interface DialogWindowProps extends DialogProps<ReturnType> {
  paramA: any,
  paramB: any,
  //...
}
const DialogWindow = (props: DialogWindowProps) => {
  return (
    <DialogContent>
      <DialogTitle>{"Hello world"}</DialogTitle>
      <button onClick={() => {
        props.resolve(data) // return data from disclosure
        // or
        props.reject(new Error("terminate disclosure")) // terminate disclosure with error
      }}>confirm</button>
    </DialogContent>
  )
}
```

