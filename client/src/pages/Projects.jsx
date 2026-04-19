import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useTeam } from '../hooks/useTeam';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { api } from '../utils/api-client';

export default function Projects() {
  const { data: projects, loading, refetch } = useApi('/projects');
  const { data: teamMembers } = useTeam();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (projectData) => {
    await api.post('/projects', projectData);
    setShowForm(false);
    refetch();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Projects</h1>
          <p>Manage your team's projects</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ New Project</Button>
      </div>

      <ProjectList projects={projects} />

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Project">
        <ProjectForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} teamMembers={teamMembers} />
      </Modal>
    </div>
  );
}
