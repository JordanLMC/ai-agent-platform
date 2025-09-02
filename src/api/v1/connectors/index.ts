/**
 * Connectors API v1 Routes
 * Handles third-party service integration management
 */

import { Router } from 'express';
import { ConnectorController } from '../../../controllers/ConnectorController';
import { validateConnector } from '../../../middleware/validation';
import { authenticate } from '../../../middleware/auth';

const router = Router();
const connectorController = new ConnectorController();

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route   GET /api/v1/connectors
 * @desc    List available integrations
 * @access  Private
 */
router.get('/', connectorController.listConnectors);

/**
 * @route   POST /api/v1/connectors
 * @desc    Configure new connector
 * @access  Private
 */
router.post('/', validateConnector, connectorController.createConnector);

/**
 * @route   GET /api/v1/connectors/:id
 * @desc    Get connector details
 * @access  Private
 */
router.get('/:id', connectorController.getConnector);

/**
 * @route   PUT /api/v1/connectors/:id
 * @desc    Update connector settings
 * @access  Private
 */
router.put('/:id', validateConnector, connectorController.updateConnector);

/**
 * @route   POST /api/v1/connectors/:id/test
 * @desc    Test connector connection
 * @access  Private
 */
router.post('/:id/test', connectorController.testConnector);

/**
 * @route   DELETE /api/v1/connectors/:id
 * @desc    Remove connector
 * @access  Private
 */
router.delete('/:id', connectorController.deleteConnector);

export default router;
