import React, { useState } from 'react';

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

      {/* Форма добавления ресурса */}
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
            <button type="submit" className="btn btn-primary w-100">Добавить</button>
          </div>
        </div>
      </form>

      {/* Таблица ресурсов */}
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

export default ResourcesTab; 