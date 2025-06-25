// UsersTab
function UsersTab({ roles, permissions, positionRoleMap, positionList, rolePermissions, onAddUser, users, onDeleteUser, setUsers, onEditUser }) {
    const [newUser, setNewUser] = useState({ name: '', positionId: '' });
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [alert, setAlert] = useState(null);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        if (window.initialUsers && users.length === 0) {
            setUsers(window.initialUsers);
        }
    }, []);

    useEffect(() => {
        if (newUser.positionId) {
            const rolesForPosition = positionRoleMap[newUser.positionId] || [];
            setSelectedRoles(rolesForPosition);
            let perms = new Set();
            rolesForPosition.forEach(roleId => {
                (rolePermissions[roleId] || []).forEach(permId => perms.add(permId));
            });
            setSelectedPermissions(Array.from(perms));
        } else {
            setSelectedRoles([]);
            setSelectedPermissions([]);
        }
    }, [newUser.positionId, positionRoleMap, rolePermissions]);

    const handleChange = e => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!newUser.name || !newUser.positionId) {
            setAlert({ type: 'danger', msg: 'Заполните все поля' });
            return;
        }
        const userToAdd = {
            id: users.length + 1,
            ...newUser,
            positionId: Number(newUser.positionId),
            roles: selectedRoles,
            permissions: selectedPermissions
        };
        onAddUser(userToAdd);
        setNewUser({ name: '', positionId: '' });
        setSelectedRoles([]);
        setSelectedPermissions([]);
        setAlert({ type: 'success', msg: 'Пользователь добавлен' });
    };

    const handleEdit = (idx) => {
        setEditingIdx(idx);
        const user = users[idx];
        setEditUser({
            ...user,
            positionId: user.positionId || '',
            roles: user.roles ? [...user.roles] : [],
            permissions: user.permissions ? [...user.permissions] : []
        });
    };

    const handleSaveEdit = () => {
        if (!editUser.name || !editUser.positionId) {
            setAlert({ type: 'danger', msg: 'Заполните все поля' });
            return;
        }
        const updatedUser = {
            ...editUser,
            positionId: Number(editUser.positionId)
        };
        onEditUser(updatedUser.id, updatedUser);
        setEditingIdx(null);
        setEditUser(null);
        setAlert({ type: 'success', msg: 'Пользователь обновлен' });
    };

    const handleCancelEdit = () => {
        setEditingIdx(null);
        setEditUser(null);
    };

    const handleEditChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
        if (e.target.name === 'positionId') {
            const rolesForPosition = positionRoleMap[e.target.value] || [];
            let perms = new Set();
            rolesForPosition.forEach(roleId => {
                (rolePermissions[roleId] || []).forEach(permId => perms.add(permId));
            });
            setEditUser(prev => ({
                ...prev,
                roles: rolesForPosition,
                permissions: Array.from(perms)
            }));
        }
    };

    const handleDelete = (userId) => {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            onDeleteUser(userId);
            setAlert({ type: 'success', msg: 'Пользователь удален' });
        }
    };

    return (
        <div className="container-fluid px-2">
            {alert && (
                <div className={`alert alert-${alert.type} py-2 mb-2`} role="alert">
                    {alert.msg}
                </div>
            )}
            <div className="card mb-3">
                <div className="card-body p-3">
                    <form onSubmit={handleSubmit} className="row g-2">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                name="name"
                                placeholder="Имя пользователя"
                                value={newUser.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select form-select-sm"
                                name="positionId"
                                value={newUser.positionId}
                                onChange={handleChange}
                            >
                                <option value="">Выберите должность</option>
                                {positionList.map(pos => (
                                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary btn-sm w-100" type="submit">Добавить</button>
                        </div>
                    </form>
                    {selectedRoles.length > 0 && (
                        <div className="mt-2 small">
                            <div className="text-muted">Роли: {selectedRoles.map(roleId => {
                                const role = roles.find(r => r.id === roleId);
                                return role ? role.name : '';
                            }).filter(Boolean).join(', ')}</div>
                        </div>
                    )}
                </div>
            </div>

            {users.map((user, idx) => {
                const position = positionList.find(p => p.id === user.positionId);
                if (editingIdx === idx && editUser) {
                    return (
                        <div key={idx} className="card mb-2">
                            <div className="card-body p-3">
                                <div className="row g-2">
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            name="name"
                                            value={editUser.name}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <select
                                            className="form-select form-select-sm"
                                            name="positionId"
                                            value={editUser.positionId}
                                            onChange={handleEditChange}
                                        >
                                            <option value="">Выберите должность</option>
                                            {positionList.map(pos => (
                                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="btn-group w-100">
                                            <button className="btn btn-success btn-sm" onClick={handleSaveEdit}>Сохранить</button>
                                            <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Отмена</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 small">
                                    <div className="text-muted">Роли: {editUser.roles.map(roleId => {
                                        const role = roles.find(r => r.id === roleId);
                                        return role ? role.name : '';
                                    }).filter(Boolean).join(', ')}</div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div key={idx} className="card mb-2">
                        <div className="card-body p-3">
                            <div className="row align-items-center">
                                <div className="col-md-4">
                                    <div className="fw-bold">{user.name}</div>
                                    <div className="text-muted small">{position ? position.name : ''}</div>
                                </div>
                                <div className="col-md-4">
                                    <div className="small">
                                        <div>Роли: {user.roles.map(roleId => {
                                            const role = roles.find(r => r.id === roleId);
                                            return role ? role.name : '';
                                        }).filter(Boolean).join(', ')}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="btn-group w-100">
                                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(idx)}>Редактировать</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Удалить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// RolesTab
function RolesTab({ roles, setRoles, permissions, setPermissions, resources, setResources, positionList, setPositionList }) {
    // Роли
    const [newRole, setNewRole] = useState('');
    // Полномочия
    const [newPerm, setNewPerm] = useState({ name: '', desc: '' });
    // Ресурсы
    const [newRes, setNewRes] = useState({ name: '', desc: '' });
    // Должности
    const [newPosition, setNewPosition] = useState('');

    // Добавление
    const addRole = e => {
        e.preventDefault();
        if (!newRole.trim()) return;
        setRoles(prev => [...prev, { id: prev.length + 1, name: newRole.trim() }]);
        setNewRole('');
    };
    const addPerm = e => {
        e.preventDefault();
        if (!newPerm.name.trim()) return;
        setPermissions(prev => [...prev, { id: prev.length + 1, name: newPerm.name.trim(), description: newPerm.desc.trim() }]);
        setNewPerm({ name: '', desc: '' });
    };
    const addRes = e => {
        e.preventDefault();
        if (!newRes.name.trim()) return;
        setResources(prev => [...prev, { id: prev.length + 1, name: newRes.name.trim(), description: newRes.desc.trim() }]);
        setNewRes({ name: '', desc: '' });
    };
    const addPosition = e => {
        e.preventDefault();
        if (!newPosition.trim()) return;
        setPositionList(prev => [...prev, { id: prev.length + 1, name: newPosition.trim() }]);
        setNewPosition('');
    };

    // Удаление
    const delRole = id => setRoles(prev => prev.filter(r => r.id !== id));
    const delPerm = id => setPermissions(prev => prev.filter(p => p.id !== id));
    const delRes = id => setResources(prev => prev.filter(r => r.id !== id));
    const delPosition = id => setPositionList(prev => prev.filter(p => p.id !== id));

    return (
        <div>
            {/* Управление должностями */}
            <div className="roles-section">
                <h6>Управление должностями</h6>
                <form className="d-flex roles-form" onSubmit={addPosition}>
                    <input className="form-control" placeholder="Название должности" value={newPosition} onChange={e => setNewPosition(e.target.value)} />
                    <button className="btn btn-success" type="submit">Добавить</button>
                </form>
                <ol className="roles-list">
                    {positionList.map((pos, idx) => (
                        <li key={pos.id}>
                            <span>{pos.name}</span>
                            <button className="btn btn-danger btn-sm btn-del" onClick={() => delPosition(pos.id)}>Удалить</button>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Управление ролями */}
            <div className="roles-section">
                <h6>Управление ролями</h6>
                <form className="d-flex roles-form" onSubmit={addRole}>
                    <input className="form-control" placeholder="Название новой роли" value={newRole} onChange={e => setNewRole(e.target.value)} />
                    <button className="btn btn-success" type="submit">Добавить</button>
                </form>
                <ol className="roles-list">
                    {roles.map((role, idx) => (
                        <li key={role.id}>
                            <span>{role.name}</span>
                            <button className="btn btn-danger btn-sm btn-del" onClick={() => delRole(role.id)}>Удалить</button>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Управление полномочиями */}
            <div className="roles-section">
                <h6>Управление полномочиями</h6>
                <form className="d-flex perms-form" onSubmit={addPerm}>
                    <input className="form-control" placeholder="Название полномочия" value={newPerm.name} onChange={e => setNewPerm({ ...newPerm, name: e.target.value })} />
                    <input className="form-control" placeholder="Описание полномочия" value={newPerm.desc} onChange={e => setNewPerm({ ...newPerm, desc: e.target.value })} />
                    <button className="btn btn-success" type="submit">Добавить</button>
                </form>
                <ol className="perms-list">
                    {permissions.map((perm, idx) => (
                        <li key={perm.id}>
                            <span>{perm.name}{perm.description ? ' — ' + perm.description : ''}</span>
                            <button className="btn btn-danger btn-sm btn-del" onClick={() => delPerm(perm.id)}>Удалить</button>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Управление ресурсами */}
            <div className="roles-section">
                <h6>Управление ресурсами</h6>
                <form className="d-flex resources-form" onSubmit={addRes}>
                    <input className="form-control" placeholder="Название ресурса" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} />
                    <input className="form-control" placeholder="Описание ресурса" value={newRes.desc} onChange={e => setNewRes({ ...newRes, desc: e.target.value })} />
                    <button className="btn btn-success" type="submit">Добавить</button>
                </form>
                <ol className="resources-list">
                    {resources.map((res, idx) => (
                        <li key={res.id}>
                            <span>{res.name}{res.description ? ' — ' + res.description : ''}</span>
                            <button className="btn btn-danger btn-sm btn-del" onClick={() => delRes(res.id)}>Удалить</button>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

// ResourcesTab
function ResourcesTab({ resources, onAddResource, onEditResource, onDeleteResource }) {
    const [newResource, setNewResource] = useState({ name: '', description: '' });
    const [editingResource, setEditingResource] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newResource.name && newResource.description) {
            onAddResource(newResource);
            setNewResource({ name: '', description: '' });
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (editingResource.name && editingResource.description) {
            onEditResource(editingResource.id, editingResource);
            setEditingResource(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingResource(null);
    };

    return (
        <div>
            <h2>Управление ресурсами</h2>
            
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Название ресурса"
                            value={newResource.name}
                            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                        />
                    </div>
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Описание ресурса"
                            value={newResource.description}
                            onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">
                            Добавить
                        </button>
                    </div>
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map(resource => (
                            <tr key={resource.id}>
                                {editingResource && editingResource.id === resource.id ? (
                                    <>
                                        <td>{resource.id}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingResource.name}
                                                onChange={(e) => setEditingResource({ ...editingResource, name: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingResource.description}
                                                onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
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
                                        <td>{resource.id}</td>
                                        <td>{resource.name}</td>
                                        <td>{resource.description}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleEdit(resource)}
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => onDeleteResource(resource.id)}
                                                >
                                                    Удалить
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
    );
}

// ConflictMatrixTab
function ConflictMatrixTab({ roles, roleConflictMatrix, onToggleConflict, onSaveConflicts }) {
    const [localConflictMatrix, setLocalConflictMatrix] = useState(JSON.parse(JSON.stringify(roleConflictMatrix)));
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // Роли отсортированы по id для корректного отображения
    const sortedRoles = [...roles].sort((a, b) => a.id - b.id);

    // Отслеживаем изменения
    useEffect(() => {
        const changed = JSON.stringify(localConflictMatrix) !== JSON.stringify(roleConflictMatrix);
        setHasChanges(changed);
    }, [localConflictMatrix, roleConflictMatrix]);

    const handleToggleConflict = (roleId1, roleId2) => {
        const newMatrix = JSON.parse(JSON.stringify(localConflictMatrix));
        const currentValue = newMatrix[roleId1]?.[roleId2];
        const newValue = currentValue === '+' ? '-' : '+';
        
        if (!newMatrix[roleId1]) newMatrix[roleId1] = {};
        if (!newMatrix[roleId2]) newMatrix[roleId2] = {};
        
        newMatrix[roleId1][roleId2] = newValue;
        newMatrix[roleId2][roleId1] = newValue;
        
        setLocalConflictMatrix(newMatrix);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Вызываем обработчик для сохранения
            onSaveConflicts(localConflictMatrix);
            setHasChanges(false);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setLocalConflictMatrix(JSON.parse(JSON.stringify(roleConflictMatrix)));
        setHasChanges(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Матрица конфликтов ролей (SoD)</h4>
                <div className="btn-group">
                    {hasChanges && (
                        <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleReset}
                            title="Отменить изменения"
                        >
                            <i className="bi bi-arrow-clockwise"></i> Отменить
                        </button>
                    )}
                    <button 
                        className={`btn btn-sm ${hasChanges ? 'btn-success' : 'btn-secondary'}`}
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                    >
                        {saving ? (
                            <>
                                <i className="bi bi-hourglass-split"></i> Сохранение...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i> Сохранить
                            </>
                        )}
                    </button>
                </div>
            </div>

            {hasChanges && (
                <div className="alert alert-warning py-2 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    У вас есть несохраненные изменения. Нажмите "Сохранить" для применения изменений.
                </div>
            )}

            <div className="table-responsive">
                <table className="table conflicts-matrix-table table-bordered text-center align-middle mt-3">
                    <thead>
                        <tr>
                            <th style={{ minWidth: 180 }}>Роль / (код роли)</th>
                            {sortedRoles.map(role => (
                                <th key={role.id}>{role.name} <span className="text-secondary">({role.id})</span></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRoles.map(rowRole => (
                            <tr key={rowRole.id}>
                                <th className="text-start bg-light">{rowRole.name} <span className="text-secondary">({rowRole.id})</span></th>
                                {sortedRoles.map(colRole => {
                                    if (rowRole.id === colRole.id) {
                                        return <td key={colRole.id} style={{ background: '#f8f9fa' }}></td>;
                                    }
                                    const conflict =
                                        localConflictMatrix[rowRole.id] &&
                                        localConflictMatrix[rowRole.id][colRole.id] === '+';
                                    return (
                                        <td
                                            key={colRole.id}
                                            style={{ cursor: 'pointer', background: conflict ? '#f8d7da' : undefined }}
                                            onClick={() => handleToggleConflict(rowRole.id, colRole.id)}
                                            title={conflict ? 'Конфликт ролей' : 'Нет конфликта'}
                                        >
                                            {conflict ? <span style={{ color: '#dc3545', fontSize: 22 }}>&times;</span> : ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '0.95em' }}>
                Кликните на ячейку, чтобы добавить или убрать конфликт между ролями. Конфликт отмечен знаком × и красным цветом.
            </div>
        </div>
    );
}

// AccessCheckTab
function AccessCheckTab({ users, resources, permissions, roles, rolePermissions, roleConflictMatrix }) {
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedResource, setSelectedResource] = useState('');
    const [selectedPermission, setSelectedPermission] = useState('');
    const [result, setResult] = useState(null);

    const checkAccess = () => {
        if (!selectedUser || !selectedResource || !selectedPermission) {
            setResult({
                success: false,
                message: 'Пожалуйста, выберите пользователя, ресурс и разрешение'
            });
            return;
        }

        const user = users.find(u => u.id === selectedUser);
        const resource = resources.find(r => r.id === selectedResource);
        const permission = permissions.find(p => p.id === selectedPermission);
        const userRole = roles.find(r => r.id === user.roleId);

        if (!userRole) {
            setResult({
                success: false,
                message: 'У пользователя не назначена роль'
            });
            return;
        }

        // Проверяем наличие разрешения у роли
        const rolePerms = rolePermissions[userRole.id] || [];
        if (!rolePerms.includes(permission.id)) {
            setResult({
                success: false,
                message: `Роль "${userRole.name}" не имеет разрешения "${permission.name}"`
            });
            return;
        }

        // Проверяем конфликты ролей
        const otherUsers = users.filter(u => u.id !== user.id);
        for (const otherUser of otherUsers) {
            const otherRole = roles.find(r => r.id === otherUser.roleId);
            if (!otherRole) continue;

            const conflict = roleConflictMatrix[userRole.id]?.[otherRole.id];
            if (conflict === 'conflict') {
                setResult({
                    success: false,
                    message: `Конфликт ролей: "${userRole.name}" и "${otherRole.name}" не могут быть назначены одному пользователю`
                });
                return;
            }
        }

        setResult({
            success: true,
            message: `Доступ разрешен: пользователь "${user.name}" с ролью "${userRole.name}" имеет разрешение "${permission.name}" для ресурса "${resource.name}"`
        });
    };

    return (
        <div>
            <h2>Проверка доступа</h2>
            
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Выберите пользователя</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={selectedResource}
                        onChange={(e) => setSelectedResource(e.target.value)}
                    >
                        <option value="">Выберите ресурс</option>
                        {resources.map(resource => (
                            <option key={resource.id} value={resource.id}>
                                {resource.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={selectedPermission}
                        onChange={(e) => setSelectedPermission(e.target.value)}
                    >
                        <option value="">Выберите разрешение</option>
                        {permissions.map(permission => (
                            <option key={permission.id} value={permission.id}>
                                {permission.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                className="btn btn-primary mb-4"
                onClick={checkAccess}
            >
                Проверить доступ
            </button>

            {result && (
                <div className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
}

function AccountsTab() {
    const [accounts, setAccounts] = useState(window.initialAccounts || []);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loginFilter, setLoginFilter] = useState('all');
    const [selected, setSelected] = useState([]);

    // Фильтрация по поиску, статусу и последнему входу
    const filtered = accounts.filter(acc => {
        const matchesSearch =
            acc.username.toLowerCase().includes(search.toLowerCase()) ||
            acc.owner.toLowerCase().includes(search.toLowerCase()) ||
            acc.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? acc.status === 'active' : acc.status === 'blocked');
        // Для примера фильтр по последнему входу не реализован полностью
        return matchesSearch && matchesStatus;
    });

    // Чекбокс для выбора всех
    const allChecked = filtered.length > 0 && filtered.every(acc => selected.includes(acc.username));
    const toggleAll = () => {
        if (allChecked) setSelected([]);
        else setSelected(filtered.map(acc => acc.username));
    };
    const toggleOne = username => {
        setSelected(prev => prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]);
    };

    // Блокировка/разблокировка выбранных
    const handleBlock = () => {
        setAccounts(prev => prev.map(acc =>
            selected.includes(acc.username)
                ? { ...acc, status: acc.status === 'active' ? 'blocked' : 'active' }
                : acc
        ));
        setSelected([]);
    };

    // Определяем, что делать с кнопкой
    const hasSelected = selected.length > 0;
    const allBlocked = filtered.filter(acc => selected.includes(acc.username)).every(acc => acc.status === 'blocked');
    const btnLabel = allBlocked ? 'Разблокировать' : 'Заблокировать';
    const btnClass = allBlocked ? 'btn btn-success' : 'btn btn-danger';

    return (
        <div>
            <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: 220 }}
                    placeholder="Поиск учетной записи"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="form-select"
                    style={{ maxWidth: 180 }}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">Статус владельца</option>
                    <option value="active">Активен</option>
                    <option value="blocked">Заблокирован</option>
                </select>
                <select
                    className="form-select"
                    style={{ maxWidth: 180 }}
                    value={loginFilter}
                    onChange={e => setLoginFilter(e.target.value)}
                >
                    <option value="all">Последний вход</option>
                    <option value="day">Больше дня</option>
                    <option value="week">Меньше недели</option>
                    <option value="month">Меньше месяца</option>
                </select>
                <button className={btnClass + ' ms-auto'} disabled={!hasSelected} onClick={handleBlock}>{btnLabel}</button>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
                            <th>Учетная запись</th>
                            <th>Владелец / Роль</th>
                            <th>Email</th>
                            <th>Статус</th>
                            <th>Назначенные полномочия</th>
                            <th>Последний вход</th>
                            <th>Создан</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((acc, idx) => (
                            <tr key={idx}>
                                <td><input type="checkbox" checked={selected.includes(acc.username)} onChange={() => toggleOne(acc.username)} /></td>
                                <td><a href="#">{acc.username}@example.com</a></td>
                                <td>
                                    {acc.owner}<br/>
                                    <span className="text-secondary">({acc.roles.join(', ')})</span>
                                </td>
                                <td>{acc.email}</td>
                                <td>
                                    <span className={acc.status === 'active' ? 'text-success' : 'text-danger'}>
                                        {acc.status === 'active' ? 'Активен' : 'Заблокирован'}
                                    </span>
                                </td>
                                <td>{acc.permissions.join(', ')}</td>
                                <td>{acc.lastLogin}</td>
                                <td>{acc.created}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PermissionsMatrixTab({ roles, permissions, rolePermissions, onToggleRolePermission, onSavePermissions }) {
    const [localRolePermissions, setLocalRolePermissions] = useState({ ...rolePermissions });
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // Отслеживаем изменения
    useEffect(() => {
        const changed = JSON.stringify(localRolePermissions) !== JSON.stringify(rolePermissions);
        setHasChanges(changed);
    }, [localRolePermissions, rolePermissions]);

    const handleTogglePermission = (roleId, permissionId) => {
        const newRolePermissions = { ...localRolePermissions };
        if (newRolePermissions[roleId] && newRolePermissions[roleId].includes(permissionId)) {
            newRolePermissions[roleId] = newRolePermissions[roleId].filter(id => id !== permissionId);
        } else {
            newRolePermissions[roleId] = [...(newRolePermissions[roleId] || []), permissionId];
        }
        setLocalRolePermissions(newRolePermissions);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Вызываем обработчик для сохранения
            onSavePermissions(localRolePermissions);
            setHasChanges(false);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setLocalRolePermissions({ ...rolePermissions });
        setHasChanges(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Матрица полномочий ролей</h4>
                <div className="btn-group">
                    {hasChanges && (
                        <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleReset}
                            title="Отменить изменения"
                        >
                            <i className="bi bi-arrow-clockwise"></i> Отменить
                        </button>
                    )}
                    <button 
                        className={`btn btn-sm ${hasChanges ? 'btn-success' : 'btn-secondary'}`}
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                    >
                        {saving ? (
                            <>
                                <i className="bi bi-hourglass-split"></i> Сохранение...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i> Сохранить
                            </>
                        )}
                    </button>
                </div>
            </div>

            {hasChanges && (
                <div className="alert alert-warning py-2 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    У вас есть несохраненные изменения. Нажмите "Сохранить" для применения изменений.
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th>Роль</th>
                            {permissions.map(permission => (
                                <th key={permission.id}>{permission.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id}>
                                <th className="text-start">{role.name}</th>
                                {permissions.map(permission => {
                                    const hasPermission = localRolePermissions[role.id] && 
                                                        localRolePermissions[role.id].includes(permission.id);
                                    return (
                                        <td 
                                            key={permission.id}
                                            style={{ 
                                                cursor: 'pointer',
                                                backgroundColor: hasPermission ? '#d1e7dd' : 'transparent'
                                            }}
                                            onClick={() => handleTogglePermission(role.id, permission.id)}
                                            title={hasPermission ? 'Убрать полномочие' : 'Добавить полномочие'}
                                        >
                                            {hasPermission ? 
                                                <span style={{ color: '#198754', fontSize: 18 }}>&#10003;</span> : 
                                                ''
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-3">
                <div className="text-success">
                    <span style={{ color: '#198754', fontSize: 18 }}>&#10003;</span> Полномочие назначено
                </div>
            </div>
        </div>
    );
}

// Пример должностей (можно вынести в глобальные window.initialPositions)
const defaultPositions = [
    { id: 1, name: 'Директор Департамента' },
    { id: 2, name: 'Заместитель начальника управления' },
    { id: 3, name: 'Менеджер' },
    { id: 4, name: 'Главный специалист' },
    { id: 5, name: 'Начальник отдела' }
];

function PositionRoleMatrixTab({ roles, roleConflictMatrix, onSavePositionRoles }) {
    const [positions, setPositions] = useState(window.initialPositions || defaultPositions);
    const [localPositionRoles, setLocalPositionRoles] = useState({
        1: [1, 2, 3],
        2: [2, 3],
        3: [2],
        4: [3],
        5: [7, 8]
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    const sortedRoles = [...roles].sort((a, b) => a.id - b.id);

    // Отслеживаем изменения
    useEffect(() => {
        const changed = JSON.stringify(localPositionRoles) !== JSON.stringify({
            1: [1, 2, 3],
            2: [2, 3],
            3: [2],
            4: [3],
            5: [7, 8]
        });
        setHasChanges(changed);
    }, [localPositionRoles]);

    // Проверка на конфликт ролей по SoD для данной должности
    function hasConflict(selectedRoles, roleId) {
        for (let r of selectedRoles) {
            if (roleConflictMatrix[r] && roleConflictMatrix[r][roleId] === '+') {
                return true;
            }
        }
        return false;
    }

    const handleToggleRole = (positionId, roleId) => {
        setLocalPositionRoles(prev => {
            const current = prev[positionId] || [];
            if (current.includes(roleId)) {
                return { ...prev, [positionId]: current.filter(id => id !== roleId) };
            } else {
                // Проверка на конфликт
                if (hasConflict(current, roleId)) return prev;
                return { ...prev, [positionId]: [...current, roleId] };
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Вызываем обработчик для сохранения
            onSavePositionRoles(localPositionRoles);
            setHasChanges(false);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setLocalPositionRoles({
            1: [1, 2, 3],
            2: [2, 3],
            3: [2],
            4: [3],
            5: [7, 8]
        });
        setHasChanges(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Матрица соответствия должностей и ролей</h4>
                <div className="btn-group">
                    {hasChanges && (
                        <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleReset}
                            title="Отменить изменения"
                        >
                            <i className="bi bi-arrow-clockwise"></i> Отменить
                        </button>
                    )}
                    <button 
                        className={`btn btn-sm ${hasChanges ? 'btn-success' : 'btn-secondary'}`}
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                    >
                        {saving ? (
                            <>
                                <i className="bi bi-hourglass-split"></i> Сохранение...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i> Сохранить
                            </>
                        )}
                    </button>
                </div>
            </div>

            {hasChanges && (
                <div className="alert alert-warning py-2 mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    У вас есть несохраненные изменения. Нажмите "Сохранить" для применения изменений.
                </div>
            )}

            <div className="table-responsive">
                <table className="table positions-matrix-table table-bordered text-center align-middle mt-3">
                    <thead>
                        <tr>
                            <th style={{ minWidth: 180 }}>Должность/Роль</th>
                            {sortedRoles.map(role => (
                                <th key={role.id}>{role.name} <span className="text-secondary">({role.id})</span></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map(pos => {
                            const assignedRoles = localPositionRoles[pos.id] || [];
                            return (
                                <tr key={pos.id}>
                                    <th className="text-start bg-light">{pos.name}</th>
                                    {sortedRoles.map(role => {
                                        const isAssigned = assignedRoles.includes(role.id);
                                        const isConflict = !isAssigned && hasConflict(assignedRoles, role.id);
                                        return (
                                            <td
                                                key={role.id}
                                                style={{ cursor: isConflict ? 'not-allowed' : 'pointer', background: isAssigned ? '#d1e7dd' : isConflict ? '#f8d7da' : undefined }}
                                                onClick={() => !isConflict && handleToggleRole(pos.id, role.id)}
                                                title={isConflict ? 'Конфликт ролей по SoD' : isAssigned ? 'Роль назначена' : 'Назначить роль'}
                                            >
                                                {isAssigned ? <span style={{ color: '#198754', fontSize: 22 }}>&#10003;</span> : isConflict ? <span style={{ color: '#dc3545', fontSize: 22 }}>&#10007;</span> : ''}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="text-danger mt-2" style={{ fontSize: '0.95em' }}>
                <span style={{ color: '#dc3545', fontSize: 18, verticalAlign: 'middle' }}>&#10007;</span> Конфликт ролей по SoD
            </div>
        </div>
    );
}

// Компонент заголовка с информацией о пользователе
function UserHeader({ currentUser, onLogout }) {
    return (
        <div className="user-header">
            <div className="d-flex align-items-center">
                <span className="me-3">
                    <i className="bi bi-person-circle"></i>
                    {currentUser ? currentUser.name : 'Гость'}
                </span>
                <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={onLogout}
                >
                    <i className="bi bi-box-arrow-right"></i> Выход
                </button>
            </div>
        </div>
    );
}

// Компонент авторизации
function AuthTab({ onLogin }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Введите логин и пароль');
            return;
        }
        // Здесь можно добавить реальную проверку
        onLogin({ username });
        setUsername('');
        setPassword('');
        setError('');
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Авторизация</h2>
                {error && <div className="auth-error">{error}</div>}
                <div className="mb-3">
                    <label className="form-label">Логин</label>
                    <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Пароль</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Войти</button>
            </form>
        </div>
    );
}

// Компонент для отображения аккаунта в правом верхнем углу
function AccountHeader({ currentUser, onLogout }) {
    return (
        <div className="ms-auto">
            <div className="d-flex align-items-center">
                <span className="me-3">
                    <i className="bi bi-person-circle"></i>
                    {currentUser ? currentUser.username : 'Гость'}
                </span>
                <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={onLogout}
                >
                    <i className="bi bi-box-arrow-right"></i> Выход
                </button>
            </div>
        </div>
    );
}

// Компонент истории событий
function EventHistoryTab({ events, onClearHistory }) {
    const [filterType, setFilterType] = useState('all');
    const [filterUser, setFilterUser] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Фильтрация событий
    const filteredEvents = events.filter(event => {
        const matchesType = filterType === 'all' || event.type === filterType;
        const matchesUser = filterUser === 'all' || event.user === filterUser;
        const matchesSearch = !searchTerm || 
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.user.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesType && matchesUser && matchesSearch;
    });

    const getEventIcon = (type) => {
        switch (type) {
            case 'user_add': return 'bi-person-plus';
            case 'user_edit': return 'bi-person-gear';
            case 'user_delete': return 'bi-person-x';
            case 'role_add': return 'bi-shield-plus';
            case 'role_edit': return 'bi-shield-gear';
            case 'role_delete': return 'bi-shield-x';
            case 'permission_change': return 'bi-key';
            case 'login': return 'bi-box-arrow-in-right';
            case 'logout': return 'bi-box-arrow-left';
            default: return 'bi-info-circle';
        }
    };

    const getEventColor = (type) => {
        switch (type) {
            case 'user_add':
            case 'role_add':
            case 'login': return 'success';
            case 'user_edit':
            case 'role_edit':
            case 'permission_change': return 'warning';
            case 'user_delete':
            case 'role_delete':
            case 'logout': return 'danger';
            default: return 'info';
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('ru-RU');
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>История событий</h4>
                <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={onClearHistory}
                    title="Очистить историю"
                >
                    <i className="bi bi-trash"></i> Очистить
                </button>
            </div>

            {/* Фильтры */}
            <div className="card mb-3">
                <div className="card-body p-3">
                    <div className="row g-2">
                        <div className="col-md-3">
                            <select 
                                className="form-select form-select-sm"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">Все типы событий</option>
                                <option value="user_add">Добавление пользователя</option>
                                <option value="user_edit">Редактирование пользователя</option>
                                <option value="user_delete">Удаление пользователя</option>
                                <option value="role_add">Добавление роли</option>
                                <option value="role_edit">Редактирование роли</option>
                                <option value="role_delete">Удаление роли</option>
                                <option value="permission_change">Изменение полномочий</option>
                                <option value="login">Вход в систему</option>
                                <option value="logout">Выход из системы</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select form-select-sm"
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value)}
                            >
                                <option value="all">Все пользователи</option>
                                {Array.from(new Set(events.map(e => e.user))).map(user => (
                                    <option key={user} value={user}>{user}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Поиск по описанию или пользователю..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Список событий */}
            <div className="event-history-list">
                {filteredEvents.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        <i className="bi bi-clock-history" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2">История событий пуста</p>
                    </div>
                ) : (
                    filteredEvents.map((event, index) => (
                        <div key={index} className={`alert alert-${getEventColor(event.type)} alert-dismissible fade show`}>
                            <div className="d-flex align-items-start">
                                <i className={`bi ${getEventIcon(event.type)} me-2 mt-1`}></i>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <strong>{event.description}</strong>
                                            <div className="text-muted small mt-1">
                                                <i className="bi bi-person me-1"></i>
                                                {event.user}
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            {formatDate(event.timestamp)}
                                        </small>
                                    </div>
                                    {event.details && (
                                        <div className="mt-2 small">
                                            <details>
                                                <summary>Детали</summary>
                                                <pre className="mt-1 mb-0" style={{ fontSize: '0.8rem' }}>
                                                    {JSON.stringify(event.details, null, 2)}
                                                </pre>
                                            </details>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Статистика */}
            <div className="card mt-3">
                <div className="card-body p-3">
                    <h6>Статистика</h6>
                    <div className="row text-center">
                        <div className="col-md-3">
                            <div className="text-primary">
                                <strong>{events.length}</strong>
                                <div className="small">Всего событий</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-success">
                                <strong>{events.filter(e => e.type.includes('add')).length}</strong>
                                <div className="small">Добавлений</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-warning">
                                <strong>{events.filter(e => e.type.includes('edit') || e.type === 'permission_change').length}</strong>
                                <div className="small">Изменений</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="text-danger">
                                <strong>{events.filter(e => e.type.includes('delete')).length}</strong>
                                <div className="small">Удалений</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Обновляем компонент App
function App() {
    const [activeTab, setActiveTab] = useState('users');
    const [currentUser, setCurrentUser] = useState({ username: 'A.A.Bok' }); // Устанавливаем пользователя по умолчанию
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState(window.initialRoles || []);
    const [resources, setResources] = useState(window.initialResources || []);
    const [permissions, setPermissions] = useState(window.initialPermissions || []);
    const [rolePermissions, setRolePermissions] = useState(window.initialRolePermissions || {});
    const [roleConflictMatrix, setRoleConflictMatrix] = useState(window.initialRoleConflictMatrix || {});
    const [positionList, setPositionList] = useState(window.initialPositionList || []);
    const [positionRoleMap, setPositionRoleMap] = useState(window.initialPositionRoleMap || {});
    const [events, setEvents] = useState(window.initialEvents || []);

    // Функция для добавления события в историю
    const addEvent = (type, description, details = null) => {
        const event = {
            type,
            description,
            user: currentUser ? currentUser.username : 'Система',
            timestamp: new Date().toISOString(),
            details
        };
        setEvents(prev => [event, ...prev]);
    };

    // Функция для очистки истории
    const clearHistory = () => {
        setEvents([]);
    };

    // Обработчики для пользователей
    const handleAddUser = (user) => {
        setUsers([...users, user]);
        addEvent('user_add', `Добавлен пользователь: ${user.name}`, user);
    };

    const handleEditUser = (userId, userData) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, ...userData } : user
        ));
        addEvent('user_edit', `Отредактирован пользователь: ${userData.name}`, userData);
    };

    const handleDeleteUser = (userId) => {
        const userToDelete = users.find(u => u.id === userId);
        setUsers(users.filter(user => user.id !== userId));
        addEvent('user_delete', `Удален пользователь: ${userToDelete?.name || 'Неизвестный'}`, userToDelete);
    };

    // Обработчики для ролей
    const handleAddRole = (roleData) => {
        const newRole = {
            id: roles.length + 1,
            ...roleData
        };
        setRoles([...roles, newRole]);
        addEvent('role_add', `Добавлена роль: ${roleData.name}`, newRole);
    };

    const handleEditRole = (roleId, roleData) => {
        setRoles(roles.map(role => 
            role.id === roleId ? { ...role, ...roleData } : role
        ));
        addEvent('role_edit', `Отредактирована роль: ${roleData.name}`, roleData);
    };

    const handleDeleteRole = (roleId) => {
        const roleToDelete = roles.find(r => r.id === roleId);
        setRoles(roles.filter(role => role.id !== roleId));
        const newRolePermissions = { ...rolePermissions };
        delete newRolePermissions[roleId];
        setRolePermissions(newRolePermissions);
        const newRoleConflictMatrix = { ...roleConflictMatrix };
        delete newRoleConflictMatrix[roleId];
        Object.keys(newRoleConflictMatrix).forEach(key => {
            delete newRoleConflictMatrix[key][roleId];
        });
        setRoleConflictMatrix(newRoleConflictMatrix);
        addEvent('role_delete', `Удалена роль: ${roleToDelete?.name || 'Неизвестная'}`, roleToDelete);
    };

    // Обработчики для ресурсов
    const handleAddResource = (resourceData) => {
        const newResource = {
            id: resources.length + 1,
            ...resourceData
        };
        setResources([...resources, newResource]);
        addEvent('resource_add', `Добавлен ресурс: ${resourceData.name}`, newResource);
    };

    const handleEditResource = (resourceId, resourceData) => {
        setResources(resources.map(resource => 
            resource.id === resourceId ? { ...resource, ...resourceData } : resource
        ));
        addEvent('resource_edit', `Отредактирован ресурс: ${resourceData.name}`, resourceData);
    };

    const handleDeleteResource = (resourceId) => {
        const resourceToDelete = resources.find(r => r.id === resourceId);
        setResources(resources.filter(resource => resource.id !== resourceId));
        addEvent('resource_delete', `Удален ресурс: ${resourceToDelete?.name || 'Неизвестный'}`, resourceToDelete);
    };

    // Обработчики для разрешений ролей
    const handleToggleRolePermission = (roleId, permissionId) => {
        const role = roles.find(r => r.id === roleId);
        const permission = permissions.find(p => p.id === permissionId);
        const newRolePermissions = { ...rolePermissions };
        if (newRolePermissions[roleId] && newRolePermissions[roleId].includes(permissionId)) {
            newRolePermissions[roleId] = newRolePermissions[roleId].filter(id => id !== permissionId);
            addEvent('permission_remove', `Удалено полномочие "${permission?.name}" у роли "${role?.name}"`, {
                role: role?.name,
                permission: permission?.name
            });
        } else {
            newRolePermissions[roleId] = [...(newRolePermissions[roleId] || []), permissionId];
            addEvent('permission_add', `Добавлено полномочие "${permission?.name}" к роли "${role?.name}"`, {
                role: role?.name,
                permission: permission?.name
            });
        }
        setRolePermissions(newRolePermissions);
    };

    // Обработчики для сохранения изменений матриц
    const handleSavePermissionsMatrix = (newRolePermissions) => {
        setRolePermissions(newRolePermissions);
        addEvent('permissions_matrix_save', 'Сохранены изменения в матрице полномочий', {
            changes: newRolePermissions
        });
    };

    const handleSaveConflictsMatrix = (newConflictMatrix) => {
        setRoleConflictMatrix(newConflictMatrix);
        addEvent('conflicts_matrix_save', 'Сохранены изменения в матрице конфликтов', {
            changes: newConflictMatrix
        });
    };

    const handleSavePositionRolesMatrix = (newPositionRoles) => {
        setPositionRoleMap(newPositionRoles);
        addEvent('position_roles_matrix_save', 'Сохранены изменения в матрице должностей и ролей', {
            changes: newPositionRoles
        });
    };

    // Обработчик для переключения конфликтов (используется в матрице конфликтов)
    const handleToggleConflict = (roleId1, roleId2) => {
        const role1 = roles.find(r => r.id === roleId1);
        const role2 = roles.find(r => r.id === roleId2);
        const newMatrix = { ...roleConflictMatrix };
        const newValue = newMatrix[roleId1][roleId2] === '+' ? '-' : '+';
        newMatrix[roleId1][roleId2] = newValue;
        newMatrix[roleId2][roleId1] = newValue;
        setRoleConflictMatrix(newMatrix);
        addEvent('conflict_toggle', `Изменен конфликт между ролями: ${role1?.name} и ${role2?.name}`, {
            role1: role1?.name,
            role2: role2?.name,
            newValue
        });
    };

    const handleLogin = (user) => {
        setCurrentUser(user);
        setActiveTab('users');
        addEvent('login', `Вход в систему: ${user.username}`, user);
    };
    
    const handleLogout = () => {
        const username = currentUser?.username;
        addEvent('logout', `Выход из системы: ${username}`, { username });
    };
    
    const handleAccountClick = () => {
        console.log('Переход на вкладку аккаунта отключен');
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">Система управления доступом</a>
                            <AccountHeader currentUser={currentUser} onLogout={handleLogout} />
                        </div>
                    </nav>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('users')}>
                                Пользователи
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'accounts' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('accounts')}>
                                Учетные записи
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('roles')}>
                                Роли и ресурсы
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'permissions' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('permissions')}>
                                Матрица полномочий
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'conflicts' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('conflicts')}>
                                Матрица конфликтов
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'positions' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('positions')}>
                                Матрица должностей и ролей
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                               href="#" onClick={() => setActiveTab('history')}>
                                <i className="bi bi-clock-history me-1"></i>
                                История событий
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    {activeTab === 'users' && <UsersTab 
                        roles={roles}
                        permissions={permissions}
                        positionRoleMap={positionRoleMap}
                        positionList={positionList}
                        rolePermissions={rolePermissions}
                        onAddUser={handleAddUser}
                        users={users}
                        onDeleteUser={handleDeleteUser}
                        setUsers={setUsers}
                        onEditUser={handleEditUser}
                    />}
                    {activeTab === 'accounts' && <AccountsTab />}
                    {activeTab === 'roles' && <RolesTab 
                        roles={roles}
                        setRoles={setRoles}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        resources={resources}
                        setResources={setResources}
                        positionList={positionList}
                        setPositionList={setPositionList}
                    />}
                    {activeTab === 'permissions' && <PermissionsMatrixTab 
                        roles={roles}
                        permissions={permissions}
                        rolePermissions={rolePermissions}
                        onToggleRolePermission={handleToggleRolePermission}
                        onSavePermissions={handleSavePermissionsMatrix}
                    />}
                    {activeTab === 'positions' && <PositionRoleMatrixTab 
                        roles={roles}
                        roleConflictMatrix={roleConflictMatrix}
                        onSavePositionRoles={handleSavePositionRolesMatrix}
                    />}
                    {activeTab === 'conflicts' && <ConflictMatrixTab 
                        roles={roles}
                        roleConflictMatrix={roleConflictMatrix}
                        onToggleConflict={handleToggleConflict}
                        onSaveConflicts={handleSaveConflictsMatrix}
                    />}
                    {activeTab === 'history' && <EventHistoryTab 
                        events={events}
                        onClearHistory={clearHistory}
                    />}
                </div>
            </div>
        </div>
    );
} 