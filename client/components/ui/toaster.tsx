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
      {toasts.map(function ({ id, title, description, action, ...props }: any) {
        const isArmVariant = props.variant === "arm" && props.accentColor;

        return (
          <Toast
            key={id}
            {...props}
            style={isArmVariant ? {
              borderColor: `${props.accentColor}80`,
              backgroundColor: `${props.accentColor}1A`,
              color: props.accentColor,
              boxShadow: `0 25px 50px -12px ${props.accentColor}33`,
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
