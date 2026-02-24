import {
  Component,
  input,
  output,
  effect,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PersonalInfo } from "../../../domain/models/cv.model";

@Component({
  selector: "app-personal-info-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <h2 class="text-lg font-semibold text-white mb-4">
        Personal Information
      </h2>

      <form [formGroup]="form" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >Full Name *</label
            >
            <input
              type="text"
              formControlName="fullName"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
              placeholder="John Doe"
            />
            @if (
              form.controls.fullName.touched && form.controls.fullName.invalid
            ) {
              <p class="text-red-400 text-xs mt-1">Full Name is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >Email *</label
            >
            <input
              type="email"
              formControlName="email"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
              placeholder="john&#64;example.com"
            />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="text-red-400 text-xs mt-1">Valid email is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >Phone *</label
            >
            <input
              type="tel"
              formControlName="phone"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
              placeholder="+1 (555) 123-4567"
            />
            @if (form.controls.phone.touched && form.controls.phone.invalid) {
              <p class="text-red-400 text-xs mt-1">Phone is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >Location *</label
            >
            <input
              type="text"
              formControlName="location"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
              placeholder="New York, NY"
            />
            @if (
              form.controls.location.touched && form.controls.location.invalid
            ) {
              <p class="text-red-400 text-xs mt-1">Location is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >Website</label
            >
            <input
              type="url"
              formControlName="website"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
              placeholder="https://johndoe.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1.5"
              >LinkedIn</label
            >
            <input
              type="url"
              formControlName="linkedin"
              class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                     placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5"
            >Professional Summary</label
          >
          <textarea
            formControlName="summary"
            rows="4"
            class="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white
                   placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200 resize-none"
            placeholder="Brief overview of your professional background and key achievements..."
          ></textarea>
        </div>
      </form>
    </div>
  `,
})
export class PersonalInfoFormComponent {
  data = input.required<PersonalInfo>();
  changed = output<PersonalInfo>();

  form = new FormGroup({
    fullName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    website: new FormControl("", { nonNullable: true }),
    linkedin: new FormControl("", { nonNullable: true }),
    summary: new FormControl("", { nonNullable: true }),
  });

  constructor() {
    // Hydrate form from input signal
    effect(() => {
      const d = this.data();
      this.form.patchValue(d, { emitEvent: false });
    });

    // Emit on valid changes
    this.form.valueChanges.subscribe(() => {
      this.changed.emit(this.form.getRawValue() as PersonalInfo);
    });
  }
}
