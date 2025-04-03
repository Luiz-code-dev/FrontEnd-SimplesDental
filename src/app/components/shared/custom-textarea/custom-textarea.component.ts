import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true
    }
  ]
})
export class CustomTextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() errorMessage = '';
  @Input() showError = false;

  value: any = '';
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
