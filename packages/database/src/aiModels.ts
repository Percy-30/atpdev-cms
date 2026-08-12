export type ModelStatus = "Activo" | "Standby" | "Inactivo";

export type AIModelData = {
  id: string;
  name: string;
  provider: string;
  description: string;
  docs: string;
  color: "blue" | "emerald" | "purple" | "amber" | "rose" | "cyan";
  icon_name: "Cpu" | "FlaskConical" | "Bot" | "BrainCircuit" | "Database" | "Zap";
  capabilities: string[];
  tags: string[]; // Keywords to match against project stack
  is_visible: boolean;
  order_index?: number;
};
