import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiquorInventory, LiquorInventoryService } from '../../../services/liquor-inventory-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {

  liquorRows: LiquorInventory[] = [];
  loading = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private liquorService: LiquorInventoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,  
  ) {}

  ngOnInit(): void {
    console.log('[AdminProducts] ngOnInit');
    this.loadLiquorInventory();
  }

  loadLiquorInventory(): void {
    console.log('[AdminProducts] loadLiquorInventory() called');
    this.loading = true;

    this.liquorService.getAll().subscribe({
      next: (data) => {
        console.log('[AdminProducts] Liquor inventory loaded:', data);
          this.liquorRows = data.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[AdminProducts] Failed to load liquor inventory:', err);
        this.loading = false;
      }
    });
  }
    onAddNewProduct(): void {
 this.router.navigate(['/admin/products/new']);
  }

  onBulkImport(): void {
    console.log('[AdminProducts] Bulk Import button clicked');
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    console.log('[AdminProducts] File input change event:', event);

    const file = event.target?.files?.[0];
    if (!file) {
      console.warn('[AdminProducts] No file selected');
      return;
    }

    console.log('[AdminProducts] Selected file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    this.liquorService.bulkImport(file).subscribe({
      next: (res) => {
        console.log('[AdminProducts] Bulk import success response:', res);
        alert('Liquor inventory imported successfully');
        this.loadLiquorInventory(); // refresh
      },
      error: (err) => {
        console.error('[AdminProducts] Bulk import failed:', err);
        alert(err?.error || 'Bulk import failed – check console');
      }
    });
    
  }
}
