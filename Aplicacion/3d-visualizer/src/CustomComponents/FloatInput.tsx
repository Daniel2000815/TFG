import { Input } from "@nextui-org/react";

export default function FloatInput(props: {
  initialVal: string | number;
  onChange: (n: number) => void;
  label: string;
  errorMsg?: string;
  adornment?: string;
  adornmentPos: "right" | "left";
}) {
  return (
    <Input
      fullWidth
      initialValue={props.initialVal.toString()}
      defaultValue="0"
      onChange={(e) => props.onChange(parseFloat(e.target.value))}
      id={props.label}
      status={props.errorMsg !== undefined ? "error" : "default"}
      color={props.errorMsg !== undefined ? "error" : "default"}
      helperText={props.errorMsg}
      helperColor={props.errorMsg !== undefined ? "error" : "default"}
      labelRight={props.adornmentPos === "right" ? props.adornment : null}
      labelLeft={props.adornmentPos === "left" ? props.adornment : null}
      placeholder={props.label}
      aria-label={props.label}
    />
  );
}