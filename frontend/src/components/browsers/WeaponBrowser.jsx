import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { updateWeapon, deleteWeapon } from '../../services/weaponService';
import { weaponTypes, weaponHandedness } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';
import { confirmDialog } from 'primereact/confirmdialog';

const WeaponBrowser = ({ weaponsData, traitOptions, userRole }) => {
  const [weapons, setWeapons] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setWeapons(weaponsData);
  }, [weaponsData]);

  const isEditable = userRole === 'ADMIN';

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
    let updatedWeapons = [...weapons];
    let { newData, index } = e;

    updatedWeapons[index] = newData;
    setWeapons(updatedWeapons);

    try {
      await updateWeapon(newData._id, newData);
      showToast('success', 'Success', 'Weapon updated successfully');
      console.log('Weapon updated successfully');
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error('Error updating weapon:', error.response.data?.error || error.response.data.message);
    }
  };

  const confirmDelete = (weapon) => {
    confirmDialog({
      message: `Are you sure you want to delete "${weapon.name}"?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(weapon._id),
      reject: () => {}
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteWeapon(id);
      setWeapons(prevWeapons => prevWeapons.filter(weapon => weapon._id !== id));
      showToast('success', 'Success', 'Weapon deleted successfully');
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Error deleting weapon');
      console.error('Error deleting weapon:', error.response?.data?.error || error.response?.data?.message);
    }
  };

  const textEditor = (options) => {
    return <InputText id={options.field} type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const numberEditor = (options) => {
    return <InputNumber id={options.field} value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const dropdownEditor = (options, selectionOptions) => {
    return (
      <Dropdown
        id={options.field}
        value={options.value}
        options={selectionOptions}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select an option"
      />
    );
  };

  const multiSelectEditor = (options, selectionOptions) => {
    return (
      <MultiSelect
        id={options.field}
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
      <h3>Browse Weapons</h3>
      <DataTable
        value={weapons}
        editMode={isEditable ? "row" : "none"}
        onRowEditComplete={isEditable ? onRowEditComplete : null}
        stripedRows
        paginator
        rows={10}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={isEditable ? (options) => textEditor(options) : null}></Column>
        <Column field="damageFactor" header="Damage Factor" sortable editor={isEditable ? (options) => numberEditor(options) : null}></Column>
        <Column field="traits" header="Traits" body={displayTraits} editor={isEditable ? (options) => multiSelectEditor(options, traitOptions) : null}></Column>
        <Column field="type" header="Type" sortable editor={isEditable ? (options) => dropdownEditor(options, weaponTypes) : null}></Column>
        <Column field="handedness" header="Handedness" sortable editor={isEditable ? (options) => dropdownEditor(options, weaponHandedness) : null}></Column>
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

export default WeaponBrowser;