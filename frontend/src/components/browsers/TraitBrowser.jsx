import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { updateTrait, deleteTrait } from '../../services/traitService';
import { useToast } from '../../contexts/ToastContext';
import { confirmDialog } from 'primereact/confirmdialog';

const TraitBrowser = ({ traitsData, userRole }) => {
  const [traits, setTraits] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setTraits(traitsData);
  }, [traitsData]);

  const isEditable = userRole === 'ADMIN';

  const onRowEditComplete = async (e) => {
    let updatedTraits = [...traits];
    let { newData, index } = e;

    updatedTraits[index] = newData;
    setTraits(updatedTraits);

    try {
      await updateTrait(newData._id, newData);
      showToast('success', 'Success', 'Trait updated successfully');
      console.log('Trait updated successfully');
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error('Error updating trait:', error.response.data?.error || error.response.data.message);
    }
  };

  const confirmDelete = (trait) => {
    confirmDialog({
      message: `Are you sure you want to delete "${trait.name}"?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(trait._id),
      reject: () => {}
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrait(id);
      setTraits(prevTraits => prevTraits.filter(trait => trait._id !== id));
      showToast('success', 'Success', 'Trait deleted successfully');
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Error deleting trait');
      console.error('Error deleting trait:', error.response?.data?.error || error.response?.data?.message);
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
      <h3>Browse Traits</h3>
      <DataTable
        value={traits}
        editMode={isEditable ? "row" : "none"}
        onRowEditComplete={isEditable ? onRowEditComplete : null}
        stripedRows
        paginator
        rows={10}
        size='large'
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

export default TraitBrowser;