import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  width?: number;
  height?: number;
}

interface MindMapFile {
  version: string;
  metadata: {
    title: string;
    author?: string;
    created: string;
    modified: string;
    description?: string;
    tags?: string[];
    extra?: any;
  };
  nodes: Array<{
    id: string;
    parentId: string | null;
    text: string;
    type: 'root' | 'topic';
    position: { x: number; y: number };
    style: {
      color: string;
      backgroundColor: string;
      fontSize: number;
      fontWeight: string;
    };
    collapsed: boolean;
    extra?: any;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private appState: AppStateService) {}

  /**
   * Exports the current mind map to a .mind file and triggers download
   */
  export(): void {
    const nodes = this.appState.nodes();
    if (nodes.length === 0) return;

    // Convert internal nodes to MINDFILE.md format
    const mindMapFile: MindMapFile = {
      version: '1',
      metadata: {
        title: 'Mind Map',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      nodes: nodes.map(node => ({
        id: node.id,
        parentId: node.parentId,
        text: node.text,
        type: node.parentId === null ? 'root' : 'topic',
        position: { x: node.x, y: node.y },
        style: {
          color: '#000000',
          backgroundColor: '#ffffff',
          fontSize: 14,
          fontWeight: node.parentId === null ? 'bold' : 'normal'
        },
        collapsed: false,
        extra: {}
      }))
    };

    // Create JSON string
    const jsonStr = JSON.stringify(mindMapFile, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${new Date().toISOString().split('T')[0]}.mind`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Imports a mind map from a .mind file
   * @param file The uploaded .mind file
   */
  import(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const mindMapFile: MindMapFile = JSON.parse(result);

          // Validate required fields
          if (!mindMapFile.version || !mindMapFile.nodes || !Array.isArray(mindMapFile.nodes)) {
            throw new Error('Invalid mind map file format');
          }

          // Convert MINDFILE.md nodes to internal format
          const internalNodes: MindMapNode[] = mindMapFile.nodes.map(node => ({
            id: node.id,
            parentId: node.parentId,
            text: node.text,
            x: node.position?.x || 0,
            y: node.position?.y || 0
          }));

          // Update app state
          this.appState.nodes.set(internalNodes);

          // Select the root node if it exists
          const rootNode = internalNodes.find(n => n.parentId === null);
          if (rootNode) {
            this.appState.selectedNodeId.set(rootNode.id);
          }

          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to parse mind map file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Fits the map view after import
   */
  fitViewAfterImport(): void {
    // This method is a placeholder for the navbar to call after import
    // The actual implementation will be handled in the navbar component
  }
}
