export type FieldCategory = 'CORE' | 'PRESET' | 'CUSTOM';

export type FieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'DATE'
  | 'SELECT'
  | 'MULTI_SELECT'
  | 'RADIO';

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface VisibilityCondition {
  dependsOn: string;
  equals: any;
}

export interface FormFieldDefinition {
  key: string;
  label: string;
  category: FieldCategory;
  type: FieldType;
  isRequired?: boolean;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: string[];
  order: number;
  validation?: FieldValidation;
}

export interface FormGroupDefinition {
  id: string;
  code: string;
  title: string;
  description?: string;
  order: number;
  isActive?: boolean;
  active?: boolean;
  visibilityCondition?: VisibilityCondition;
  fields: FormFieldDefinition[];
}

export interface FormSchema {
  version: string;
  lastModified: string | number[];
  groups: FormGroupDefinition[];
}
