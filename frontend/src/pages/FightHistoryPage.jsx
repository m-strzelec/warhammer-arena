import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getFights, getFightsByCharacterId } from '../services/fightService';
import { useToast } from '../contexts/ToastContext';
import LoadingPage from '../components/common/LoadingPage';
import '../styles/pages/FightHistoryPage.css';

const FightHistoryPage = () => {
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const characterIdFilter = searchParams.get('characterId');

  useEffect(() => {
    const fetchFights = async () => {
      setLoading(true);
      try {
        let response;
        if (characterIdFilter) {
            response = await getFightsByCharacterId(characterIdFilter);
        } else {
            response = await getFights();
        }
        setFights(response.data);
      } catch (error) {
        showToast('error', 'Error', error.response.data?.message);
        console.error(error.response.data?.error || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFights();
  }, [showToast, characterIdFilter]);

  const characterNameBodyTemplate = (rowData, column) => {
    return rowData[column.field]?.name || 'N/A';
  };

  const lastWinnerBodyTemplate = (rowData) => {
    return rowData.lastWinner?.name || 'No winner';
  };

  if (loading) {
    return <LoadingPage message="Loading fight history..." />;
  }

  return (
    <Container className="my-5">
      <Row className="text-center">
        <Col className="page-header">
          <h1 className="display-4">Fight History</h1>
          <p className="lead">View the history of your recorded fights and their outcomes.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container className="fight-table-container">
            <Row>
              <Col>
              {characterIdFilter && (
                <div className="text-center">
                  <button
                    className="btn btn-secondary mb-3"
                    onClick={() => navigate('/fight-history')}
                  >
                    Show All Fights
                  </button>
                </div>
              )}
              <DataTable
                value={fights}
                stripedRows
                paginator
                rows={10}
                dataKey="_id"
                emptyMessage="No fights found"
                sortMode="multiple"
                size="large"
                removableSort
              >
                <Column field="character1" header="Character 1" body={characterNameBodyTemplate} sortable />
                <Column field="character2" header="Character 2" body={characterNameBodyTemplate} sortable />
                <Column field="character1Wins" header="Wins (Char 1)" sortable
                  body={(rowData) => {
                    const total = rowData.totalFights || 0;
                    const wins = rowData.character1Wins || 0;
                    const percent = total > 0 ? ((wins / total) * 100).toFixed(2) : '0.00';
                    return `${wins} (${percent}%)`;
                  }}
                />
                <Column field="character2Wins" header="Wins (Char 2)" sortable
                  body={(rowData) => {
                    const total = rowData.totalFights || 0;
                    const wins = rowData.character2Wins || 0;
                    const percent = total > 0 ? ((wins / total) * 100).toFixed(2) : '0.00';
                    return `${wins} (${percent}%)`;
                  }}
                />
                <Column field="totalFights" header="Total Fights" sortable />
                <Column field="lastWinner" header="Last Winner" body={lastWinnerBodyTemplate} sortable />
                <Column field="date" header="Date" sortable
                  body={(rowData) => {
                    const date = rowData.updatedAt || rowData.createdAt;
                    return date ? new Date(date).toLocaleDateString() : 'N/A';
                  }}
                />
              </DataTable>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default FightHistoryPage;