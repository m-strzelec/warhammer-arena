import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { updateArmor } from '../../services/armorService';
import { locationFullNames } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';

const ArmorBrowser = ({ armorsData }) => {
  const [armors, setArmors] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setArmors(armorsData);
  }, [armorsData]);

  const armorLocations = Object.entries(locationFullNames).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const displayLocations = (rowData) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {rowData.locations.map((item, index) => (
          <Chip key={index} label={item} />
        ))}
      </div>
    );
  };

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
    let updatedArmors = [...armors];
    let { newData, index } = e;

    updatedArmors[index] = newData;
    setArmors(updatedArmors);

    try {
      await updateArmor(newData._id, newData);
      showToast('success', 'Success', 'Armor updated successfully');
      console.log('Armor updated successfully');
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const numberEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  const multiSelectEditor = (options, selectionOptions) => {
    return (
      <MultiSelect
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
      <h3>Browse Armors</h3>
      <DataTable
        value={armors}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        stripedRows
        paginator
        rows={20}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={(options) => textEditor(options)}></Column>
        <Column field="locations" header="Locations" sortable body={displayLocations} editor={(options) => multiSelectEditor(options, armorLocations)}></Column>
        <Column field="protectionFactor" header="Protection Factor" sortable editor={(options) => numberEditor(options)}></Column>
        <Column field="traits" header="Traits" body={displayTraits}></Column>
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </>
  );
};

export default ArmorBrowser;
