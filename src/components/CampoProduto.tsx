import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getFieldPermission } from "@/lib/permissions";

interface CampoProdutoProps {
  fieldName: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  userPermissions: string[];
  type?: "text" | "number" | "textarea" | "select" | "switch";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export const CampoProduto = ({
  fieldName,
  label,
  value,
  onChange,
  userPermissions,
  type = "text",
  options,
  placeholder
}: CampoProdutoProps) => {
  const permission = getFieldPermission(userPermissions, fieldName);

  if (!permission.visible) {
    return null;
  }

  const isDisabled = !permission.editable;

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={placeholder}
            className={isDisabled ? "opacity-60" : ""}
          />
        );
      
      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange} disabled={isDisabled}>
            <SelectTrigger className={isDisabled ? "opacity-60" : ""}>
              <SelectValue placeholder={placeholder || "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "switch":
        return (
          <Switch
            checked={value || false}
            onCheckedChange={onChange}
            disabled={isDisabled}
            className={isDisabled ? "opacity-60" : ""}
          />
        );
      
      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={placeholder}
            className={isDisabled ? "opacity-60" : ""}
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={isDisabled}
            placeholder={placeholder}
            className={isDisabled ? "opacity-60" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName} className={isDisabled ? "opacity-60" : ""}>
        {label}
        {!permission.editable && permission.visible && (
          <span className="text-xs text-muted-foreground ml-1">(somente leitura)</span>
        )}
      </Label>
      {renderField()}
    </div>
  );
};