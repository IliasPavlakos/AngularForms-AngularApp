import {afterNextRender, Component, DestroyRef, inject, viewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {debounceTime, pipe} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    FormsModule
  ]
})
export class LoginComponent {

  private form = viewChild<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const subscription = this.form()?.valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) => window.localStorage.setItem('save-login-form', JSON.stringify({email:value.email})),
      });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(formData : NgForm){

    if(!formData.valid){
      return;
    }

    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    console.log(formData);
    console.log(enteredEmail, enteredPassword);

    formData.form.reset();
  }

}
