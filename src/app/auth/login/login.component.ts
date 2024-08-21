import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, of} from "rxjs";

let initialEmailValue = '';
const savedForm = window.localStorage.getItem('login-form-data');
if(savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email], asyncValidators: [emailIsUnique]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark],
    }),
  });

  ngOnInit(): void {

    const savedForm = window.localStorage.getItem('login-form-data');
    if(savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.form.patchValue({
        email: loadedForm.email,
      });
    }

    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => window.localStorage.setItem('login-form-data', JSON.stringify({email: value.email})),
    })
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  };

  onSubmit() {
    console.log(this.form);
  }

  get emailIsInvalid() {
    return !this.form.controls.email.untouched && this.form.controls.email.dirty && this.form.controls.email.invalid;
  }

  get passwordIsInvalid() {
    return !this.form.controls.password.untouched && this.form.controls.password.dirty && this.form.controls.password.invalid;
  }
}

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }

  return {doesNotContainQuestionMark: true};
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }

  return of({notUnique: true});
}
