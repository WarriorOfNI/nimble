import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableFieldValue, TableStringField } from '../../table/types';
import { TableColumnTextFormatBase, TableColumnTextFormatBaseRecord } from '../text-format-base';
import { template } from '../base/template';
import { styles } from '../base/styles';

export type TableColumnTextCellRecord = TableStringField<'value'>;
export interface TableColumnTextColumnConfig {
    placeholder: string;
}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends TableColumnTextFormatBase {
    public override shouldUsePlaceholder(data: TableFieldValue): boolean {
        return typeof data !== 'string';
    }

    public override formatFunction(data: string): string {
        return data;
    }
}

// TODO: figure out this and static
// TableColumnTextFormatBase.registerColumn('table-column-text');

const nimbleTableColumn = TableColumnText.compose({
    baseName: 'table-column-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumn());