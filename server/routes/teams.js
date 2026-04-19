import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/team — all team members
router.get('/', (req, res) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY id').all();
  res.json(members);
});

// GET /api/team/workload — team members with task counts and priority breakdown
router.get('/workload', (req, res) => {
  const db = getDb();

  const members = db.prepare(`
    SELECT tm.*,
      COUNT(t.id) as total_tasks,
      SUM(CASE WHEN t.priority = 'urgent' THEN 1 ELSE 0 END) as urgent_count,
      SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) as high_count,
      SUM(CASE WHEN t.priority = 'medium' THEN 1 ELSE 0 END) as medium_count,
      SUM(CASE WHEN t.priority = 'low' THEN 1 ELSE 0 END) as low_count
    FROM team_members tm
    LEFT JOIN tasks t ON tm.id = t.assignee_id
    GROUP BY tm.id
    ORDER BY total_tasks DESC
  `).all();

  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id IS NOT NULL
    ORDER BY t.assignee_id, t.due_date ASC
  `).all();

  const tasksByMember = {};
  tasks.forEach((t) => {
    if (!tasksByMember[t.assignee_id]) tasksByMember[t.assignee_id] = [];
    tasksByMember[t.assignee_id].push(t);
  });

  const result = members.map((m) => ({
    ...m,
    tasks: tasksByMember[m.id] || [],
  }));

  res.json(result);
});

// GET /api/team/:id — single team member
router.get('/:id', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json(member);
});

// GET /api/team/:id/tasks — tasks assigned to a team member
router.get('/:id/tasks', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id = ?
    ORDER BY t.due_date ASC
  `).all(req.params.id);
  res.json(tasks);
});

export default router;
