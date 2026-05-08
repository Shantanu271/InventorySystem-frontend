import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../services/stock';

interface StockRow {
  id: number;
  code: string;
  name: string;

  currentStock: number;
  minStock: number; // always 25

  // inline edit
  adjustedStock: number;

  saved: boolean;
}

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-stock.html',
  styleUrl: './admin-stock.css',
})
export class AdminStock implements OnInit {
  rows: StockRow[] = [];
  loading = false;
  adjustmentMode = false;

  readonly MIN_STOCK = 25;

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadStock();
  }

  // 🔄 Load stock from liquor_inventory
  loadStock(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.stockService.getStock().subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.rows = data.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.product,
            currentStock: item.currentStock,
            minStock: this.MIN_STOCK,
            adjustedStock: item.currentStock,
            saved: false,
          }));

          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to load stock', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onStockInClick(): void {
    alert('Stock In (Purchase) will be implemented later.');
  }

  onStockAdjustmentClick(): void {
    this.adjustmentMode = !this.adjustmentMode;

    this.rows.forEach((r) => {
      r.adjustedStock = r.currentStock;
      r.saved = false;
    });
  }

  // ✅ Save audit adjustment
  saveAdjustment(row: StockRow): void {
    const newStock = Number(row.adjustedStock);

    if (newStock === row.currentStock) return;

    this.stockService.adjustStock(row.id, newStock).subscribe({
      next: () => {
        row.currentStock = newStock;
        row.adjustedStock = newStock;
        row.saved = true;

        setTimeout(() => (row.saved = false), 3000);
      },
      error: (err) => {
        console.error('Stock update failed', err);
        alert('Failed to update stock');
      },
    });
  }

  cancelAdjustment(row: StockRow): void {
    row.adjustedStock = row.currentStock;
    row.saved = false;
  }
}
