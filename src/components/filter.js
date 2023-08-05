import { FilterPanel } from '@react_db_client/components.filter-manager';
import { useState } from 'react';

export const Filter = (props) => {
  return (
    <FilterPanel
      filterData={[
        {
          uid: 'demoFilterString',
          field: 'name',
          value: 'Foo',
          label: 'Example String Field',
          operator: 'contains',
          type: 'text',
          filterOptionId: 'name',
          isCustomType: false,
          isValidFilter: true,
        },
        {
          uid: 'demoFilterNumber',
          field: 'count',
          value: 0,
          label: 'Example Number Field',
          operator: '>',
          type: 'number',
          filterOptionId: 'count',
          isCustomType: false,
          isValidFilter: true,
        },
        {
          uid: 'demoFilterExpression',
          field: 'select',
          value: 'a',
          label: 'select',
          operator: 'contains',
          type: 'select',
          filterOptionId: 'select',
          isCustomType: false,
          isValidFilter: true,
        },
        {
          uid: 'demoFilterCustom',
          field: 'customField',
          value: 'a',
          label: 'customField',
          operator: 'contains',
          type: 'customFilter',
          filterOptionId: 'customField',
          isCustomType: true,
          isValidFilter: true,
        },
      ]}
    />
  );
};
