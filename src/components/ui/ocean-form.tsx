import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
    useFormField,
} from "@/components/ui/form";

interface OceanFormItemProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon;
    label: string;
}

const OceanFormItem = React.forwardRef<HTMLDivElement, OceanFormItemProps>(
    ({ className, icon: Icon, label, children, ...props }, ref) => {
        return (
            <FormItem ref={ref} className={cn("space-y-1.5 group w-full", className)} {...props}>
                <FormLabel className="flex items-center gap-2 text-[11px] uppercase font-bold text-gray-400 ml-1 tracking-wider transition-colors group-focus-within:text-[#00D9FF]">
                    {Icon && (
                        <Icon className="w-3.5 h-3.5 text-[#00D9FF]/70 group-focus-within:text-[#00D9FF] group-focus-within:animate-pulse" />
                    )}
                    {label}
                </FormLabel>
                <div className="relative">
                    {children}
                    <div className="absolute inset-0 rounded-lg pointer-events-none border border-[#00D9FF]/0 group-focus-within:border-[#00D9FF]/30 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,217,255,0)] group-focus-within:shadow-[inset_0_0_10px_rgba(0,217,255,0.1)]" />
                </div>
                <OceanFormMessage />
            </FormItem>
        );
    }
);
OceanFormItem.displayName = "OceanFormItem";

const OceanFormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    return (
        <AnimatePresence mode="wait">
            {body && (
                <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                >
                    <p
                        ref={ref}
                        id={formMessageId}
                        className={cn(
                            "text-red-400 text-[10px] flex items-center gap-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/20 mt-1",
                            className
                        )}
                        {...props}
                    >
                        <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
                        <span>{body}</span>
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
OceanFormMessage.displayName = "OceanFormMessage";

export { OceanFormItem, OceanFormMessage };
