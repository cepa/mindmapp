import { Injectable, signal } from '@angular/core';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  width?: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  nodes = signal<MindMapNode[]>([]);
  selectedNodeId = signal<string | null>(null);
  nodesLoadedFromStorage = false;

  constructor() {
    // Load initial state from localStorage if available
    this.loadInitialState();
  }

  private loadInitialState(): void {
    const savedNodes = localStorage.getItem('mindmapNodes');
    if (savedNodes) {
      try {
        const parsedNodes = JSON.parse(savedNodes);
        this.nodes.set(parsedNodes);
        this.nodesLoadedFromStorage = true;
      } catch (e) {
        console.error('Error parsing saved nodes', e);
      }
    }
  }

  saveState(): void {
    localStorage.setItem('mindmapNodes', JSON.stringify(this.nodes()));
  }

  createRootNode(): MindMapNode {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Create root node in the center
    const rootNode: MindMapNode = {
      id: this.generateId(),
      text: 'Central Topic',
      x: viewportWidth / 2 - 75,
      y: viewportHeight / 2 - 25,
      parentId: null
    };

    this.nodes.update(nodes => [...nodes, rootNode]);
    this.selectedNodeId.set(rootNode.id);
    this.saveState();

    return rootNode;
  }

  generateId(): string {
    return 'node-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  addChildNode(parentId: string): MindMapNode | null {
    const parent = this.nodes().find(n => n.id === parentId);
    if (!parent) return null;

    // Generate random position around parent (one of 8 directions)
    const angle = Math.floor(Math.random() * 8) * (Math.PI / 4); // 0, 45, 90, ... degrees
    const distance = 120;
    const newX = parent.x + Math.cos(angle) * distance - 50; // -50 to center horizontally
    const newY = parent.y + Math.sin(angle) * distance - 20; // -20 to center vertically

    const newNode: MindMapNode = {
      id: this.generateId(),
      text: 'New Idea',
      x: newX,
      y: newY,
      parentId: parentId
    };

    this.nodes.update(nodes => [...nodes, newNode]);
    this.selectedNodeId.set(newNode.id);
    this.saveState();

    return newNode;
  }

  deleteSelectedNode(selectedId: string): void {
    if (!selectedId) return;

    // Prevent deleting root node (node without parent)
    const nodeToDelete = this.nodes().find(n => n.id === selectedId);
    if (!nodeToDelete || !nodeToDelete.parentId) {
      return;
    }

    // Delete the node and all its descendants recursively
    const nodesToKeep = this.nodes().filter(node => {
      return !this.isDescendant(node.id, selectedId);
    });

    this.nodes.set(nodesToKeep);
    this.selectedNodeId.set(null);
    this.saveState();
  }

  selectNode(nodeId: string): void {
    this.selectedNodeId.set(nodeId);
  }

  updateNodePosition(nodeId: string, x: number, y: number): void {
    this.nodes.update(nodes =>
      nodes.map(n =>
        n.id === nodeId ? { ...n, x, y } : n
      )
    );
    this.saveState();
  }

  updateNodeText(nodeId: string, newText: string): void {
    this.nodes.update(nodes =>
      nodes.map(n =>
        n.id === nodeId ? { ...n, text: newText } : n
      )
    );
    this.saveState();
  }

  private isDescendant(childId: string, ancestorId: string): boolean {
    // Check if the child itself is the ancestor (should return true)
    if (childId === ancestorId) return true;

    const node = this.nodes().find(n => n.id === childId);
    if (!node) return false;

    let currentId: string | null = node.parentId;
    while (currentId) {
      if (currentId === ancestorId) return true;
      const parent = this.nodes().find(n => n.id === currentId);
      currentId = parent?.parentId || null;
    }
    return false;
  }

  getConnections(): { parent: MindMapNode, child: MindMapNode }[] {
    const nodesList = this.nodes();
    return nodesList.filter(node => node.parentId)
      .map(node => {
        const parent = nodesList.find(n => n.id === node.parentId);
        return parent ? { parent, child: node } : null;
      })
      .filter((conn): conn is {parent: MindMapNode, child: MindMapNode} => conn !== null);
  }

  resetMap(): void {
    this.nodes.set([]);
    this.selectedNodeId.set(null);
    // Create new root node
    if (this.nodes().length === 0) {
      this.createRootNode();
    }
    this.saveState();
  }
}
