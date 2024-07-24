import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const SkillBrowser = ({ skillsData }) => {
  return (
    <>
      <h3>Browse Skills</h3>
      <DataTable value={skillsData} stripedRows paginator rows={20} size='large' removableSort>
        <Column field="name" header="Name" sortable></Column>
        <Column field="baseStat" header="Base Stat" sortable></Column>
        <Column field="description" header="Description"></Column>
      </DataTable>
    </>
  );
};

export default SkillBrowser;