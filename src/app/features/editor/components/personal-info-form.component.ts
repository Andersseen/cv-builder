import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonalInfo } from '../../../core/models/resume.model';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Personal Information</h2>
        <button 
          type="button"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          (click)="toggleCollapsed()"
        >
          @if (collapsed) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          }
        </button>
      </div>
      
      @if (!collapsed) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName"
                class="input"
                [ngClass]="{'border-error-500': submitted && form.controls['firstName'].errors}"
              />
              @if (submitted && form.controls['firstName'].errors) {
                <p class="mt-1 text-sm text-error-500">First name is required</p>
              }
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName"
                class="input"
                [ngClass]="{'border-error-500': submitted && form.controls['lastName'].errors}"
              />
              @if (submitted && form.controls['lastName'].errors) {
                <p class="mt-1 text-sm text-error-500">Last name is required</p>
              }
            </div>
          </div>
          
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Title *
            </label>
            <input 
              type="text" 
              id="title" 
              formControlName="title"
              class="input"
              [ngClass]="{'border-error-500': submitted && form.controls['title'].errors}"
            />
            @if (submitted && form.controls['title'].errors) {
              <p class="mt-1 text-sm text-error-500">Job title is required</p>
            }
          </div>
          
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="input"
              [ngClass]="{'border-error-500': submitted && form.controls['email'].errors}"
            />
            @if (submitted && form.controls['email'].errors?.['required']) {
              <p class="mt-1 text-sm text-error-500">Email is required</p>
            } @else if (submitted && form.controls['email'].errors?.['email']) {
              <p class="mt-1 text-sm text-error-500">Please enter a valid email</p>
            }
          </div>
          
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input 
              type="tel" 
              id="phone" 
              formControlName="phone"
              class="input"
            />
          </div>
          
          <div class="mb-4">
            <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input 
              type="text" 
              id="location" 
              formControlName="location"
              class="input"
              placeholder="City, Country"
            />
          </div>
          
          <div class="mb-4">
            <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website
            </label>
            <input 
              type="url" 
              id="website" 
              formControlName="website"
              class="input"
              placeholder="https://your-website.com"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="linkedIn" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn
              </label>
              <input 
                type="text" 
                id="linkedIn" 
                formControlName="linkedIn"
                class="input"
                placeholder="username"
              />
            </div>
            
            <div>
              <label for="github" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub
              </label>
              <input 
                type="text" 
                id="github" 
                formControlName="github"
                class="input"
                placeholder="username"
              />
            </div>
          </div>
          
          <div class="mb-4">
            <label for="summary" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Professional Summary
            </label>
            <textarea 
              id="summary" 
              formControlName="summary"
              rows="4"
              class="input"
              placeholder="A brief summary of your professional background and key skills"
            ></textarea>
          </div>
          
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="btn btn-primary px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class PersonalInfoFormComponent {
  @Input() set personalInfo(value: Partial<PersonalInfo>) {
    this._personalInfo = value;
    this.initForm();
  }
  
  @Output() infoChanged = new EventEmitter<Partial<PersonalInfo>>();
  
  private _personalInfo: Partial<PersonalInfo> = {};
  form!: FormGroup;
  submitted = false;
  collapsed = false;
  
  constructor(private fb: FormBuilder) {
    this.initForm();
  }
  
  private initForm(): void {
    this.form = this.fb.group({
      firstName: [this._personalInfo.firstName || '', Validators.required],
      lastName: [this._personalInfo.lastName || '', Validators.required],
      title: [this._personalInfo.title || '', Validators.required],
      email: [this._personalInfo.email || '', [Validators.required, Validators.email]],
      phone: [this._personalInfo.phone || ''],
      location: [this._personalInfo.location || ''],
      website: [this._personalInfo.website || ''],
      linkedIn: [this._personalInfo.linkedIn || ''],
      github: [this._personalInfo.github || ''],
      summary: [this._personalInfo.summary || '']
    });
    
    // Auto-save on value changes
    this.form.valueChanges.subscribe(value => {
      if (this.form.valid) {
        this.infoChanged.emit(value);
      }
    });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.form.valid) {
      this.infoChanged.emit(this.form.value);
    }
  }
  
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}