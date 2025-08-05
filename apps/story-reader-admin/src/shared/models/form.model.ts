import { IButton } from "./button.model";

type IField = {
  name?: string;
  label?: string;
  type: string;
  validation?: object;
  placeholder?: string;
  disabled?: boolean;
  size: number;
  required?: boolean;
  option?: string;
  childs?: IButton[];
  isMulti?: boolean;
};

export type IForm = {
  fields: IField[];
};
