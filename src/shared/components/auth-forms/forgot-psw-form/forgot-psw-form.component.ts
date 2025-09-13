import { ChangeDetectionStrategy, Component } from '@angular/core';
import {InputComponent} from "@shared/components/input/input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonComponent} from '@shared/components/button/button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-psw-form',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './forgot-psw-form.component.html',
  styleUrl: './forgot-psw-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPswFormComponent {
  public forgotPswForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPswForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public onRequestPassReset() {
      console.log('submitted:', this.forgotPswForm.value);
  }
}
