// UsersTab
function UsersTab({ roles, permissions, positionRoleMap, positionList, rolePermissions, onAddUser, users, onDeleteUser, setUsers }) {
    const [newUser, setNewUser] = useState({ name: '', positionId: '' });
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [alert, setAlert] = useState(null);

    // Инициализация пользователей из window.initialUsers
    useEffect(() => {
        if (window.initialUsers && users.length === 0) {
            setUsers(window.initialUsers);
        }
    }, []);

    // При выборе должности автоматически подставлять роли и полномочия
    useEffect(() => {
        if (newUser.positionId) {
            const rolesForPosition = positionRoleMap[newUser.positionId] || [];
            setSelectedRoles(rolesForPosition);
            // Собираем все полномочия для этих ролей
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
            setAlert({ type: 'danger', msg: 'Пожалуйста, заполните имя и выберите должность.' });
            return;
        }
        onAddUser({
            ...newUser,
            positionId: Number(newUser.positionId),
            roles: selectedRoles,
            permissions: selectedPermissions
        });
        setNewUser({ name: '', positionId: '' });
        setSelectedRoles([]);
        setSelectedPermissions([]);
        setAlert({ type: 'success', msg: 'Пользователь успешно добавлен!' });
    };

    return (
        <div>
            <h5 className="mb-3">Добавить пользователя</h5>
            {alert && (
                <div className={`alert alert-${alert.type} mb-2`} role="alert">
                    {alert.msg}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    name="name"
                    placeholder="Имя пользователя"
                    value={newUser.name}
                    onChange={handleChange}
                />
                <select
                    className="form-select mb-2"
                    name="positionId"
                    value={newUser.positionId}
                    onChange={handleChange}
                >
                    <option value="">Выберите должность</option>
                    {positionList.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.name}</option>
                    ))}
                </select>
                <div className="mb-2">
                    <div className="fw-bold">Роли, назначаемые должности:</div>
                    <ul className="mb-1">
                        {selectedRoles.map(roleId => {
                            const role = roles.find(r => r.id === roleId);
                            return role ? <li key={roleId}>{role.name}</li> : null;
                        })}
                    </ul>
                </div>
                <div className="mb-2">
                    <div className="fw-bold">Полномочия на основе выбранной должности:</div>
                    <ul className="mb-1">
                        {selectedPermissions.map(permId => {
                            const perm = permissions.find(p => p.id === permId);
                            return perm ? <li key={permId}>{perm.name}</li> : null;
                        })}
                    </ul>
                </div>
                <button className="btn btn-primary w-100" type="submit">Добавить пользователя</button>
            </form>
            {users.map((user, idx) => {
                const position = positionList.find(p => p.id === user.positionId);
                return (
                    <div key={idx} className="mb-3 p-3 bg-light rounded">
                        <div className="fw-bold">{user.name}</div>
                        <div className="text-muted">Должность: {position ? position.name : ''}</div>
                        <div>Роли: {user.roles.map(roleId => {
                            const role = roles.find(r => r.id === roleId);
                            return role ? role.name : '';
                        }).filter(Boolean).join(', ')}</div>
                        <div>Полномочия: {user.permissions.map(permId => {
                            const perm = permissions.find(p => p.id === permId);
                            return perm ? perm.name : '';
                        }).filter(Boolean).join(', ')}</div>
                        <div className="btn-group mt-2">
                            <button className="btn btn-warning btn-sm">Редактировать</button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDeleteUser(idx)}>Удалить</button>
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
function ConflictMatrixTab({ roles, roleConflictMatrix, onToggleConflict }) {
    // Роли отсортированы по id для корректного отображения
    const sortedRoles = [...roles].sort((a, b) => a.id - b.id);

    return (
        <div>
            <h4>Матрица конфликтов ролей (SoD)</h4>
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
                                        roleConflictMatrix[rowRole.id] &&
                                        roleConflictMatrix[rowRole.id][colRole.id] === '+';
                                    return (
                                        <td
                                            key={colRole.id}
                                            style={{ cursor: 'pointer', background: conflict ? '#f8d7da' : undefined }}
                                            onClick={() => onToggleConflict(rowRole.id, colRole.id)}
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

function PermissionsMatrixTab({ roles, permissions, rolePermissions, onToggleRolePermission }) {
    const sortedRoles = [...roles].sort((a, b) => a.id - b.id);
    const sortedPermissions = [...permissions].sort((a, b) => a.id - b.id);

    return (
        <div>
            <h4>Матрица полномочий ролей</h4>
            <div className="table-responsive">
                <table className="table permissions-matrix-table table-bordered text-center align-middle mt-3">
                    <thead>
                        <tr>
                            <th style={{ minWidth: 180 }}>Роль/Полномочие (код полномочия)</th>
                            {sortedPermissions.map(perm => (
                                <th key={perm.id}>
                                    {perm.name} <span className="text-secondary">({perm.id})</span>
                                    <div className="text-muted" style={{ fontSize: '0.85em' }}>{perm.description}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRoles.map(role => (
                            <tr key={role.id}>
                                <th className="text-start bg-light">{role.name} <span className="text-secondary">({role.id})</span></th>
                                {sortedPermissions.map(perm => {
                                    const hasPermission = (rolePermissions[role.id] || []).includes(perm.id);
                                    return (
                                        <td
                                            key={perm.id}
                                            style={{ cursor: 'pointer', background: hasPermission ? '#d1e7dd' : undefined }}
                                            onClick={() => onToggleRolePermission(role.id, perm.id)}
                                            title={hasPermission ? 'Полномочие назначено' : 'Нет полномочия'}
                                        >
                                            {hasPermission ? <span style={{ color: '#198754', fontSize: 22 }}>&#10003;</span> : ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '0.95em' }}>
                Кликните на ячейку, чтобы добавить или убрать полномочие для роли.
            </div>
        </div>
    );
}

function RoleModelAnalysisTab({ users, roles, roleConflictMatrix, positionList }) {
    // Проверка на конфликт ролей у пользователя
    function hasRoleConflict(user) {
        if (!user.roles || user.roles.length < 2) return false;
        for (let i = 0; i < user.roles.length; i++) {
            for (let j = i + 1; j < user.roles.length; j++) {
                const r1 = user.roles[i], r2 = user.roles[j];
                if (roleConflictMatrix[r1] && roleConflictMatrix[r1][r2] === '+') return true;
            }
        }
        return false;
    }

    // Статистика по ролям
    const roleStats = roles.map(role => ({
        ...role,
        count: users.filter(u => u.roles && u.roles.includes(role.id)).length
    }));

    return (
        <div>
            <h4>Анализ ролевой модели</h4>
            <div className="mb-4">
                <h6>Пользователи и их роли</h6>
                <div className="table-responsive">
                    <table className="table table-bordered align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th>Имя</th>
                                <th>Должность</th>
                                <th>Роли</th>
                                <th>Полномочия</th>
                                <th>Конфликт ролей</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => {
                                const position = positionList.find(p => p.id === user.positionId);
                                const conflict = hasRoleConflict(user);
                                return (
                                    <tr key={idx} className={conflict ? 'table-danger' : ''}>
                                        <td>{user.name}</td>
                                        <td>{position ? position.name : ''}</td>
                                        <td>{(user.roles || []).map(rid => roles.find(r => r.id === rid)?.name).filter(Boolean).join(', ')}</td>
                                        <td>{(user.permissions || []).length}</td>
                                        <td>{conflict ? <span className="text-danger fw-bold">Конфликт!</span> : ''}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mb-4">
                <h6>Статистика по ролям</h6>
                <ul>
                    {roleStats.map(role => (
                        <li key={role.id}>{role.name}: {role.count} пользователь(ей)</li>
                    ))}
                </ul>
            </div>
            <div className="alert alert-info">
                <b>Примечание:</b> Если у пользователя есть конфликтующие роли (SoD), строка выделяется красным цветом.
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

function PositionRoleMatrixTab({ roles, roleConflictMatrix }) {
    const [positions, setPositions] = useState(window.initialPositions || defaultPositions);
    const [positionRoles, setPositionRoles] = useState({
        1: [1, 2, 3],
        2: [2, 3],
        3: [2],
        4: [3],
        5: [7, 8]
    });

    const sortedRoles = [...roles].sort((a, b) => a.id - b.id);

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
        setPositionRoles(prev => {
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

    return (
        <div>
            <h4>Матрица соответствия должностей и ролей</h4>
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
                            const assignedRoles = positionRoles[pos.id] || [];
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

// App
function App() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState(window.initialRoles);
    const [resources, setResources] = useState(window.initialResources);
    const [permissions, setPermissions] = useState(window.initialPermissions);
    const [rolePermissions, setRolePermissions] = useState(window.initialRolePermissions);
    const [roleConflictMatrix, setRoleConflictMatrix] = useState(window.initialRoleConflictMatrix);
    const [positionRoleMap, setPositionRoleMap] = useState(window.initialPositionRoleMap);
    const [positionList, setPositionList] = useState(window.initialPositionList);

    // Обработчики для пользователей
    const handleAddUser = (user) => {
        setUsers(prev => [user, ...prev]);
    };

    const handleEditUser = (userId, userData) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, ...userData } : user
        ));
    };

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    // Обработчики для ролей
    const handleAddRole = (roleData) => {
        const newRole = {
            id: roles.length + 1,
            ...roleData
        };
        setRoles([...roles, newRole]);
        setRolePermissions({
            ...rolePermissions,
            [newRole.id]: []
        });
        setRoleConflictMatrix({
            ...roleConflictMatrix,
            [newRole.id]: {}
        });
    };

    const handleEditRole = (roleId, roleData) => {
        setRoles(roles.map(role => 
            role.id === roleId ? { ...role, ...roleData } : role
        ));
    };

    const handleDeleteRole = (roleId) => {
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
    };

    // Обработчики для ресурсов
    const handleAddResource = (resourceData) => {
        const newResource = {
            id: resources.length + 1,
            ...resourceData
        };
        setResources([...resources, newResource]);
    };

    const handleEditResource = (resourceId, resourceData) => {
        setResources(resources.map(resource => 
            resource.id === resourceId ? { ...resource, ...resourceData } : resource
        ));
    };

    const handleDeleteResource = (resourceId) => {
        setResources(resources.filter(resource => resource.id !== resourceId));
    };

    // Обработчики для разрешений ролей
    const handleUpdateRolePermissions = (roleId, permissionIds) => {
        setRolePermissions({
            ...rolePermissions,
            [roleId]: permissionIds
        });
    };

    // Обработчики для конфликтов ролей
    const handleAddConflict = (roleId1, roleId2, conflictType) => {
        setRoleConflictMatrix({
            ...roleConflictMatrix,
            [roleId1]: {
                ...roleConflictMatrix[roleId1],
                [roleId2]: conflictType
            },
            [roleId2]: {
                ...roleConflictMatrix[roleId2],
                [roleId1]: conflictType
            }
        });
    };

    const handleRemoveConflict = (roleId1, roleId2) => {
        const newMatrix = { ...roleConflictMatrix };
        delete newMatrix[roleId1][roleId2];
        delete newMatrix[roleId2][roleId1];
        setRoleConflictMatrix(newMatrix);
    };

    const handleToggleConflict = (roleId1, roleId2) => {
        const newMatrix = { ...roleConflictMatrix };
        newMatrix[roleId1][roleId2] = newMatrix[roleId1][roleId2] === '+' ? '-' : '+';
        newMatrix[roleId2][roleId1] = newMatrix[roleId2][roleId1] === '+' ? '-' : '+';
        setRoleConflictMatrix(newMatrix);
    };

    const handleToggleRolePermission = (roleId, permissionId) => {
        const newRolePermissions = { ...rolePermissions };
        if (newRolePermissions[roleId] && newRolePermissions[roleId].includes(permissionId)) {
            newRolePermissions[roleId] = newRolePermissions[roleId].filter(id => id !== permissionId);
        } else {
            newRolePermissions[roleId] = [...(newRolePermissions[roleId] || []), permissionId];
        }
        setRolePermissions(newRolePermissions);
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Управление доступом к ресурсам</h3>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'users' ? ' active' : ''}`} onClick={() => setActiveTab('users')}>Пользователи</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'accounts' ? ' active' : ''}`} onClick={() => setActiveTab('accounts')}>Учетные записи</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'roles' ? ' active' : ''}`} onClick={() => setActiveTab('roles')}>Роли и ресурсы</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'permissions' ? ' active' : ''}`} onClick={() => setActiveTab('permissions')}>Матрица полномочий</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'positions' ? ' active' : ''}`} onClick={() => setActiveTab('positions')}>Матрица должностей и ролей</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'conflicts' ? ' active' : ''}`} onClick={() => setActiveTab('conflicts')}>Матрица конфликтов</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link${activeTab === 'analysis' ? ' active' : ''}`} onClick={() => setActiveTab('analysis')}>Анализ ролевой модели</button>
                </li>
            </ul>
            {activeTab === 'users' && (
                <UsersTab 
                    roles={roles}
                    permissions={permissions}
                    positionRoleMap={positionRoleMap}
                    positionList={positionList}
                    rolePermissions={rolePermissions}
                    onAddUser={handleAddUser}
                    users={users}
                    onDeleteUser={handleDeleteUser}
                    setUsers={setUsers}
                />
            )}
            {activeTab === 'accounts' && <AccountsTab />}
            {activeTab === 'roles' && (
                <RolesTab 
                    roles={roles}
                    setRoles={setRoles}
                    permissions={permissions}
                    setPermissions={setPermissions}
                    resources={resources}
                    setResources={setResources}
                    positionList={positionList}
                    setPositionList={setPositionList}
                />
            )}
            {activeTab === 'permissions' && (
                <PermissionsMatrixTab 
                    roles={roles}
                    permissions={permissions}
                    rolePermissions={rolePermissions}
                    onToggleRolePermission={handleToggleRolePermission}
                />
            )}
            {activeTab === 'positions' && (
                <PositionRoleMatrixTab 
                    roles={roles}
                    roleConflictMatrix={roleConflictMatrix}
                />
            )}
            {activeTab === 'conflicts' && (
                <ConflictMatrixTab 
                    roles={roles}
                    roleConflictMatrix={roleConflictMatrix}
                    onToggleConflict={handleToggleConflict}
                />
            )}
            {activeTab === 'analysis' && (
                <RoleModelAnalysisTab 
                    users={users}
                    roles={roles}
                    roleConflictMatrix={roleConflictMatrix}
                    positionList={positionList}
                />
            )}
        </div>
    );
} 