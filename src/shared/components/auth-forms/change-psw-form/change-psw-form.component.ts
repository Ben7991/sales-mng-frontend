import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ButtonComponent} from '@shared/components/button/button.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputComponent} from '@shared/components/input/input.component';

@Component({
  selector: 'app-change-psw-form',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    InputComponent
  ],
  templateUrl: './change-psw-form.component.html',
  styleUrl: './change-psw-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePswFormComponent {
  public changePswForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.changePswForm = this.fb.group({
      newPassword: ['',[Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',[Validators.required, Validators.minLength(6)]]
    });
  }

  public onRequestPassReset() {
    console.log('submitted:', this.changePswForm.value);
  }
}
