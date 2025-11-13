import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function (toast: any) {
        const { id, title, description, action, variant, accentColor, ...props } = toast;
        const isArmVariant = variant === "arm" && accentColor;

        return (
          <Toast
            key={id}
            variant={variant}
            {...props}
            style={isArmVariant ? {
              borderColor: `${accentColor}80`,
              backgroundColor: `${accentColor}1A`,
              color: accentColor,
              boxShadow: `0 25px 50px -12px ${accentColor}33`,
            } : undefined}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
