import { useState, useEffect, MouseEventHandler, FC } from "react";
import { AiOutlineClose } from "react-icons/ai";
import AOS from "aos";
import "aos/dist/aos.css";

interface ModalProps {
  title?: String;
  isShown: boolean;
  handleClose: MouseEventHandler<HTMLDivElement>;
}

export const Modal: FC<ModalProps> = ({
  children,
  title,
  isShown,
  handleClose,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const mode = JSON.parse(
      localStorage.getItem("currentUser") || "{}"
    ).darkMode;
    setDarkMode(mode);
    AOS.init({
      duration: 300,
    });
  }, []);
  return (
    <>
      {isShown ? (
        <div className={darkMode ? "dark modal-overlay" : "modal-overlay"}>
          <div className="modal-content" data-aos="fade-in">
            <div className="modal-dialog">
              <div className="modal-header">
                <p className="text-black dark:text-white uppercase font-semibold">
                  {title}
                </p>
                <div
                  className="modal-header-close-button"
                  onClick={handleClose}
                >
                  <AiOutlineClose className="dark:text-white" size="22" />
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const ModalBody: FC<{}> = ({ children }) => {
  return <div className="modal-body">{children}</div>;
};

export const ModalFooter: FC<{}> = ({ children }) => {
  return <div className="modal-footer">{children}</div>;
};
