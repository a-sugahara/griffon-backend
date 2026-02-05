const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(protect);

// @route   GET /api/tasks
// @desc    Listar todas as tarefas do usuário
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { project, status, priority, assignee, startDate, endDate, search } = req.query;

    // Buscar projetos que o usuário tem acesso
    const userProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ],
      isActive: true
    }).select('_id');

    const projectIds = userProjects.map(p => p._id);

    // Construir filtro
    let filter = { project: { $in: projectIds } };

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter)
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefas',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Obter tarefa específica
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color owner members')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar')
      .populate('comments.user', 'name email avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    // Verificar se usuário tem acesso ao projeto
    const hasAccess = task.project.owner.equals(req.user._id) || 
                      task.project.members.some(member => member.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a esta tarefa'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefa',
      error: error.message
    });
  }
});

// @route   POST /api/tasks
// @desc    Criar nova tarefa
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, project, status, priority, assignee, startDate, dueDate, tags } = req.body;

    // Verificar se projeto existe e usuário tem acesso
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    const hasAccess = projectDoc.owner.equals(req.user._id) || 
                      projectDoc.members.some(member => member.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a este projeto'
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      status: status || 'todo',
      priority: priority || 'medium',
      assignee,
      creator: req.user._id,
      startDate,
      dueDate,
      tags
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name color')
      .populate('assignee', 'name email avatar')
      .populate('creator', 'name email avatar');

    res.status(201).json({
      success: true,
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar tarefa',
      error: error.message
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Atualizar tarefa
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    // Verificar acesso
    const hasAccess = task.project.owner.equals(req.user._id) || 
                      task.project.members.some(member => member.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    const { title, description, status, priority, assignee, startDate, dueDate, tags } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assignee, startDate, dueDate, tags },
      { new: true, runValidators: true }
    )
    .populate('project', 'name color')
    .populate('assignee', 'name email avatar')
    .populate('creator', 'name email avatar');

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar tarefa',
      error: error.message
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Deletar tarefa
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    // Verificar se é owner do projeto ou criador da tarefa
    const canDelete = task.project.owner.equals(req.user._id) || 
                      task.creator.equals(req.user._id);

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar esta tarefa'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tarefa deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar tarefa',
      error: error.message
    });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Adicionar comentário
// @access  Private
router.post('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada'
      });
    }

    const { text } = req.body;

    task.comments.push({
      user: req.user._id,
      text
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email avatar');

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar comentário',
      error: error.message
    });
  }
});

module.exports = router;
