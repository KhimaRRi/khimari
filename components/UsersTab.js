import React, { useState } from 'react';

function UsersTab({ users, roles, onAddUser, onEditUser, onDeleteUser }) {
  const [newUser, setNewUser] = useState({ name: '', roleId: '' });
  const [editingUser, setEditingUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUser.name && newUser.roleId) {
      onAddUser(newUser);
      setNewUser({ name: '', roleId: '' });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingUser.name && editingUser.roleId) {
      onEditUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div>
      <h2>Управление пользователями</h2>

      {/* Форма добавления пользователя */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Имя пользователя"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>
          <div className="col-md-5">
            <select
              className="form-select"
              value={newUser.roleId}
              onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
            >
              <option value="">Выберите роль</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Добавить</button>
          </div>
        </div>
      </form>

      {/* Таблица пользователей */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                {editingUser && editingUser.id === user.id ? (
                  <>
                    <td>{user.id}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={editingUser.roleId}
                        onChange={(e) => setEditingUser({ ...editingUser, roleId: e.target.value })}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
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
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      {roles.find(role => role.id === user.roleId)?.name || 'Не назначена'}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(user)}
                        >
                          Редактировать
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDeleteUser(user.id)}
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

export default UsersTab; 