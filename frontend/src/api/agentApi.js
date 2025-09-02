/**
 * Agent API Client
 * 
 * This module handles all API communications related to AI agents in the platform.
 * It provides a clean interface for agent CRUD operations, execution, and monitoring.
 * 
 * Key Features:
 * - Agent lifecycle management (create, read, update, delete)
 * - Agent execution and monitoring
 * - Template and configuration management
 * - Real-time status updates
 * - Error handling and retry logic
 * 
 * Backend Integration:
 * - Connects to /api/agents/* endpoints
 * - Supports Google AI Studio agent types
 * - Integrates with agent execution engine
 * - Handles authentication and permissions
 * 
 * Usage:
 * import { getAgents, createAgent, runAgent } from './agentApi';
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const AGENTS_ENDPOINT = `${API_BASE_URL}/api/agents`;

// Helper function for API requests
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request failed: ${url}`, error);
    throw error;
  }
}

/**
 * Get all agents for the current user/workspace
 * @param {Object} filters - Optional filters (category, status, etc.)
 * @returns {Promise<Array>} List of agent objects
 */
export async function getAgents(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${AGENTS_ENDPOINT}?${queryParams}` : AGENTS_ENDPOINT;
  return apiRequest(url);
}

/**
 * Get a specific agent by ID
 * @param {string} agentId - Agent identifier
 * @returns {Promise<Object>} Agent object with full details
 */
export async function getAgent(agentId) {
  return apiRequest(`${AGENTS_ENDPOINT}/${agentId}`);
}

/**
 * Create a new agent
 * @param {Object} agentData - Agent configuration
 * @returns {Promise<Object>} Created agent object
 */
export async function createAgent(agentData) {
  return apiRequest(AGENTS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(agentData)
  });
}

/**
 * Update an existing agent
 * @param {string} agentId - Agent identifier
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated agent object
 */
export async function updateAgent(agentId, updates) {
  return apiRequest(`${AGENTS_ENDPOINT}/${agentId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

/**
 * Delete an agent
 * @param {string} agentId - Agent identifier
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAgent(agentId) {
  await apiRequest(`${AGENTS_ENDPOINT}/${agentId}`, {
    method: 'DELETE'
  });
  return true;
}

/**
 * Execute an agent with specific input
 * @param {string} agentId - Agent identifier
 * @param {Object} input - Execution parameters
 * @returns {Promise<Object>} Execution result and run ID
 */
export async function runAgent(agentId, input = {}) {
  return apiRequest(`${AGENTS_ENDPOINT}/${agentId}/run`, {
    method: 'POST',
    body: JSON.stringify({ input })
  });
}

/**
 * Get agent execution history
 * @param {string} agentId - Agent identifier
 * @param {Object} options - Pagination and filtering options
 * @returns {Promise<Array>} List of execution records
 */
export async function getAgentRuns(agentId, options = {}) {
  const queryParams = new URLSearchParams(options).toString();
  const url = `${AGENTS_ENDPOINT}/${agentId}/runs${queryParams ? '?' + queryParams : ''}`;
  return apiRequest(url);
}

/**
 * Get specific execution details
 * @param {string} agentId - Agent identifier
 * @param {string} runId - Execution run identifier
 * @returns {Promise<Object>} Detailed run information
 */
export async function getAgentRun(agentId, runId) {
  return apiRequest(`${AGENTS_ENDPOINT}/${agentId}/runs/${runId}`);
}

/**
 * Clone an existing agent
 * @param {string} agentId - Source agent identifier
 * @param {Object} overrides - Configuration overrides for the clone
 * @returns {Promise<Object>} New cloned agent object
 */
export async function cloneAgent(agentId, overrides = {}) {
  return apiRequest(`${AGENTS_ENDPOINT}/${agentId}/clone`, {
    method: 'POST',
    body: JSON.stringify(overrides)
  });
}

/**
 * Get available agent templates
 * @returns {Promise<Array>} List of agent templates
 */
export async function getAgentTemplates() {
  return apiRequest(`${AGENTS_ENDPOINT}/templates`);
}

/**
 * Create agent from template
 * @param {string} templateId - Template identifier
 * @param {Object} config - Agent-specific configuration
 * @returns {Promise<Object>} Created agent object
 */
export async function createAgentFromTemplate(templateId, config = {}) {
  return apiRequest(`${AGENTS_ENDPOINT}/templates/${templateId}/create`, {
    method: 'POST',
    body: JSON.stringify(config)
  });
}

export default {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  runAgent,
  getAgentRuns,
  getAgentRun,
  cloneAgent,
  getAgentTemplates,
  createAgentFromTemplate
};
