import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { updateTalent, deleteTalent } from '../../services/talentService';
import { useToast } from '../../contexts/ToastContext';
import { confirmDialog } from 'primereact/confirmdialog';

const TalentBrowser = ({ talentsData, userRole }) => {
  const [talents, setTalents] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setTalents(talentsData);
  }, [talentsData]);

  const isEditable = userRole === 'ADMIN';

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

  const confirmDelete = (talent) => {
  confirmDialog({
    message: `Are you sure you want to delete "${talent.name}"?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClassName: 'p-button-danger',
    accept: () => handleDelete(talent._id),
    reject: () => {}
  });
};

  const handleDelete = async (id) => {
    try {
      await deleteTalent(id);
      setTalents(prevTalents => prevTalents.filter(talent => talent._id !== id));
      showToast('success', 'Success', 'Talent deleted successfully');
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Error deleting talent');
      console.error('Error deleting talent:', error.response?.data?.error || error.response?.data?.message);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
        <Button icon="pi pi-trash" className="delete-button" text onClick={() => confirmDelete(rowData)} />
    );
  };
  
  return (
    <>
      <h3>Browse Talents</h3>
      <DataTable
        value={talents}
        editMode={isEditable ? "row" : "none"}
        onRowEditComplete={isEditable ? onRowEditComplete : null}
        stripedRows
        paginator
        rows={10}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={isEditable ? (options) => textEditor(options) : null}></Column>
        <Column field="description" header="Description" sortable editor={isEditable ? (options) => textEditor(options) : null}></Column>
        {isEditable && (
          <Column field="edit" header="Edit" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }}></Column>
        )}
        {isEditable && (
          <Column field="delete" header="Delete" body={actionBodyTemplate} headerStyle={{ width: '10%', minWidth: '8rem' }}></Column>
        )}
      </DataTable>
    </>
  );
};

export default TalentBrowser;