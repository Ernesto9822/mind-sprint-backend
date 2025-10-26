require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (sin error si falla)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindsprint')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️ MongoDB connection warning:', err.message));

// ✅ ESQUEMA DE TAREAS (Homework)
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: String, // Firebase UID del cliente
    required: true
  },
  assignedBy: {
    type: String, // Firebase UID del terapeuta
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['mindfulness', 'journaling', 'exercise', 'social', 'learning', 'general'],
    default: 'general'
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

const Task = mongoose.model('Task', taskSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MindSprint Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ ENDPOINTS BÁSICOS TEMPORALES (sin rutas externas)
app.post('/api/users/register', (req, res) => {
  console.log('📝 User registration:', req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: req.body
  });
});

app.get('/api/mood', (req, res) => {
  res.json({
    success: true,
    entries: [],
    message: 'Mood endpoint working'
  });
});

// 📋 SISTEMA DE TAREAS - ENDPOINTS

// 1. CREAR TAREA (Terapeutas)
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, category } = req.body;

    // Validaciones básicas
    if (!title || !assignedTo) {
      return res.status(400).json({
        success: false,
        error: 'Title and assignedTo are required'
      });
    }

    // En producción, aquí verificarías el token Firebase del terapeuta
    const assignedBy = 'therapist_user_id'; // Temporal - reemplazar con auth real

    const newTask = new Task({
      title,
      description: description || '',
      assignedTo,
      assignedBy,
      dueDate: dueDate || null,
      category: category || 'general',
      status: 'pending'
    });

    const savedTask = await newTask.save();

    console.log('✅ New task created:', savedTask._id);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: savedTask
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 2. OBTENER TAREAS DEL USUARIO
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 }); // Más recientes primero

    res.json({
      success: true,
      tasks: tasks,
      count: tasks.length
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 3. OBTENER TODAS LAS TAREAS (Para terapeutas)
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks: tasks,
      total: tasks.length
    });

  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 4. MARCAR TAREA COMO COMPLETADA
app.put('/api/tasks/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    
    const updatedTask = await task.save();

    console.log('✅ Task completed:', taskId);
    res.json({
      success: true,
      message: 'Task marked as completed',
      task: updatedTask
    });

  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 5. ELIMINAR TAREA
app.delete('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    console.log('🗑️ Task deleted:', taskId);
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ✅ ENDPOINT EXISTENTE ACTUALIZADO
app.get('/api/homework', async (req, res) => {
  try {
    const tasks = await Task.find().limit(10).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      homework: tasks,
      message: 'Homework endpoint working with real data',
      count: tasks.length
    });
  } catch (error) {
    res.json({
      success: true,
      homework: [],
      message: 'Homework endpoint working (fallback)'
    });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Health check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`📋 Tasks API ready at http://0.0.0.0:${PORT}/api/tasks`);
});