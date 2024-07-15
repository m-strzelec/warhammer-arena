import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TraitBrowser = ({ traitsData }) => {
  return (
    <>
      <h3>Browse Traits</h3>
      <DataTable value={traitsData} stripedRows paginator rows={20} size='large' removableSort>
        <Column field="name" header="Name" sortable></Column>
        <Column field="description" header="Description"></Column>
      </DataTable>
    </>
  );
};

export default TraitBrowser;