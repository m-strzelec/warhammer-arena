import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { updateTalent } from '../../services/talentService';
import { useToast } from '../../contexts/ToastContext';

const TalentBrowser = ({ talentsData }) => {
  const [talents, setTalents] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setTalents(talentsData);
  }, [talentsData]);

  const onRowEditComplete = async (e) => {
    let updatedTalents = [...talents];
    let { newData, index } = e;

    updatedTalents[index] = newData;
    setTalents(updatedTalents);

    try {
      await updateTalent(newData._id, newData);
      showToast('success', 'Success', 'Talent updated successfully');
      console.log('Talent updated successfully');
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error('Error updating talent:', error.response.data?.error || error.response.data.message);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  return (
    <>
      <h3>Browse Talents</h3>
      <DataTable
        value={talents}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        stripedRows
        paginator
        rows={20}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={(options) => textEditor(options)}></Column>
        <Column field="description" header="Description" sortable editor={(options) => textEditor(options)}></Column>
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </>
  );
};

export default TalentBrowser;