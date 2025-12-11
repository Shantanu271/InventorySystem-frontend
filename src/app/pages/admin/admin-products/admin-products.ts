import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductDto, ProductService } from '../../../services/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  searchText = '';
  rows: ProductDto[] = [];
  loading = false;

  // inline editing
  editingRowId: number | null = null;
  editModel: Partial<ProductDto> | null = null;

  savedForRow = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products
  loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.productService.getAllForAdmin().subscribe({
      next: (data: ProductDto[]) => {
        this.zone.run(() => {
          this.rows = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Filter search
  get filteredRows(): ProductDto[] {
    const q = this.searchText.toLowerCase().trim();
    if (!q) return this.rows;

    return this.rows.filter(
      (p) =>
        p.skuCode.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
    );
  }

  onAddProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  onBulkImport(): void {
    console.log('Bulk Import clicked');
  }

  // Activate / Deactivate
  onToggleStatus(row: ProductDto): void {
    this.productService.toggleActiveForAdmin(row.id).subscribe({
      next: (updated: ProductDto) => {
        this.zone.run(() => {
          const index = this.rows.findIndex((p) => p.id === updated.id);
          if (index !== -1) {
            this.rows[index] = updated;
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to toggle product active flag', err);
      },
    });
  }

  // Start Editing Row
  onEdit(row: ProductDto): void {
    this.editingRowId = row.id;

    // deep copy to avoid UI auto-update
    this.editModel = JSON.parse(JSON.stringify(row));

    this.savedForRow = false;
    this.cdr.detectChanges();
  }

  // Cancel editing
  onCancelEdit(): void {
    this.editingRowId = null;
    this.editModel = null;
    this.savedForRow = false;
    this.cdr.detectChanges();
  }

  // Save Changes (Inline)
  onSaveEdit(): void {
    if (!this.editingRowId || !this.editModel) return;

    // convert numbers (Angular inputs return string)
    if (this.editModel.mrp !== undefined)
      this.editModel.mrp = Number(this.editModel.mrp);

    if (this.editModel.sellingPrice !== undefined)
      this.editModel.sellingPrice = Number(this.editModel.sellingPrice);

    this.productService.updateForAdmin(this.editingRowId, this.editModel).subscribe({
      next: (updated: ProductDto) => {
        this.zone.run(() => {
          const index = this.rows.findIndex((p) => p.id === updated.id);
          if (index !== -1) {
            this.rows[index] = updated;
          }

          this.savedForRow = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.editingRowId = null;
            this.editModel = null;
            this.savedForRow = false;
            this.cdr.detectChanges();
          }, 700);
        });
      },
      error: (err) => {
        console.error('Failed to save edited product', err);
        this.savedForRow = false;
        this.cdr.detectChanges();
      },
    });
  }
}
