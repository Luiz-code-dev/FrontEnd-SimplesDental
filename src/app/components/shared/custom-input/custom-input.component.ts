import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>{{ label }}</mat-label>
      <input matInput
             [type]="type"
             [formControl]="control"
             [placeholder]="placeholder">
      <mat-error *ngIf="control.invalid && control.touched">
        {{ errorMessage }}
      </mat-error>
    </mat-form-field>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() errorMessage = '';

  control = new FormControl('');
  disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}
