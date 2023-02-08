import { html, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableHeader } from '.';
import { IconArrowExpanderDown } from '../../../icons/arrow-expander-down';
import { IconArrowExpanderUp } from '../../../icons/arrow-expander-up';
import { ColumnSortDirection } from '../../types';

// prettier-ignore
export const template = html<TableHeader>`
    <template role="columnheader">
        <slot></slot>
        <span class="sort-indicator">
            ${when(x => x.sortDirection === ColumnSortDirection.ascending, html`
                <${DesignSystem.tagFor(IconArrowExpanderDown)}></${DesignSystem.tagFor(IconArrowExpanderDown)}>
            `)}
            ${when(x => x.sortDirection === ColumnSortDirection.descending, html`
                <${DesignSystem.tagFor(IconArrowExpanderUp)}></${DesignSystem.tagFor(IconArrowExpanderUp)}>
            `)}
        </span>
    </template>
`;
