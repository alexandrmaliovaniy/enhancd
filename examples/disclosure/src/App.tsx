import { useDialog, type DialogProps } from "@api"
import { DialogContent, DialogDescription, DialogTitle } from "@widgets";
import { useState } from "react";

interface DialogWindowProps extends DialogProps<string> {
  userMessage: string;
}
const DialogWindow = (props: DialogWindowProps) => {
  const [userInput, setUserInput] = useState("");
  return (
    <DialogContent>
      <DialogTitle>{props.userMessage}</DialogTitle>
      <DialogDescription>
        <input value={userInput} onChange={e => setUserInput(e.target.value)} minLength={1} />
        <button type="button" onClick={() => props.resolve(userInput)}>Submit</button>
      </DialogDescription>
    </DialogContent>
  )
}

export const App = () => {
  const dialog = useDialog();
  const [userAction, setUserAction] = useState<{ type: "terminateWindow" | "inputString", message: string }>();
  return (
    <div>
      <button onClick={async () => {
        try {
          const input = await dialog.show(DialogWindow, { userMessage: "Hello world!" });
          setUserAction({ type: "inputString", message: `User input: ${input}` })
        } catch (e) {
          setUserAction({ type: "terminateWindow", message: "User terminated window" })
        }
      }}>
        Show dialog
      </button>
      {
        userAction &&
        <div>
           <div>Action type: {userAction.type}</div>
           <div>{userAction.message}</div>
        </div>
      }
    </div>
  )
}
