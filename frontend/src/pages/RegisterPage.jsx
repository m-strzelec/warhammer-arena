import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import '../styles/pages/AuthPage.css';

const RegisterPage = () => {
    const { handleRegister } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            showToast('warn', 'Warning', 'Passwords do not match');
            return;
        }
        try {
            await handleRegister(username, password);
            showToast('success', 'Success', 'Registration successful! You can now log in.');
            navigate('/login');
        } catch (err) {
            showToast('error', 'Error', err.response.data.message);
            console.error(err.response.data?.error || err.response.data.message);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={7} lg={5}>
                    <div className="auth-container">
                        <div className="auth-title">Register</div>
                        <Form onSubmit={handleSubmit} className="auth-form">
                            <Form.Group className="mb-3">
                                <Form.Label style={{ minWidth: 90, textAlign: 'left', display: 'block' }}>Username</Form.Label>
                                <Form.Control
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ minWidth: 90, textAlign: 'left', display: 'block' }}>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ minWidth: 90, textAlign: 'left', display: 'block' }}>Repeat Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex flex-column align-items-center gap-2 mt-4 w-100">
                                <Button type="submit" variant="primary" className="w-100">
                                    Register
                                </Button>
                                <Button
                                    variant="link"
                                    onClick={() => navigate('/login')}
                                    className="p-0"
                                >
                                    Already have an account? Login
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;