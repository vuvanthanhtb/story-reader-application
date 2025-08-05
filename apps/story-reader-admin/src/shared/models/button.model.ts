export type IButton = {
  type: "button" | "submit" | "reset";
  label: string;
  key?: string;
  disabled?: boolean;
  action: string;
  style?: React.CSSProperties;
};
