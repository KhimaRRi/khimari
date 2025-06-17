import React, { useState } from 'react';

function RolesTab({ roles, permissions, rolePermissions, onAddRole, onEditRole, onDeleteRole, onUpdateRolePermissions }) {
    const [newRole, setNewRole] = useState({ name: '' });
    const [editingRole, setEditingRole] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newRole.name) {
            onAddRole(newRole);
            setNewRole({ name: '' });
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (editingRole.name) {
            onEditRole(editingRole.id, editingRole);
            setEditingRole(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingRole(null);
    };

    const handlePermissionChange = (permissionId) => {
        if (!selectedRole) return;

        const currentPermissions = rolePermissions[selectedRole.id] || [];
        const newPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter(id => id !== permissionId)
            : [...currentPermissions, permissionId];

        onUpdateRolePermissions(selectedRole.id, newPermissions);
    };

    return (
        <div>
            <h2>Управление ролями</h2>
            
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Название роли"
                            value={newRole.name}
                            onChange={(e) => setNewRole({ name: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">
                            Добавить
                        </button>
                    </div>
                </div>
            </form>

            <div className="row">
                <div className="col-md-6">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map(role => (
                                    <tr key={role.id}>
                                        {editingRole && editingRole.id === role.id ? (
                                            <>
                                                <td>{role.id}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editingRole.name}
                                                        onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={handleSaveEdit}
                                                        >
                                                            Сохранить
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Отмена
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{role.id}</td>
                                                <td>{role.name}</td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleEdit(role)}
                                                        >
                                                            Редактировать
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => onDeleteRole(role.id)}
                                                        >
                                                            Удалить
                                                        </button>
                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() => setSelectedRole(role)}
                                                        >
                                                            Права доступа
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-6">
                    {selectedRole && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title h5 mb-0">
                                    Права доступа для роли: {selectedRole.name}
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className="list-group">
                                    {permissions.map(permission => (
                                        <label
                                            key={permission.id}
                                            className="list-group-item list-group-item-action"
                                        >
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={(rolePermissions[selectedRole.id] || []).includes(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                />
                                                <span className="form-check-label">
                                                    {permission.name} - {permission.description}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RolesTab; 