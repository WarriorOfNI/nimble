import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableSupportedTypesField, TableFieldName, TableFieldValue } from '../../table/types';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

export type TableColumnTextFormatBaseRecord = TableSupportedTypesField<'value'>;
export interface TableColumnTextFormatBaseColumnConfig {
    placeholder: string;
    shouldUsePlaceholder(value: TableColumnTextFormatBaseRecord): boolean;
    formatFunction(data: TableFieldValue): string;
}

/**
 * The base class for table columns that render as text with custom formatting behavior
 */
export class TableColumnTextFormatBase extends TableColumn<
TableColumnTextFormatBaseRecord,
TableColumnTextFormatBaseColumnConfig
> {
    public cellRecordFieldNames = ['value'] as const;

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    public readonly cellStyles = cellStyles;

    public readonly cellTemplate = cellTemplate;

    /*
     * Call this function in the derived class file to register the column
     * @param elementName The custom element name. Will be prefixed with "nimble-".
     */
    public static registerColumn(elementName: string): void {
        const nimbleTableColumn = TableColumnTextFormatBase.compose({
            baseName: elementName,
            template,
            styles
        });

        DesignSystem.getOrCreate()
            .withPrefix('nimble')
            .register(nimbleTableColumn());
    }

    public static shouldUsePlaceholder(data: TableColumnTextFormatBaseRecord): boolean {
        return data === undefined || data === null;
    }

    public static formatFunction(_data: TableFieldValue): string {
        return '';
    }

    public getColumnConfig(): TableColumnTextFormatBaseColumnConfig {
        return {
            placeholder: this.placeholder ?? '',
            shouldUsePlaceholder: TableColumnTextFormatBase.shouldUsePlaceholder,
            formatFunction: TableColumnTextFormatBase.formatFunction
        };
    }

    public getDataRecordFieldNames(): (TableFieldName | undefined)[] {
        return [this.fieldName];
    }
}