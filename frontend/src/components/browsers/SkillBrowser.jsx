import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { updateSkill } from '../../services/skillService';

const SkillBrowser = ({ skillsData }) => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(skillsData);
  }, [skillsData]);

  const baseStats = [
    { label: 'Weapon Skill', value: 'WS' },
    { label: 'Ballistic Skill', value: 'BS' },
    { label: 'Strength', value: 'S' },
    { label: 'Toughness', value: 'T' },
    { label: 'Agility', value: 'Ag' },
    { label: 'Intelligence', value: 'Int' },
    { label: 'Will Power', value: 'WP' },
    { label: 'Fellowship', value: 'Fel' },
  ];

  const onRowEditComplete = async (e) => {
    let updatedSkills = [...skills];
    let { newData, index } = e;

    updatedSkills[index] = newData;
    setSkills(updatedSkills);

    try {
      await updateSkill(newData._id, newData);
      console.log('Skill updated successfully');
    } catch (error) {
      console.error('Error updating skill:', error);
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

  return (
    <>
      <h3>Browse Skills</h3>
      <DataTable
        value={skills}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        stripedRows
        paginator
        rows={20}
        size="large"
        removableSort
      >
        <Column field="name" header="Name" sortable editor={(options) => textEditor(options)}></Column>
        <Column field="baseStat" header="Base Stat" sortable editor={(options) => dropdownEditor(options, baseStats)}></Column>
        <Column field="description" header="Description" sortable editor={(options) => textEditor(options)}></Column>
        <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
      </DataTable>
    </>
  );
};

export default SkillBrowser;