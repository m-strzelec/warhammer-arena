import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getAllUsers, updateUser, deleteUser } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/common/LoadingPage';
import UserForm from '../components/forms/UserForm';
import { Tooltip } from 'primereact/tooltip';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const editButtonRef = useRef([]);
  const tooltipRef = useRef([]);
  editButtonRef.current = [];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        showToast('error', 'Error', error.response.data?.message);
        console.error(error.response.data?.error || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  const onEditClick = (userToEdit) => {
    if (tooltipRef.current[userToEdit.id]) {
      tooltipRef.current[userToEdit.id].hide();
    }
    setEditingUser(userToEdit);
    setShowEditModal(true);
  };

  const handleSaveUser = async (updatedData) => {
    try {
      await updateUser(editingUser.id, updatedData);
      showToast('success', 'Success', `User "${updatedData.username}" updated successfully!`);
      const updatedUsers = users.map(user =>
        user.id === editingUser.id ? { ...user, ...updatedData } : user
      );
      setUsers(updatedUsers);
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      showToast('error', 'Error', error.response.data?.message);
      console.error(error.response.data?.error || error.response.data.message);
      throw error;
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const confirmDelete = (userToDelete) => {
    confirmDialog({
      message: `Are you sure you want to delete user "${userToDelete.username}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeleteUser(userToDelete.id),
      reject: () => { }
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      showToast('success', 'Deleted', 'User deleted successfully!');
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      showToast('error', 'Error', error.response.data?.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex gap-2">
        <Button
          ref={el => editButtonRef.current[rowData.id] = el}
          icon="edit-icon"
          severity="secondary"
          text
          rounded
          onClick={() => onEditClick(rowData)}
          className="action-button"
        />
        <Tooltip 
          ref={el => tooltipRef.current[rowData.id] = el}
          target={editButtonRef.current[rowData.id]}
          content="Edit User"
          position="bottom"
        />
        {currentUser?.id !== rowData.id && (
          <Button
            icon="delete-icon"
            severity="danger"
            text
            rounded
            onClick={() => confirmDelete(rowData)}
            tooltip="Delete User"
            tooltipOptions={{ position: 'bottom' }}
            className="action-button"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingPage message="Loading users..." />;
  }

  return (
    <Container className="my-5">
      <ConfirmDialog />
      <Row className="text-center">
        <Col className="page-header">
          <h1 className="display-4">Users</h1>
          <p className="lead">Manage users, edit their details, and remove accounts as needed.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container>
            <Row>
              <Col>
                <DataTable
                  value={users}
                  stripedRows
                  paginator
                  rows={10}
                  dataKey="id"
                  emptyMessage="No users found."
                  sortMode="multiple"
                  size="large"
                  removableSort
                >
                  <Column field="username" header="Username" sortable />
                  <Column field="type" header="User Type" sortable />
                  <Column field="created_at" header="Created At" body={(rowData) => new Date(rowData.created_at).toLocaleDateString()} sortable />
                  <Column header="Actions" body={actionBodyTemplate} exportable={false} />
                </DataTable>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={handleCancelEdit} enforceFocus={false} backdrop="static" size="xl" className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Edit User: {editingUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser ? (
            <UserForm
              initialUserData={editingUser}
              onSave={handleSaveUser}
              onCancel={handleCancelEdit}
            />
          ) : (
            <LoadingPage message="Loading user data..." />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminUsersPage;