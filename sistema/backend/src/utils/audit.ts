import db from '../db';

export const logAction = (userId: number | null, action: string, entity: string, entityId: number | null, details: string | null) => {
  db.prepare(
    'INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, action, entity, entityId, details);
};
