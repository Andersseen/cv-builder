import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../interfaces/resume.interface';

@Component({
  selector: 'app-modern-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-lg" id="resume-content">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 class="text-4xl font-bold mb-2">{{ resume.personalInfo.fullName }}</h1>
        <div class="flex flex-wrap gap-4 text-sm">
          @if (resume.personalInfo.email) {
            <span>✉ {{ resume.personalInfo.email }}</span>
          }
          @if (resume.personalInfo.phone) {
            <span>📞 {{ resume.personalInfo.phone }}</span>
          }
          @if (resume.personalInfo.location) {
            <span>📍 {{ resume.personalInfo.location }}</span>
          }
          @if (resume.personalInfo.website) {
            <span>🌐 {{ resume.personalInfo.website }}</span>
          }
          @if (resume.personalInfo.linkedin) {
            <span>💼 {{ resume.personalInfo.linkedin }}</span>
          }
        </div>
      </div>

      <div class="p-8">
        <!-- Summary -->
        @if (resume.personalInfo.summary) {
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Professional Summary</h2>
            <p class="text-gray-700 leading-relaxed">{{ resume.personalInfo.summary }}</p>
          </section>
        }

        <!-- Experience -->
        @if (resume.experience.length > 0) {
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Experience</h2>
            @for (exp of resume.experience; track exp.id) {
              <div class="mb-6">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800">{{ exp.jobTitle }}</h3>
                    <p class="text-blue-600 font-medium">{{ exp.company }}</p>
                  </div>
                  <div class="text-right text-sm text-gray-600">
                    <p>{{ formatDate(exp.startDate) }} - {{ exp.current ? 'Present' : formatDate(exp.endDate) }}</p>
                    @if (exp.location) {
                      <p>{{ exp.location }}</p>
                    }
                  </div>
                </div>
                @if (exp.description) {
                  <p class="text-gray-700 leading-relaxed">{{ exp.description }}</p>
                }
              </div>
            }
          </section>
        }

        <!-- Education -->
        @if (resume.education.length > 0) {
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Education</h2>
            @for (edu of resume.education; track edu.id) {
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">{{ edu.degree }}</h3>
                    <p class="text-blue-600">{{ edu.institution }}</p>
                    @if (edu.gpa) {
                      <p class="text-sm text-gray-600">GPA: {{ edu.gpa }}</p>
                    }
                  </div>
                  <div class="text-right text-sm text-gray-600">
                    <p>{{ formatDate(edu.graduationDate) }}</p>
                    @if (edu.location) {
                      <p>{{ edu.location }}</p>
                    }
                  </div>
                </div>
              </div>
            }
          </section>
        }

        <!-- Skills -->
        @if (resume.skills.length > 0) {
          <section>
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Skills</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              @for (skill of resume.skills; track skill.id) {
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="font-medium text-gray-800">{{ skill.name }}</p>
                  <p class="text-sm text-blue-600">{{ skill.level }}</p>
                </div>
              }
            </div>
          </section>
        }
      </div>
    </div>
  `
})
export class ModernTemplateComponent {
  @Input() resume!: Resume;

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}