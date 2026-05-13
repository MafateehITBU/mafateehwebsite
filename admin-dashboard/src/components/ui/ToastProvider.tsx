import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      richColors
      expand
      position="top-right"
      toastOptions={{
        className: "admin-toast",
        style: {
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          color: "#0f172a",
        },
      }}
    />
  );
};
