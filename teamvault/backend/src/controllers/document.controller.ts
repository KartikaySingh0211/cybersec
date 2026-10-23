import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';

export class DocumentController {
  public static async getDocuments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const documents = await DocumentService.getUserDocuments(userId);
      res.status(200).json(documents);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
    }
  }

  // SECURELENS-DEMO-VULN: API1-BOLA
  // Intentionally vulnerable: fetches document solely using req.params.id
  // without checking if document.ownerId === req.user.id.
  public static async getDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.params.id;

      // VULNERABILITY: No check verifying that authenticated user owns this document!
      const userId = req.user?.id;
      const document = await DocumentService.getDocumentByIdVulnerable(documentId, userId);

      if (!document) {
        res.status(404).json({ message: 'Document not found' });
        return;
      }

      res.status(200).json(document);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve document', error: error.message });
    }
  }

  public static async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { title, content } = req.body;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (!title || !content) {
        res.status(400).json({ message: 'Title and content are required' });
        return;
      }

      const document = await DocumentService.createDocument(title, content, userId);
      res.status(201).json(document);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to create document', error: error.message });
    }
  }

  // Helper endpoint for demo page to show available document IDs for demonstration
  public static async getAllDemoDocuments(req: Request, res: Response): Promise<void> {
    try {
      const summaries = await DocumentService.getAllDocumentsSummary();
      res.status(200).json(summaries);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch document directory', error: error.message });
    }
  }
}
