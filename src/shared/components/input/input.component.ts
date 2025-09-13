import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, input, OnInit, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type InputType = HTMLInputElement['type'];

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  public readonly value = input('');
  public readonly label = input('');
  public readonly required = input(false);
  public readonly placeholder = input('');
  public readonly inputId = input(0);
  public readonly type = input<InputType>('text');
  public readonly disabled = input(false);

  public readonly valueChange = output<string>();
  public readonly onblur = output<void>();
  public readonly onfocus = output<void>();

  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('input');

  protected randomInputId = 0;
  public internalValue = signal('');
  public isFocused = signal(false);

  public isBlurred = signal(false);

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit(): void {
    if (this.inputId() === 0) {
      this.randomInputId = Math.random();
    }
    else {
      this.randomInputId = this.inputId();
    }
  }

  ngAfterViewInit(): void {
    // Set initial value if provided
    const initialValue = this.value();
    if (initialValue) {
      this.internalValue.set(initialValue);
    }
  }

  public onInputBlur(): void {
    this.isBlurred.set(true);
    this.isFocused.set(false);
    this.onTouched();
    this.onblur.emit();
  }

  public onInputFocus(): void {
    this.isFocused.set(true);
    this.onfocus.emit();
  }

  onInputChange(value: string): void {
    this.internalValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  public writeValue(value: string): void {
    this.internalValue.set(value || '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Focus method for programmatic control
  public focusInput(): void {
    this.inputEl()?.nativeElement.focus();
  }
}