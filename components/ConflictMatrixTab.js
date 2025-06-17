import React, { useState } from 'react';

function ConflictMatrixTab({ roles, roleConflictMatrix, onAddConflict, onRemoveConflict }) {
  const [selectedRole1, setSelectedRole1] = useState('');
  const [selectedRole2, setSelectedRole2] = useState('');
  const [conflictType, setConflictType] = useState('conflict');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole1 && selectedRole2 && selectedRole1 !== selectedRole2) {
      onAddConflict(selectedRole1, selectedRole2, conflictType);
      setSelectedRole1('');
      setSelectedRole2('');
      setConflictType('conflict');
    }
  };

  return (
    <div>
      <h2>Матрица конфликтов ролей</h2>

      {/* Форма добавления конфликта */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedRole1}
              onChange={(e) => setSelectedRole1(e.target.value)}
            >
              <option value="">Выберите первую роль</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedRole2}
              onChange={(e) => setSelectedRole2(e.target.value)}
            >
              <option value="">Выберите вторую роль</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={conflictType}
              onChange={(e) => setConflictType(e.target.value)}
            >
              <option value="conflict">Конфликт</option>
              <option value="compatibility">Совместимость</option>
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Добавить</button>
          </div>
        </div>
      </form>

      {/* Таблица конфликтов */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Роль 1</th>
              <th>Роль 2</th>
              <th>Тип</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role1 => (
              roles.map(role2 => {
                if (role1.id >= role2.id) return null;
                const conflict = roleConflictMatrix[role1.id]?.[role2.id];
                if (!conflict) return null;

                return (
                  <tr key={`${role1.id}-${role2.id}`}>
                    <td>{role1.name}</td>
                    <td>{role2.name}</td>
                    <td>
                      <span className={`badge ${conflict === 'conflict' ? 'bg-danger' : 'bg-success'}`}>
                        {conflict === 'conflict' ? 'Конфликт' : 'Совместимость'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onRemoveConflict(role1.id, role2.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>

      {/* Легенда */}
      <div className="mt-4">
        <h3>Легенда</h3>
        <div className="d-flex gap-3">
          <div>
            <span className="badge bg-danger me-2">Конфликт</span>
            - Роли не могут быть назначены одному пользователю
          </div>
          <div>
            <span className="badge bg-success me-2">Совместимость</span>
            - Роли могут быть назначены одному пользователю
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConflictMatrixTab; 