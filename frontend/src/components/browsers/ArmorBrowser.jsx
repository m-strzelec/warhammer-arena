import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { updateArmor, deleteArmor } from '../../services/armorService';
import { locationFullNames } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';
import { confirmDialog } from 'primereact/confirmdialog';

const ArmorBrowser = ({ armorsData, traitOptions, userRole }) => {
  const [armors, setArmors] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setArmors(armorsData);
  }, [armorsData]);

  const isEditable = userRole === 'ADMIN';

  const armorLocations = Object.entries(locationFullNames).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const displayLocations = (rowData) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {rowData.locations.map((item, index) => (
          <Chip key={index} label={locationFullNames[item]} />
        ))}
      </div>
    );
  };

  const displayTraits = (rowData) => {
    const traits = rowData.traits || [];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {traits.map((item) => (
          <Chip key={item._id} label={item.name} />
        ))}
      </div>
    );
  };

  const onRowEditComplete = async (e) => {
    let updatedArmors = [...armors];
    let { newData, index } = e;

    updatedArmors[index] = newData;
    setArmors(updatedArmors);

    try {
      await updateArmor(newData._id, newData);
      showToast('success', 'Success', 'Armor updated successfully');
      console.log('Armor updated successfully');
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Error updating armor');
      console.error('Error updating armor:', error.response?.data?.error || error.response?.data?.message);
    }
  };

  const confirmDelete = (armor) => {
    confirmDialog({
      message: `Are you sure you want to delete "${armor.name}"?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(armor._id),
      reject: () => {}
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteArmor(id);
      setArmors(prevArmors => prevArmors.filter(armor => armor._id !== id));
      showToast('success', 'Success', 'Armor deleted successfully');
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Error deleting armor');
      console.error('Error deleting armor:', error.response?.data?.error || error.response?.data?.message);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const numberEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const multiSelectEditorLocations = (options, selectionOptions) => {
    return (
      <MultiSelect
        value={options.value}
        options={selectionOptions}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select traits"
        display="chip"
      />
    );
  };

  const multiSelectEditorTraits = (options, selectionOptions) => {
    return (
      <MultiSelect
        value={options.value}
        options={selectionOptions}
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="name"
        placeholder="Select traits"
        display="chip"
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
        <Button icon="pi pi-trash" className="delete-button" text onClick={() => confirmDelete(rowData)} />
    );
  };

  return (
    <>
      <h3>Browse Armors</h3>
      <DataTable
        value={armors}
        editMode={isEditable ? "row" : "none"}
        onRowEditComplete={isEditable ? onRowEditComplete : null}
        stripedRows
        paginator
        rows={10}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={isEditable ? (options) => textEditor(options) : null}></Column>
        <Column field="locations" header="Locations" sortable body={displayLocations} editor={isEditable ? (options) => multiSelectEditorLocations(options, armorLocations) : null}></Column>
        <Column field="protectionFactor" header="Protection Factor" sortable editor={isEditable ? (options) => numberEditor(options) : null}></Column>
        <Column field="traits" header="Traits" body={displayTraits} editor={isEditable ? (options) => multiSelectEditorTraits(options, traitOptions) : null}></Column>
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

export default ArmorBrowser;