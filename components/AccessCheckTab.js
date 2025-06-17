import React, { useState } from 'react';

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

export default AccessCheckTab; 