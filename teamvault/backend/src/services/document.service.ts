import mongoose from 'mongoose';
import { Document, IDocument } from '../models/Document';

export class DocumentService {
  public static async getUserDocuments(userId: string): Promise<IDocument[]> {
    return Document.find({ ownerId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  // SECURELENS-DEMO-VULN: API1-BOLA
  // Intentionally vulnerable: fetches document solely by its document ID
  // without verifying whether document.ownerId matches the authenticated requester's ID.
  public static async getDocumentByIdVulnerable(documentId: string, userId?: string): Promise<IDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return null;
    }
    // VULNERABILITY: Missing ownership authorization check (ownerId === requester.id)
    // Remediated by SecureLens: Enforce object ownership validation
    const query: any = { _id: documentId };
    if (userId) {
      query.ownerId = new mongoose.Types.ObjectId(userId);
    }
    return Document.findOne(query).populate('ownerId', 'name email');
  }

  public static async createDocument(title: string, content: string, ownerId: string): Promise<IDocument> {
    const doc = new Document({
      title,
      content,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });
    return doc.save();
  }

  public static async getAllDocumentsSummary(): Promise<any[]> {
    return Document.find().select('title ownerId createdAt').populate('ownerId', 'name email');
  }
}
