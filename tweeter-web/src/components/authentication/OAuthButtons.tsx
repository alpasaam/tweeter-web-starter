import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useMessageActions } from "../toaster/MessageHooks";

interface Props {
  provider: "google" | "facebook" | "twitter" | "linkedin" | "github";
}

const OAuthButtons = (props: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        displayInfoMessageWithDarkBackground(
          `${
            props.provider.charAt(0).toUpperCase() + props.provider.slice(1)
          } registration is not implemented.`
        )
      }
    >
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`${props.provider}Tooltip`}>
            {props.provider.charAt(0).toUpperCase() + props.provider.slice(1)}
          </Tooltip>
        }
      >
        <FontAwesomeIcon icon={["fab", `${props.provider}`]} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuthButtons;
