import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { updateSkill, deleteSkill } from '../../services/skillService';
import { primaryStatFullNames } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';
import { confirmDialog } from 'primereact/confirmdialog';

const SkillBrowser = ({ skillsData, userRole }) => {
  const [skills, setSkills] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setSkills(skillsData);
  }, [skillsData]);

  const isEditable = userRole === 'ADMIN';

  const baseStats = Object.entries(primaryStatFullNames).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const onRowEditComplete = async (e) => {
    let updatedSkills = [...skills];
    let { newData, index } = e;

    updatedSkills[index] = newData;
    setSkills(updatedSkills);

    try {
      await updateSkill(newData._id, newData);
      showToast('success', 'Success', 'Skill updated successfully');
      console.log('Skill updated successfully');
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error('Error updating skill:', error.response.data?.error || error.response.data.message);
    }
  };

  const confirmDelete = (skill) => {
    confirmDialog({
      message: `Are you sure you want to delete "${skill.name}"?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDelete(skill._id),
      reject: () => {}
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(prevSkills => prevSkills.filter(skill => skill._id !== id));
      showToast('success', 'Success', 'Skill deleted successfully');
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || 'Error deleting skill');
      console.error('Error deleting skill:', error.response?.data?.error || error.response?.data?.message);
    }
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const dropdownEditor = (options, dropdownOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={dropdownOptions}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select an option"
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
      <h3>Browse Skills</h3>
      <DataTable
        value={skills}
        editMode={isEditable ? "row" : "none"}
        onRowEditComplete={isEditable ? onRowEditComplete : null}
        stripedRows
        paginator
        rows={10}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={isEditable ? (options) => textEditor(options) : null}></Column>
        <Column field="baseStat" header="Base Stat" sortable editor={isEditable ? (options) => dropdownEditor(options, baseStats) : null}></Column>
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

export default SkillBrowser;