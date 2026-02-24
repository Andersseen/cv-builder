import { Component, OnInit, signal, effect } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeService } from "../services/resume.service";
import { PersonalInfo } from "../interfaces/resume.interface";
import { PersonalInfoForm } from "../interfaces/resume-forms.interface";

@Component({
  selector: "app-personal-info-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        Personal Information
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Full Name *</label
            >
            <input
              type="text"
              formControlName="fullName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
            <div
              *ngIf="
                form.controls.fullName.touched && form.controls.fullName.invalid
              "
              class="text-red-500 text-xs mt-1"
            >
              Full Name is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email *</label
            >
            <input
              type="email"
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
            <div
              *ngIf="form.controls.email.touched && form.controls.email.invalid"
              class="text-red-500 text-xs mt-1"
            >
              Valid email is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Phone *</label
            >
            <input
              type="tel"
              formControlName="phone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
            <div
              *ngIf="form.controls.phone.touched && form.controls.phone.invalid"
              class="text-red-500 text-xs mt-1"
            >
              Phone is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location *</label
            >
            <input
              type="text"
              formControlName="location"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="New York, NY"
            />
            <div
              *ngIf="
                form.controls.location.touched && form.controls.location.invalid
              "
              class="text-red-500 text-xs mt-1"
            >
              Location is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Website</label
            >
            <input
              type="url"
              formControlName="website"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://johndoe.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >LinkedIn</label
            >
            <input
              type="url"
              formControlName="linkedin"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Professional Summary</label
          >
          <textarea
            formControlName="summary"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief overview of your professional background and key achievements..."
          ></textarea>
        </div>
      </form>
    </div>
  `,
})
export class PersonalInfoFormComponent {
  form: FormGroup<PersonalInfoForm>;

  constructor(private resumeService: ResumeService) {
    // Initialize form with strict controls
    this.form = new FormGroup<PersonalInfoForm>({
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

    // Effect to keep form synced with signal store initially and on external updates
    // Using effect() to watch the signal from ResumeService
    effect(() => {
      const currentData = this.resumeService.resume().personalInfo;
      // updateValueAndValidity is false to avoid triggering the valueChange subscription immediately back
      // if we were to use 2-way sync.
      this.form.patchValue(currentData, { emitEvent: false });
    });

    // Subscribe to changes to update the store
    // We update the store on every valid change
    this.form.valueChanges.subscribe((value) => {
      if (this.form.valid) {
        // We need to cast partially because the form might be disabled/partial, but here it's simple
        this.resumeService.updatePersonalInfo(
          this.form.getRawValue() as PersonalInfo,
        );
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.resumeService.updatePersonalInfo(
        this.form.getRawValue() as PersonalInfo,
      );
    }
  }
}
