import { SearchParams } from './SearchParams';

export interface ColumnExport {
  key: string;
  header: string;
}

export type ExportFormat = 'EXCEL' | 'PDF' | 'CSV';

export interface MemberExportRequestDto {
  format: ExportFormat;
  columns: ColumnExport[];
  searchRequest: Partial<SearchParams>;
  memberIds?: string[];
}
