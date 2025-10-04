// routes/homework.js
const express = require('express');
const router = express.Router();

// Datos temporales - luego usaremos MongoDB
let homeworkAssignments = [];

// GET /api/homework - Obtener tareas del usuario
router.get('/', (req, res) => {
  // Por ahora devolvemos datos de ejemplo
  const sampleHomework = [
    {
      id: 1,
      title: "Practice Mindfulness",
      description: "Spend 10 minutes practicing mindfulness meditation",
      dueDate: "2024-01-20",
      completed: false,
      therapist: "Dr. Smith"
    },
    {
      id: 2,
      title: "Journal Your Thoughts",
      description: "Write about your feelings and thoughts from this week",
      dueDate: "2024-01-18",
      completed: true,
      therapist: "Dr. Smith"
    }
  ];
  
  res.json({
    success: true,
    homework: sampleHomework
  });
});

// POST /api/homework - Crear nueva tarea (para terapeutas)
router.post('/', (req, res) => {
  const { title, description, dueDate, clientId } = req.body;
  
  const newHomework = {
    id: Date.now(),
    title,
    description,
    dueDate,
    clientId,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  homeworkAssignments.push(newHomework);
  
  res.status(201).json({
    success: true,
    homework: newHomework
  });
});

// PUT /api/homework/:id/complete - Marcar tarea como completada
router.put('/:id/complete', (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  
  const homework = homeworkAssignments.find(hw => hw.id === parseInt(id));
  if (!homework) {
    return res.status(404).json({ error: 'Homework not found' });
  }
  
  homework.completed = true;
  homework.completedAt = new Date().toISOString();
  homework.clientNotes = notes;
  
  res.json({
    success: true,
    homework
  });
});

module.exports = router;