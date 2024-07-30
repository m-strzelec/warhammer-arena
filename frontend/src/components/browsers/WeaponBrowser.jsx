import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { updateWeapon } from '../../services/weaponService';

const WeaponBrowser = ({ weaponsData, traitOptions }) => {
  const [weapons, setWeapons] = useState([]);

  useEffect(() => {
    setWeapons(weaponsData);
  }, [weaponsData]);

  const weaponTypes = [
    { label: 'Melee', value: 'melee' },
    { label: 'Range', value: 'range' }
  ];

  const weaponHandedness = [
    { label: 'One-handed', value: 'one-handed' },
    { label: 'Two-handed', value: 'two-handed' }
  ];

  const displayTraits = (rowData) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {rowData.traits.map((item, index) => (
          <Chip key={index} label={item.name} />
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
      console.log('Weapon updated successfully');
    } catch (error) {
      console.error('Error updating weapon:', error);
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
        placeholder="Select options"
        display="chip"
      />
    );
  };

  return (
    <>
      <h3>Browse Weapons</h3>
      <DataTable
        value={weapons}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        stripedRows
        paginator
        rows={20}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={(options) => textEditor(options)}></Column>
        <Column field="damageFactor" header="Damage Factor" sortable editor={(options) => numberEditor(options)}></Column>
        <Column field="traits" header="Traits" body={displayTraits} editor={(options) => multiSelectEditor(options, traitOptions)}></Column>
        <Column field="type" header="Type" sortable editor={(options) => dropdownEditor(options, weaponTypes)}></Column>
        <Column field="handedness" header="Handedness" sortable editor={(options) => dropdownEditor(options, weaponHandedness)}></Column>
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </>
  );
};

export default WeaponBrowser;