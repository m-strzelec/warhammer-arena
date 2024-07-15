import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';

const ArmorBrowser = ({ armorsData }) => {
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

  return (
    <>
      <h3>Browse Armors</h3>
      <DataTable value={armorsData} stripedRows paginator rows={20} size='large' removableSort>
        <Column field="name" header="Name" sortable></Column>
        <Column field="locations" header="Locations" sortable body={displayLocations}></Column>
        <Column field="protectionFactor" header="Protection Factor" sortable></Column>
        <Column field="traits" header="Traits" body={displayTraits}></Column>
      </DataTable>
    </>
  );
};

export default ArmorBrowser;