import { useWarnAboutChange, useTranslate } from "@refinedev/core";
import { useEffect, useRef } from "react";
import { useBlocker, useLocation } from "react-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const DEFAULT_MESSAGE = "Are you sure you want to leave? You have unsaved changes.";

/**
 * Replaces Refine's UnsavedChangesNotifier: blocks in-app navigation when the form
 * dirty flag is set, and asks with SweetAlert2 instead of window.confirm.
 * Tab close / refresh still uses the browser's native beforeunload prompt (browser limitation).
 */
export function UnsavedChangesGuard() {
  const translate = useTranslate();
  const { pathname, search } = useLocation();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const message = translate("warnWhenUnsavedChanges", DEFAULT_MESSAGE);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!warnWhen) return false;
    return (
      currentLocation.pathname !== nextLocation.pathname ||
      currentLocation.search !== nextLocation.search
    );
  });
  const blockerRef = useRef(blocker);
  blockerRef.current = blocker;

  useEffect(() => {
    return () => setWarnWhen?.(false);
  }, [pathname, search, setWarnWhen]);

  useEffect(() => {
    if (!warnWhen) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [warnWhen, message]);

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    let alive = true;
    void Swal.fire({
      icon: "warning",
      title: "Unsaved changes",
      text: message,
      showCancelButton: true,
      confirmButtonText: "Leave",
      cancelButtonText: "Stay",
      reverseButtons: true,
      focusCancel: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      buttonsStyling: false,
      customClass: {
        popup: "maf-swal-popup",
        title: "maf-swal-title",
        htmlContainer: "maf-swal-html",
        confirmButton: "maf-swal-btn maf-swal-btn--confirm",
        cancelButton: "maf-swal-btn maf-swal-btn--cancel",
        actions: "maf-swal-actions",
      },
    }).then((result) => {
      if (!alive) return;
      const b = blockerRef.current;
      if (result.isConfirmed) {
        setWarnWhen?.(false);
        b.proceed?.();
      } else {
        b.reset?.();
      }
    });

    return () => {
      alive = false;
      if (Swal.isVisible()) {
        Swal.close();
      }
    };
  }, [blocker.state, blocker.location?.pathname, blocker.location?.search, message, setWarnWhen]);

  return null;
}
