/**
 * Agents API v1 Routes
 * Handles agent CRUD operations and deployment
 */

import { Router } from 'express';
import { AgentController } from '../../../controllers/AgentController';
import { validateAgent } from '../../../middleware/validation';
import { authenticate } from '../../../middleware/auth';

const router = Router();
const agentController = new AgentController();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route   GET /api/v1/agents
 * @desc    List all available agents
 * @access  Private
 */
router.get('/', agentController.listAgents);

/**
 * @route   POST /api/v1/agents
 * @desc    Create new agent configuration
 * @access  Private
 */
router.post('/', validateAgent, agentController.createAgent);

/**
 * @route   GET /api/v1/agents/:id
 * @desc    Get agent details
 * @access  Private
 */
router.get('/:id', agentController.getAgent);

/**
 * @route   PUT /api/v1/agents/:id
 * @desc    Update agent configuration
 * @access  Private
 */
router.put('/:id', validateAgent, agentController.updateAgent);

/**
 * @route   DELETE /api/v1/agents/:id
 * @desc    Remove agent
 * @access  Private
 */
router.delete('/:id', agentController.deleteAgent);

/**
 * @route   POST /api/v1/agents/:id/deploy
 * @desc    Deploy agent to runtime
 * @access  Private
 */
router.post('/:id/deploy', agentController.deployAgent);

export default router;
