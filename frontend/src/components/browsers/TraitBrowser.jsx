import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { updateTrait } from '../../services/traitService';

const TraitBrowser = ({ traitsData }) => {
  const [traits, setTraits] = useState([]);

  useEffect(() => {
    setTraits(traitsData);
  }, [traitsData]);

  const onRowEditComplete = async (e) => {
    let updatedTraits = [...traits];
    let { newData, index } = e;

    updatedTraits[index] = newData;
    setTraits(updatedTraits);

    try {
      await updateTrait(newData._id, newData);
      console.log('Trait updated successfully');
    } catch (error) {
      console.error('Error updating trait:', error);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  return (
    <>
      <h3>Browse Traits</h3>
      <DataTable
        value={traits}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        stripedRows
        paginator
        rows={20}
        size='large'
        removableSort
      >
        <Column field="name" header="Name" sortable editor={(options) => textEditor(options)}></Column>
        <Column field="description" header="Description" sortable editor={(options) => textEditor(options)}></Column>
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </>
  );
};

export default TraitBrowser;