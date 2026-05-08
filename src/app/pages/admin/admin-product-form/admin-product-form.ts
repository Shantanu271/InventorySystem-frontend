import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LiquorInventoryService } from '../../../services/liquor-inventory-service';

type Mode = 'SCAN' | 'MANUAL';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm {
  mode: Mode = 'SCAN';

  scanBarcode = '';
  saving = false;
  errorMessage = '';
  infoMessage = '';

  form: any = {
     skuCode: '',   
    brandName: '',
    barcode: '',
    strengthVv: 0,
    bottleSizeMl: 0,
    mrpApproved: 0,
    noOfCases: 0,
    noOfBottles: 0,
    batchNumber: '',
    monthOfMfg: '',
  };

  constructor(
    private liquorService: LiquorInventoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  switchMode(mode: Mode) {
    this.mode = mode;
    this.errorMessage = '';
    this.infoMessage = '';
    this.cdr.detectChanges();
  }

  onScanConfirm(): void {
    const code = this.scanBarcode.trim();

    if (!code) {
      this.errorMessage = 'Please scan a barcode.';
      this.cdr.detectChanges();
      return;
    }

    this.form.barcode = code;

    this.infoMessage = 'Barcode captured successfully.';
    this.cdr.detectChanges();
  }

  // ✅ frontend-only calculation
  get totalBottles(): number {
    const cases = Number(this.form.noOfCases) || 0;
    const bottlesPerCase = Number(this.form.noOfBottles) || 0;
    return cases * bottlesPerCase;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.infoMessage = '';

   if (!this.form.skuCode || !this.form.brandName || !this.form.barcode) {
  this.errorMessage = 'SKU Code, Brand name and Barcode are required.';
  this.cdr.detectChanges();
  return;
}


    const payload = {
      ...this.form,
      totalBottles: this.totalBottles,
    };

    this.saving = true;
    this.cdr.detectChanges();

    this.liquorService.addProduct(payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/products']);
      },
      error: (err: { error: { message: string; }; }) => {
        console.error(err);
        this.errorMessage = err?.error?.message || 'Failed to save product.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }
}
