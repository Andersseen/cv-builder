import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../interfaces/resume.interface';

@Component({
  selector: 'app-minimal-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-lg" id="resume-content">
      <div class="p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-light text-gray-900 mb-4">{{ resume.personalInfo.fullName }}</h1>
          <div class="space-y-1 text-sm text-gray-600">
            @if (resume.personalInfo.email) {
              <p>{{ resume.personalInfo.email }}</p>
            }
            @if (resume.personalInfo.phone) {
              <p>{{ resume.personalInfo.phone }}</p>
            }
            @if (resume.personalInfo.location) {
              <p>{{ resume.personalInfo.location }}</p>
            }
            @if (resume.personalInfo.website) {
              <p>{{ resume.personalInfo.website }}</p>
            }
            @if (resume.personalInfo.linkedin) {
              <p>{{ resume.personalInfo.linkedin }}</p>
            }
          </div>
        </div>

        <!-- Summary -->
        @if (resume.personalInfo.summary) {
          <section class="mb-8">
            <p class="text-gray-700 leading-relaxed">{{ resume.personalInfo.summary }}</p>
          </section>
        }

        <!-- Experience -->
        @if (resume.experience.length > 0) {
          <section class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Experience</h2>
            @for (exp of resume.experience; track exp.id) {
              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="font-medium text-gray-900">{{ exp.jobTitle }}</h3>
                  <span class="text-sm text-gray-500">{{ formatDate(exp.startDate) }} – {{ exp.current ? 'Present' : formatDate(exp.endDate) }}</span>
                </div>
                <p class="text-gray-600 mb-2">{{ exp.company }}@if (exp.location) { • {{ exp.location }} }</p>
                @if (exp.description) {
                  <p class="text-gray-700 text-sm leading-relaxed">{{ exp.description }}</p>
                }
              </div>
            }
          </section>
        }

        <!-- Education -->
        @if (resume.education.length > 0) {
          <section class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Education</h2>
            @for (edu of resume.education; track edu.id) {
              <div class="mb-4">
                <div class="flex justify-between items-baseline mb-1">
                  <h3 class="font-medium text-gray-900">{{ edu.degree }}</h3>
                  <span class="text-sm text-gray-500">{{ formatDate(edu.graduationDate) }}</span>
                </div>
                <p class="text-gray-600">{{ edu.institution }}@if (edu.location) { • {{ edu.location }} }</p>
                @if (edu.gpa) {
                  <p class="text-sm text-gray-500">{{ edu.gpa }}</p>
                }
              </div>
            }
          </section>
        }

        <!-- Skills -->
        @if (resume.skills.length > 0) {
          <section>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Skills</h2>
            <div class="space-y-2">
              @for (skill of resume.skills; track skill.id) {
                <div class="flex justify-between">
                  <span class="text-gray-700">{{ skill.name }}</span>
                  <span class="text-gray-500 text-sm">{{ skill.level }}</span>
                </div>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `
})
export class MinimalTemplateComponent {
  @Input() resume!: Resume;

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}