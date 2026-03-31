import React from "react";
import { Button } from "@mui/material";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: LucideIcon;
  endIcon?: LucideIcon;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel: string;
  ariaHaspopup?: boolean;
  ariaExpanded?: boolean;
  sx?: object;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  onClick,
  icon: Icon,
  endIcon: EndIcon,
  size = "medium",
  variant = "contained",
  color = "primary",
  disabled = false,
  fullWidth = false,
  ariaLabel,
  ariaHaspopup = false,
  ariaExpanded = false,
  sx = {},
  ...rest
}) => {
  return (
    <Button
      size={size}
      variant={variant}
      color={color}
      startIcon={Icon ? <Icon size={16} /> : undefined}
      endIcon={EndIcon ? <EndIcon size={16} /> : undefined}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      aria-label={ariaLabel}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 2,
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
        ...sx,
      }}
      {...rest}
    >
      {text}
    </Button>
  );
};