import { useState, useCallback } from "react";
import { Toast as BsToast, ToastContainer } from "react-bootstrap";

export default function useToast() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
  }, []);

  const toastElement = (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ position: "fixed", zIndex: 9999 }}
    >
      <BsToast
        bg={toast.variant}
        show={toast.show}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
        delay={3000}
        autohide
      >
        <BsToast.Body className="text-white">{toast.message}</BsToast.Body>
      </BsToast>
    </ToastContainer>
  );

  return [toastElement, showToast];
}