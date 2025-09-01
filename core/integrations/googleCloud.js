/**
 * Google Cloud Integration for AI Agent Platform
 * Provides connections to Google Cloud services including Sheets, Drive, and Gmail
 * 
 * @author AI Agent Platform
 * @version 1.0.0
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class GoogleCloudIntegration {
  constructor(config = {}) {
    this.config = {
      keyFilePath: config.keyFilePath || process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: config.scopes || [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send'
      ],
      ...config
    };
    
    this.auth = null;
    this.sheets = null;
    this.drive = null;
    this.gmail = null;
  }

  /**
   * Initialize the Google Cloud authentication and services
   */
  async initialize() {
    try {
      // Load service account key
      const keyFile = await this.loadKeyFile();
      
      // Create JWT auth client
      this.auth = new google.auth.JWT(
        keyFile.client_email,
        null,
        keyFile.private_key,
        this.config.scopes
      );

      // Authorize the client
      await this.auth.authorize();

      // Initialize Google services
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.gmail = google.gmail({ version: 'v1', auth: this.auth });

      console.log('✅ Google Cloud services initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Cloud services:', error.message);
      throw error;
    }
  }

  /**
   * Load service account key file
   */
  async loadKeyFile() {
    try {
      if (!this.config.keyFilePath) {
        throw new Error('Google service account key file path not provided');
      }

      const keyFileContent = await fs.readFile(this.config.keyFilePath, 'utf8');
      return JSON.parse(keyFileContent);
    } catch (error) {
      throw new Error(`Failed to load Google service account key: ${error.message}`);
    }
  }

  /**
   * Google Sheets Operations
   */
  async readSheet(spreadsheetId, range) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });

      return response.data.values || [];
    } catch (error) {
      console.error('❌ Error reading sheet:', error.message);
      throw error;
    }
  }

  async writeSheet(spreadsheetId, range, values) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error writing to sheet:', error.message);
      throw error;
    }
  }

  async appendToSheet(spreadsheetId, range, values) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error appending to sheet:', error.message);
      throw error;
    }
  }

  /**
   * Google Drive Operations
   */
  async listFiles(query = '', pageSize = 10) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const response = await this.drive.files.list({
        q: query,
        pageSize,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size)'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('❌ Error listing files:', error.message);
      throw error;
    }
  }

  async uploadFile(filePath, fileName, parentFolderId = null) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const fileMetadata = {
        name: fileName,
        parents: parentFolderId ? [parentFolderId] : undefined
      };

      const media = {
        body: await fs.readFile(filePath)
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id'
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error uploading file:', error.message);
      throw error;
    }
  }

  async downloadFile(fileId, destinationPath) {
    try {
      if (!this.drive) {
        await this.initialize();
      }

      const response = await this.drive.files.get({
        fileId,
        alt: 'media'
      });

      await fs.writeFile(destinationPath, response.data);
      return destinationPath;
    } catch (error) {
      console.error('❌ Error downloading file:', error.message);
      throw error;
    }
  }

  /**
   * Gmail Operations
   */
  async listEmails(query = '', maxResults = 10) {
    try {
      if (!this.gmail) {
        await this.initialize();
      }

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });

      return response.data.messages || [];
    } catch (error) {
      console.error('❌ Error listing emails:', error.message);
      throw error;
    }
  }

  async getEmail(messageId) {
    try {
      if (!this.gmail) {
        await this.initialize();
      }

      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error getting email:', error.message);
      throw error;
    }
  }

  async sendEmail(to, subject, message, attachments = []) {
    try {
      if (!this.gmail) {
        await this.initialize();
      }

      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        '',
        message
      ].join('\n');

      const encodedEmail = Buffer.from(email).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: encodedEmail
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
      throw error;
    }
  }

  /**
   * Utility Methods
   */
  async testConnection() {
    try {
      await this.initialize();
      
      // Test each service
      const tests = {
        sheets: false,
        drive: false,
        gmail: false
      };

      // Test Sheets
      try {
        await this.sheets.spreadsheets.get({ spreadsheetId: 'test' });
      } catch (error) {
        if (error.code !== 404) {
          tests.sheets = true; // Service is working, just test spreadsheet doesn't exist
        }
      }

      // Test Drive
      try {
        await this.listFiles('', 1);
        tests.drive = true;
      } catch (error) {
        console.warn('Drive test failed:', error.message);
      }

      // Test Gmail
      try {
        await this.listEmails('', 1);
        tests.gmail = true;
      } catch (error) {
        console.warn('Gmail test failed:', error.message);
      }

      return tests;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      throw error;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: !!(this.auth && this.sheets && this.drive && this.gmail),
      services: {
        sheets: !!this.sheets,
        drive: !!this.drive,
        gmail: !!this.gmail
      },
      scopes: this.config.scopes
    };
  }
}

module.exports = GoogleCloudIntegration;
