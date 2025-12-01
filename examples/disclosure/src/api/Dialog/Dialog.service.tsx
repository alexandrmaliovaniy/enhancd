import { createDisclosureContext, useDisclosure, DisclosureProvider as EnhancedDisclosureProvider, type DisclosureProps  } from "@enhancd/disclosure";
import { Dialog } from "@widgets";
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
