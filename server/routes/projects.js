const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(protect);

// @route   GET /api/projects
// @desc    Listar todos os projetos do usuário
// @access  Private
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ],
      isActive: true
    })
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar')
    .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar projetos',
      error: error.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Obter projeto específico
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar se usuário tem acesso
    const hasAccess = project.owner._id.equals(req.user._id) || 
                      project.members.some(member => member._id.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado a este projeto'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar projeto',
      error: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Criar novo projeto
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, color, members } = req.body;

    const project = await Project.create({
      name,
      description,
      color: color || '#3b82f6',
      owner: req.user._id,
      members: members || []
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.status(201).json({
      success: true,
      project: populatedProject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar projeto',
      error: error.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Atualizar projeto
// @access  Private (apenas owner)
router.put('/:id', async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar se é o owner
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o dono do projeto pode atualizá-lo'
      });
    }

    const { name, description, color, members } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, color, members },
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar');

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar projeto',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Desativar projeto
// @access  Private (apenas owner)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    // Verificar se é o owner
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Apenas o dono do projeto pode deletá-lo'
      });
    }

    await Project.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Projeto desativado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar projeto',
      error: error.message
    });
  }
});

module.exports = router;
