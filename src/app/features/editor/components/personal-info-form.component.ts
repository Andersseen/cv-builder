import {
  Component,
  input,
  output,
  effect,
  signal,
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
      <h2 class="text-lg font-semibold text-foreground mb-4">
        Personal Information
      </h2>

      <!-- Avatar upload -->
      <div class="flex items-center gap-4">
        <div
          class="relative w-20 h-20 rounded-full overflow-hidden bg-surface-alt border-2 border-border flex items-center justify-center shrink-0"
        >
          @if (avatarPreview()) {
            <img
              [src]="avatarPreview()"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          }
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground/80"
            >Profile Photo</label
          >
          <div class="flex items-center gap-2">
            <label
              class="px-3 py-1.5 bg-surface-alt border border-border rounded-lg text-foreground text-sm
                     hover:bg-surface-hover cursor-pointer transition-all duration-200"
            >
              Upload
              <input
                type="file"
                accept="image/*"
                class="hidden"
                (change)="onAvatarSelected($event)"
              />
            </label>
            @if (avatarPreview()) {
              <button
                type="button"
                (click)="removeAvatar()"
                class="px-3 py-1.5 text-sm text-danger hover:text-danger/80 transition-colors"
              >
                Remove
              </button>
            }
          </div>
          <p class="text-xs text-muted-foreground">
            Only shown in Creative, Modern & Executive templates
          </p>
        </div>
      </div>

      <form [formGroup]="form" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Full Name *</label
            >
            <input
              type="text"
              formControlName="fullName"
              class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
              placeholder="John Doe"
            />
            @if (
              form.controls.fullName.touched && form.controls.fullName.invalid
            ) {
              <p class="text-danger text-xs mt-1">Full Name is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Email *</label
            >
            <input
              type="email"
              formControlName="email"
              class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
              placeholder="john&#64;example.com"
            />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="text-danger text-xs mt-1">Valid email is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Phone *</label
            >
            <input
              type="tel"
              formControlName="phone"
              class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
              placeholder="+1 (555) 123-4567"
            />
            @if (form.controls.phone.touched && form.controls.phone.invalid) {
              <p class="text-danger text-xs mt-1">Phone is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Location *</label
            >
            <input
              type="text"
              formControlName="location"
              class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
              placeholder="New York, NY"
            />
            @if (
              form.controls.location.touched && form.controls.location.invalid
            ) {
              <p class="text-danger text-xs mt-1">Location is required</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >Website</label
            >
            <input
              type="url"
              formControlName="website"
              class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
              placeholder="https://johndoe.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground/80 mb-1.5"
              >LinkedIn</label
            >
            <input
              type="url"
              formControlName="linkedin"
              class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                     placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                     transition-all duration-200"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground/80 mb-1.5"
            >Professional Summary</label
          >
          <textarea
            formControlName="summary"
            rows="4"
            class="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-foreground
                   placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
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

  avatarPreview = signal<string>("");

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
    effect(() => {
      const d = this.data();
      this.form.patchValue(d, { emitEvent: false });
      this.avatarPreview.set(d.avatarUrl || "");
    });

    this.form.valueChanges.subscribe(() => {
      this.changed.emit({
        ...(this.form.getRawValue() as any),
        avatarUrl: this.avatarPreview(),
      } as PersonalInfo);
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.avatarPreview.set(dataUrl);
      this.emitCurrentState();
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarPreview.set("");
    this.emitCurrentState();
  }

  private emitCurrentState(): void {
    this.changed.emit({
      ...(this.form.getRawValue() as any),
      avatarUrl: this.avatarPreview(),
    } as PersonalInfo);
  }
}
