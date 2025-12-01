import React, { useState, ReactNode, useEffect, FC, createContext, useContext, ReactElement } from "react"

export type DisclosureProps<RT = unknown> = {
  resolve: (v: RT) => unknown;
  reject: (reason?: unknown) => void;
};

const DisclosureService = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [reject, setReject] = useState<((reason?: Error) => unknown) | null>(null);

  useEffect(() => {
    if (!opened && reject) reject(new Error("Disclosure was closed"));
  }, [opened]);

  const close = () => {
    setReject(null);
    setModalContent(null);
    setOpened(false);
  };

  const show = <DialogFrameProps extends DisclosureProps<any>, ResType = DialogFrameProps extends { resolve: (value: infer RT) => unknown } ? RT : unknown>(
    Modal: FC<DialogFrameProps>,
    params?: Omit<DialogFrameProps, "reject" | "resolve">
  ) => {
    return new Promise<ResType>((res, rej) => {
      setOpened(true);
      setReject(() => rej);
      setModalContent(
        <Modal
          {...params as DialogFrameProps}
          resolve={(arg) => {
            if (res) res(arg as ResType);
            close();
          }}
          reject={rej}
        />,
      );
    });
  };

  return { opened, setOpened, modalContent, show, close  }
}

export const createDisclosureContext = () => createContext<ReturnType<typeof DisclosureService> | null>(null);

export const useDisclosure = (context: ReturnType<typeof createDisclosureContext>) => {
  const ctx = useContext(context);
  if (!ctx) throw Error("Disclosure provider not found!");
  return ctx;
};


export const DisclosureProvider = ({ context: Ctx, children }: { context: React.Context<ReturnType<typeof DisclosureService> | null>, children: (args: ReturnType<typeof DisclosureService>) => ReactElement }) => {
  const srv = DisclosureService();
  return <Ctx.Provider value={srv}>{children(srv)}</Ctx.Provider>;
};
