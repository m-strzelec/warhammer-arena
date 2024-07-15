import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TalentBrowser = ({ talentsData }) => {
  return (
    <>
      <h3>Browse Talents</h3>
      <DataTable value={talentsData} stripedRows paginator rows={20} size='large' removableSort>
        <Column field="name" header="Name" sortable></Column>
        <Column field="description" header="Description"></Column>
      </DataTable>
    </>
  );
};

export default TalentBrowser;