import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';

const WeaponBrowser = ({ weaponsData }) => {
  const displayTraits = (rowData) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {rowData.traits.map((item, index) => (
          <Chip key={index} label={item.name} />
        ))}
      </div>
    );
  };

  return (
    <>
      <h3>Browse Weapons</h3>
      <DataTable value={weaponsData} stripedRows paginator rows={20} size='large' removableSort>
        <Column field="name" header="Name" sortable></Column>
        <Column field="damageFactor" header="Damage Factor" sortable></Column>
        <Column field="traits" header="Traits" body={displayTraits}></Column>
        <Column field="type" header="Type" sortable></Column>
        <Column field="handedness" header="Handedness" sortable></Column>
      </DataTable>
    </>
  );
};

export default WeaponBrowser;