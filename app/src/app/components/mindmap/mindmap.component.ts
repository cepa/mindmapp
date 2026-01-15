import { Component, ViewChild, ElementRef, AfterViewInit, Input, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-mindmap',
  standalone: true,
  templateUrl: './mindmap.component.html',
  styleUrl: './mindmap.component.scss'
})
export class MindMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('nodesLayer') nodesLayer!: ElementRef<HTMLElement>;
  @ViewChild('svgLayer') svgLayer!: ElementRef<SVGElement>;
  @ViewChild('mindmapContainer') mindmapContainer!: ElementRef<HTMLElement>;

  isDragging = false;
  draggedNodeId: string | null = null;
  lastMouseX = 0;
  lastMouseY = 0;
  initialTouchX = 0;
  initialTouchY = 0;
  isTouchDragging = false;
  
  // Zoom and pan state
  scale = 1;
  panX = 0;
  panY = 0;
  isPanning = false;
  lastPanX = 0;
  lastPanY = 0;
  
  // Touch state for pinch zoom and pan
  initialDistance = 0;
  initialScale = 1;
  lastTouchEndTime = 0;
  lastTouchedNode: string | null = null;
  TOUCH_DRAG_THRESHOLD = 5; // Minimum pixels to consider as drag
  DOUBLE_TAP_DELAY = 300; // Maximum delay between taps for double-tap

  constructor(
    public appState: AppStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Create root node if none exists
    if (this.appState.nodes().length === 0) {
      this.appState.createRootNode();
    }
    this.setupEventListeners();

    // Fit view to show all nodes if they were loaded from localStorage
    if (this.appState.nodesLoadedFromStorage) {
      setTimeout(() => {
        this.fitView();
      }, 100); // Small delay to ensure everything is rendered
    }
  }

  setupEventListeners() {
    // HostListener decorators handle these events now
    // No need for manual event listener setup
  }

  startDragNode(e: MouseEvent | TouchEvent, nodeId: string) {
    e.stopPropagation();
    
    let clientX: number;
    let clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      
      // Track initial touch position for drag detection
      this.initialTouchX = clientX;
      this.initialTouchY = clientY;
      this.isTouchDragging = false;
      this.isDragging = true;
      this.draggedNodeId = nodeId;
    } else {
      // For mouse events, start dragging immediately
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
      this.isDragging = true;
      this.draggedNodeId = nodeId;
    }

    this.lastMouseX = clientX;
    this.lastMouseY = clientY;

    if ('preventDefault' in e) {
      e.preventDefault();
    }
  }

  selectNode(nodeId: string) {
    this.appState.selectNode(nodeId);
  }

  getConnectionPath(parent: any, child: any): string {
    const pX = parent.x + (parent.width || 100) / 2;
    const pY = parent.y + (parent.height || 40) / 2;
    const cX = child.x + (child.width || 100) / 2;
    const cY = child.y + (child.height || 40) / 2;

    // Calculate control points for smooth curve
    const deltaY = cY - pY;
    const controlY1 = pY + deltaY * 0.5;
    const controlY2 = cY - deltaY * 0.5;

    return `M ${pX} ${pY} C ${pX} ${controlY1}, ${cX} ${controlY2}, ${cX} ${cY}`;
  }

  getParent(parentId: string | null): any | undefined {
    if (!parentId) return undefined;
    return this.appState.nodes().find(n => n.id === parentId);
  }

  addChildNode() {
    const parentId = this.appState.selectedNodeId();
    if (parentId) {
      this.appState.addChildNode(parentId);
    }
  }

  deleteSelectedNode() {
    const selectedId = this.appState.selectedNodeId();
    if (selectedId) {
      this.appState.deleteSelectedNode(selectedId);
    }
  }

  preventDrag(e: MouseEvent | TouchEvent) {
    e.stopPropagation();
  }

  onContentEdit(e: Event, nodeId: string) {
    const element = e.target as HTMLElement;
    const text = element.innerText || element.textContent || '';
    
    // Update the node text in the app state
    if (text.trim() !== '') {
      this.appState.updateNodeText(nodeId, text);
    }
  }

  finishEditNode(nodeId: string) {
    // Find the contentEditable element for this node
    const contentElement = document.querySelector(`[data-node-id="${nodeId}"] .node-content`) as HTMLElement;
    
    if (contentElement) {
      const text = contentElement.textContent || '';
      
      // Only update if text is not empty
      if (text.trim() !== '') {
        this.appState.updateNodeText(nodeId, text.trim());
      } else {
        // Revert to original text if empty
        const node = this.appState.nodes().find(n => n.id === nodeId);
        if (node) {
          contentElement.textContent = node.text;
        }
      }
    }
  }

  handleEditKeyDown(e: KeyboardEvent, nodeId: string) {
    // Allow Enter to create new lines (multiline support)
    if (e.key === 'Enter' && !e.shiftKey) {
      // Regular Enter - save and finish editing
      e.preventDefault();
      this.finishEditNode(nodeId);
      (e.target as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      // Cancel editing
      e.preventDefault();
      const node = this.appState.nodes().find(n => n.id === nodeId);
      if (node) {
        const contentElement = e.target as HTMLElement;
        contentElement.textContent = node.text;
      }
      (e.target as HTMLElement).blur();
    }
  }

  handleTouchEnd(e: TouchEvent, nodeId: string) {
    const now = Date.now();
    
    // Double-tap to focus and select all text
    if (this.lastTouchedNode === nodeId && this.lastTouchEndTime > 0 && 
        now - this.lastTouchEndTime < this.DOUBLE_TAP_DELAY) {
      // This is a double tap - select all text
      e.preventDefault();
      e.stopPropagation();
      
      const contentElement = document.querySelector(`[data-node-id="${nodeId}"] .node-content`) as HTMLElement;
      if (contentElement) {
        const range = document.createRange();
        range.selectNodeContents(contentElement);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      this.lastTouchedNode = null;
      this.lastTouchEndTime = 0;
      return;
    }
    
    // This is the first tap
    this.lastTouchedNode = nodeId;
    this.lastTouchEndTime = now;
    
    // Set timeout to reset if second tap doesn't come
    setTimeout(() => {
      if (this.lastTouchedNode === nodeId) {
        this.lastTouchedNode = null;
        this.lastTouchEndTime = 0;
      }
    }, this.DOUBLE_TAP_DELAY);
  }
  
  private lastTap: number = 0;
  
  // Zoom and pan methods
  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    this.zoom(delta, e.clientX, e.clientY);
  }
  
  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    // Handle both pinch zoom and single-touch pan
    if (e.touches.length === 2) {
      // Start pinch gesture
      this.initialDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
      this.initialScale = this.scale;
      e.preventDefault();
    } else if (e.touches.length === 1 && !this.isDragging) {
      // Single touch - could be for dragging or editing
      // We handle this in the specific touch events on nodes
    }
  }
  
  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    // Handle both pinch zoom and single-touch pan
    if (e.touches.length === 2) {
      // Handle pinch gesture
      const currentDistance = this.getTouchDistance(e.touches[0], e.touches[1]);
      const scaleDelta = currentDistance / this.initialDistance;
      this.scale = Math.min(Math.max(0.5, this.initialScale * scaleDelta), 3);
      this.updateTransform();
      e.preventDefault();
    } else if (e.touches.length === 1 && !this.isDragging) {
      // Handle single touch pan (background drag)
      const touch = e.touches[0];
      
      // Check if touch is on a node
      const touchEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const isOnNode = touchEl?.closest('.node') !== null;
      
      // Allow background dragging:
      // 1. If no node is selected - allow drag anywhere on screen
      // 2. If node is selected - only allow drag when not touching a node
      if (!isOnNode || this.appState.selectedNodeId() === null) {
        if (!this.isPanning) {
          this.isPanning = true;
          this.lastPanX = touch.clientX;
          this.lastPanY = touch.clientY;
          this.mindmapContainer.nativeElement.classList.add('panning');
          
          // Cancel node selection when starting background drag
          this.appState.selectedNodeId.set(null);
        }
        
        // Compensate drag speed for current scale
        const deltaX = touch.clientX - this.lastPanX;
        const deltaY = touch.clientY - this.lastPanY;
        const scaledDeltaX = deltaX / this.scale;
        const scaledDeltaY = deltaY / this.scale;
        
        this.panX += scaledDeltaX;
        this.panY += scaledDeltaY;
        
        this.lastPanX = touch.clientX;
        this.lastPanY = touch.clientY;
        
        this.updateTransform();
      }
      
      e.preventDefault(); // Prevent scrolling while panning
    }
  }
  
  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    // End touch panning
    this.isPanning = false;
    this.mindmapContainer.nativeElement.classList.remove('panning');
  }
  
  @HostListener('touchcancel', ['$event'])
  onTouchCancel(e: TouchEvent) {
    // Handle touch cancellation
    this.isPanning = false;
    this.mindmapContainer.nativeElement.classList.remove('panning');
  }
  
  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    // Check if click is on background (not on a node)
    const targetElement = e.target as HTMLElement;
    const isOnNode = targetElement.closest('.node') !== null;
    
    // Allow background dragging in all cases:
    // 1. No node selected - drag anywhere
    // 2. Node selected - drag only when clicking outside the node
    if (!isOnNode) {
      // Cancel node selection when clicking on background
      this.appState.selectedNodeId.set(null);
      
      this.isPanning = true;
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      this.mindmapContainer.nativeElement.classList.add('panning');
      e.preventDefault();
    }
  }
  
  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.isPanning) {
      const deltaX = e.clientX - this.lastPanX;
      const deltaY = e.clientY - this.lastPanY;
      
      // Compensate drag speed for current scale
      const scaledDeltaX = deltaX / this.scale;
      const scaledDeltaY = deltaY / this.scale;
      
      this.panX += scaledDeltaX;
      this.panY += scaledDeltaY;
      
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      
      this.updateTransform();
    }
  }
  
  @HostListener('document:mouseup')
  onDocumentMouseUp() {
    this.isDragging = false;
    this.draggedNodeId = null;
    this.isPanning = false;
    this.mindmapContainer.nativeElement.classList.remove('panning');
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(e: MouseEvent) {
    // Only handle node dragging if we're actually dragging a node (not panning background)
    if (this.isDragging && this.draggedNodeId && !this.isPanning) {
      const node = this.appState.nodes().find(n => n.id === this.draggedNodeId);
      if (node) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.appState.updateNodePosition(node.id, node.x + deltaX, node.y + deltaY);

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onDocumentTouchMove(e: TouchEvent) {
    // Only handle node dragging if we're actually dragging a node (not panning background)
    if (this.isDragging && this.draggedNodeId && e.touches.length > 0 && !this.isPanning) {
      const node = this.appState.nodes().find(n => n.id === this.draggedNodeId);
      if (node) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        // Check if touch has moved beyond threshold to start dragging
        const deltaX = touchX - this.initialTouchX;
        const deltaY = touchY - this.initialTouchY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (!this.isTouchDragging && distance > this.TOUCH_DRAG_THRESHOLD) {
          this.isTouchDragging = true;
        }
        
        // Only move node if we're actually dragging (beyond threshold)
        if (this.isTouchDragging) {
          const moveDeltaX = touchX - this.lastMouseX;
          const moveDeltaY = touchY - this.lastMouseY;

          this.appState.updateNodePosition(node.id, node.x + moveDeltaX, node.y + moveDeltaY);

          this.lastMouseX = touchX;
          this.lastMouseY = touchY;
        }
      }
    }
    e.preventDefault(); // Prevent scrolling while dragging
  }

  // Track touch start positions to better handle mobile interactions
  private lastTouchStartPosition: { x: number, y: number } | null = null;
  private touchStartedOnNode: boolean = false;
  private touchStartedOnNavbar: boolean = false;
  private touchedNavbarButton: boolean = false;

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(e: TouchEvent) {
    // Track initial touch position for better mobile interaction handling
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.lastTouchStartPosition = { x: touch.clientX, y: touch.clientY };
      
      // Check if touch started on a node
      const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);
      this.touchStartedOnNode = !!touchedElement?.closest('.node');
      
      // Check if touch started on navbar
      const navbar = document.querySelector('nav.navbar.fixed-bottom');
      const navbarRect = navbar?.getBoundingClientRect();
      this.touchStartedOnNavbar = !!navbarRect && 
        touch.clientY > navbarRect.top && 
        touch.clientY < navbarRect.bottom &&
        touch.clientX > navbarRect.left && 
        touch.clientX < navbarRect.right;
    }
  }

  @HostListener('document:touchend', ['$event'])
  onDocumentTouchEnd(e: TouchEvent) {
    // Reset dragging state when touch ends
    if (this.isDragging) {
      this.isDragging = false;
      this.draggedNodeId = null;
      this.isTouchDragging = false;
      return; // Exit early to prevent node deselection during dragging
    }
    
    // Prevent node deselection when touching navbar buttons or any clickable elements
    if (e.touches.length === 0) {
      try {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchedElement = document.elementFromPoint(touchEndX, touchEndY);
        
        // Get current selection state
        const currentlySelected = this.appState.selectedNodeId();
        
        // Check if touch ended on navbar area (fixed at bottom)
        const navbar = document.querySelector('nav.navbar.fixed-bottom');
        const navbarRect = navbar?.getBoundingClientRect();
        const isInNavbarArea = navbarRect && touchEndY > (navbarRect.bottom - 40); // More tolerance
        
        // Check if touch ended on clickable element
        const isClickableElement = touchedElement?.matches('button, a, [href], [onclick], .btn, [role="button"], [data-action]');
        
        // Check if touch ended outside of any node
        const isOutsideNode = !touchedElement?.closest('.node');
        
        // Special case: if touch started on navbar, preserve selection
        const shouldPreserveSelection = 
          this.touchStartedOnNavbar || 
          isInNavbarArea || 
          isClickableElement ||
          (this.touchedNavbarButton && !this.isTouchDragging) ||
          (this.touchStartedOnNode && !this.isTouchDragging);
        
        // Only unselect node if ALL these conditions are met:
        // 1. Touch ended outside of any node
        // 2. Not in navbar area 
        // 3. Not on clickable elements
        // 4. Not dragging
        // 5. Touch didn't start on a node
        if (isOutsideNode && !this.isTouchDragging && !isClickableElement && !isInNavbarArea && !this.touchStartedOnNode) {
          this.appState.selectedNodeId.set(null);
        }
        
        // Reset touch tracking state
        this.lastTouchStartPosition = null;
        this.touchStartedOnNode = false;
        this.touchStartedOnNavbar = false;
        this.touchedNavbarButton = false;
        
      } catch (error) {
        // Silently handle any errors from elementFromPoint (might occur in some mobile scenarios)
        console.debug('Touch end element detection failed:', error);
        
        // Be conservative - preserve selection when in doubt
        if (!this.isTouchDragging && !this.isDragging) {
          // Don't unselect if we're not sure what the touch was on
        }
      }
    }
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.isPanning = false;
    this.mindmapContainer.nativeElement.classList.remove('panning');
  }

  zoom(delta: number, clientX: number, clientY: number) {
    const newScale = Math.min(Math.max(0.5, this.scale + delta), 3);
    
    if (newScale !== this.scale) {
      // Calculate mouse position relative to viewport
      const rect = this.mindmapContainer?.nativeElement.getBoundingClientRect();
      if (rect) {
        // Calculate the position before zoom
        const xBeforeZoom = (clientX - rect.left - this.panX) / this.scale;
        const yBeforeZoom = (clientY - rect.top - this.panY) / this.scale;
        
        // Update scale
        this.scale = newScale;
        
        // Calculate pan adjustment to zoom around mouse position
        this.panX = clientX - rect.left - xBeforeZoom * this.scale;
        this.panY = clientY - rect.top - yBeforeZoom * this.scale;
      } else {
        this.scale = newScale;
      }
      
      this.updateTransform();
    }
  }
  
  getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  updateTransform() {
    if (this.mindmapContainer?.nativeElement) {
      this.mindmapContainer.nativeElement.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }
    
    // Add panning class for cursor styling
    if (this.mindmapContainer?.nativeElement) {
      if (this.isPanning) {
        this.mindmapContainer.nativeElement.classList.add('panning');
      } else {
        this.mindmapContainer.nativeElement.classList.remove('panning');
      }
    }
  }
  
  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  }

  fitView() {
    const nodes = this.appState.nodes();
    if (nodes.length === 0) return;

    // Calculate bounding box of all nodes
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      const nodeLeft = node.x;
      const nodeTop = node.y;
      const nodeRight = node.x + (node.width || 100);
      const nodeBottom = node.y + (node.height || 40);

      minX = Math.min(minX, nodeLeft);
      minY = Math.min(minY, nodeTop);
      maxX = Math.max(maxX, nodeRight);
      maxY = Math.max(maxY, nodeBottom);
    });

    // Calculate center and size of bounding box
    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;
    const bboxCenterX = (minX + maxX) / 2;
    const bboxCenterY = (minY + maxY) / 2;

    // Get viewport dimensions
    const viewportWidth = this.mindmapContainer?.nativeElement.clientWidth || window.innerWidth;
    const viewportHeight = this.mindmapContainer?.nativeElement.clientHeight || window.innerHeight;

    // Calculate scale to fit with some padding
    const padding = 20;
    const scaleX = (viewportWidth - 2 * padding) / bboxWidth;
    const scaleY = (viewportHeight - 2 * padding) / bboxHeight;
    const scale = Math.min(scaleX, scaleY);

    // Cap maximum scale at 1.0 to prevent excessive zooming in
    // Minimum scale remains 0.5 for small maps
    this.scale = Math.max(0.5, Math.min(1.0, scale));

    // Calculate pan to center the bounding box
    const panX = viewportWidth / 2 - bboxCenterX * this.scale;
    const panY = viewportHeight / 2 - bboxCenterY * this.scale;

    // Apply the transformations
    this.panX = panX;
    this.panY = panY;
    this.updateTransform();
  }

  ngOnDestroy(): void {
    // HostListeners are automatically cleaned up by Angular
    // No manual cleanup needed for document event listeners
  }
}
