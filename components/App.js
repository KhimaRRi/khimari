import React, { useState, useEffect, useRef } from 'react';
import UsersTab from './UsersTab';
import { AccountsTab } from './AccountsTab';
import { RolesTab } from './RolesTab';
import { RoleMatrixTab } from './RoleMatrixTab';
import { ConflictMatrixTab } from './ConflictMatrixTab';
import { RoleAnalysisTab } from './RoleAnalysisTab';
import { PositionRoleMatrixTab } from './PositionRoleMatrixTab';
import { initialResources, initialRoles, initialPermissions, initialRolePermissions, initialRoleConflictMatrix } from '../data/initialData';

// Initialize Telegram WebApp
const tg = window.Telegram?.WebApp || {
  expand: () => {},
  ready: () => {},
  onEvent: () => {},
  sendData: () => {},
  platform: 'web'
};

function App() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState(window.initialRoles);
    const [resources, setResources] = useState(window.initialResources);
    const [permissions, setPermissions] = useState(window.initialPermissions);
    const [rolePermissions, setRolePermissions] = useState(window.initialRolePermissions);
    const [roleConflictMatrix, setRoleConflictMatrix] = useState(window.initialRoleConflictMatrix);

    // Обработчики для пользователей
    const handleAddUser = (userData) => {
        const newUser = {
            id: users.length + 1,
            ...userData
        };
        setUsers([...users, newUser]);
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

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Система управления доступом</h1>
            
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Пользователи
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roles')}
                    >
                        Роли
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        Ресурсы
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'conflicts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('conflicts')}
                    >
                        Конфликты ролей
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'access' ? 'active' : ''}`}
                        onClick={() => setActiveTab('access')}
                    >
                        Проверка доступа
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === 'users' && (
                    <UsersTab 
                        users={users}
                        roles={roles}
                        onAddUser={handleAddUser}
                        onEditUser={handleEditUser}
                        onDeleteUser={handleDeleteUser}
                    />
                )}
                {activeTab === 'roles' && (
                    <RolesTab 
                        roles={roles}
                        permissions={permissions}
                        rolePermissions={rolePermissions}
                        onAddRole={handleAddRole}
                        onEditRole={handleEditRole}
                        onDeleteRole={handleDeleteRole}
                        onUpdateRolePermissions={handleUpdateRolePermissions}
                    />
                )}
                {activeTab === 'resources' && (
                    <ResourcesTab 
                        resources={resources}
                        onAddResource={handleAddResource}
                        onEditResource={handleEditResource}
                        onDeleteResource={handleDeleteResource}
                    />
                )}
                {activeTab === 'conflicts' && (
                    <ConflictMatrixTab 
                        roles={roles}
                        roleConflictMatrix={roleConflictMatrix}
                        onAddConflict={handleAddConflict}
                        onRemoveConflict={handleRemoveConflict}
                    />
                )}
                {activeTab === 'access' && (
                    <AccessCheckTab 
                        users={users}
                        resources={resources}
                        permissions={permissions}
                        roles={roles}
                        rolePermissions={rolePermissions}
                        roleConflictMatrix={roleConflictMatrix}
                    />
                )}
            </div>
        </div>
    );
}

export default App; 