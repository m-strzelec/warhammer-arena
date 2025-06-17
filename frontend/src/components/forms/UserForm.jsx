import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { useToast } from '../../contexts/ToastContext';

const UserForm = ({ initialUserData, onSave, onCancel }) => {
	const [user, setUser] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});
	const { showToast } = useToast();

	useEffect(() => {
		if (initialUserData) {
			setUser(prev => ({
				...prev,
				username: initialUserData.username,
				password: '',
				confirmPassword: ''
			}));
		} else {
			setUser({ username: '', password: '', confirmPassword: '' });
		}
	}, [initialUserData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (user.password !== user.confirmPassword) {
			showToast('warn', 'Warning', 'Passwords do not match');
			return;
		}
		const dataToSave = {
			username: user.username,
		};
		if (user.password) {
			dataToSave.password = user.password;
		}
		try {
			await onSave(dataToSave);
		} catch (error) {
			showToast('error', 'Error', error.response.data?.message);
			console.error(error.response.data?.error || error.response.data.message);
		}
	};

	return (
		<Container>
			<Row className="justify-content-center">
				<Col md={10}>
					<form onSubmit={handleSubmit}>
						<div className="p-field mb-3">
							<label htmlFor="username" className="me-2 mb-0">Username</label>
							<InputText
								id="username"
								name="username"
								placeholder="Username"
								value={user.username}
								onChange={handleChange}
								className="w-100"
								required
							/>
						</div>
						<div className="p-field mb-3">
							<label htmlFor="password" className="me-2 mb-0">New Password (optional)</label>
							<InputText
								id="password"
								name="password"
								type="password"
								placeholder="Leave blank to keep current password"
								value={user.password}
								onChange={handleChange}
								className="w-100"
							/>
						</div>
						<div className="p-field mb-3">
							<label htmlFor="confirmPassword" className="me-2 mb-0">Confirm New Password</label>
							<InputText
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Confirm new password"
								value={user.confirmPassword}
								onChange={handleChange}
								className="w-100"
								required={!!user.password}
							/>
						</div>
						<div className="d-flex justify-content-end gap-2 mt-4">
							<Button variant="secondary" onClick={onCancel}>
								Cancel
							</Button>
							<Button variant="primary" type="submit">
								Save Changes
							</Button>
						</div>
					</form>
				</Col>
			</Row>
		</Container>
	);
};

export default UserForm;