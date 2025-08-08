import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../interfaces/resume.interface';

@Component({
  selector: 'app-creative-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto bg-white shadow-lg" id="resume-content">
      <div class="flex">
        <!-- Sidebar -->
        <div class="w-1/3 bg-gray-800 text-white p-6">
          <div class="mb-8">
            <h1 class="text-2xl font-bold mb-2">{{ resume.personalInfo.fullName }}</h1>
            <div class="space-y-2 text-sm">
              @if (resume.personalInfo.email) {
                <p class="flex items-center"><span class="mr-2">✉</span>{{ resume.personalInfo.email }}</p>
              }
              @if (resume.personalInfo.phone) {
                <p class="flex items-center"><span class="mr-2">📞</span>{{ resume.personalInfo.phone }}</p>
              }
              @if (resume.personalInfo.location) {
                <p class="flex items-center"><span class="mr-2">📍</span>{{ resume.personalInfo.location }}</p>
              }
              @if (resume.personalInfo.website) {
                <p class="flex items-center"><span class="mr-2">🌐</span>{{ resume.personalInfo.website }}</p>
              }
              @if (resume.personalInfo.linkedin) {
                <p class="flex items-center"><span class="mr-2">💼</span>{{ resume.personalInfo.linkedin }}</p>
              }
            </div>
          </div>

          @if (resume.skills.length > 0) {
            <div class="mb-8">
              <h2 class="text-lg font-bold mb-4 text-yellow-400">Skills</h2>
              @for (skill of resume.skills; track skill.id) {
                <div class="mb-3">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm">{{ skill.name }}</span>
                    <span class="text-xs text-gray-300">{{ skill.level }}</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-yellow-400 h-2 rounded-full" 
                         [style.width]="getSkillWidth(skill.level)"></div>
                  </div>
                </div>
              }
            </div>
          }

          @if (resume.education.length > 0) {
            <div>
              <h2 class="text-lg font-bold mb-4 text-yellow-400">Education</h2>
              @for (edu of resume.education; track edu.id) {
                <div class="mb-4">
                  <h3 class="font-semibold text-sm">{{ edu.degree }}</h3>
                  <p class="text-gray-300 text-xs">{{ edu.institution }}</p>
                  <p class="text-gray-400 text-xs">{{ formatDate(edu.graduationDate) }}</p>
                  @if (edu.gpa) {
                    <p class="text-yellow-400 text-xs">GPA: {{ edu.gpa }}</p>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Main Content -->
        <div class="w-2/3 p-6">
          @if (resume.personalInfo.summary) {
            <section class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 mb-4 relative">
                <span class="bg-yellow-400 h-1 w-12 absolute -bottom-2 left-0"></span>
                About Me
              </h2>
              <p class="text-gray-700 leading-relaxed">{{ resume.personalInfo.summary }}</p>
            </section>
          }

          @if (resume.experience.length > 0) {
            <section>
              <h2 class="text-xl font-bold text-gray-800 mb-6 relative">
                <span class="bg-yellow-400 h-1 w-12 absolute -bottom-2 left-0"></span>
                Experience
              </h2>
              @for (exp of resume.experience; track exp.id) {
                <div class="mb-6 relative pl-6">
                  <div class="absolute left-0 top-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div class="absolute left-1.5 top-5 w-0.5 h-full bg-gray-300"></div>
                  
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800">{{ exp.jobTitle }}</h3>
                      <p class="text-gray-600 font-medium">{{ exp.company }}</p>
                    </div>
                    <div class="text-right text-sm text-gray-500">
                      <p>{{ formatDate(exp.startDate) }} - {{ exp.current ? 'Present' : formatDate(exp.endDate) }}</p>
                      @if (exp.location) {
                        <p>{{ exp.location }}</p>
                      }
                    </div>
                  </div>
                  @if (exp.description) {
                    <p class="text-gray-700 leading-relaxed text-sm">{{ exp.description }}</p>
                  }
                </div>
              }
            </section>
          }
        </div>
      </div>
    </div>
  `
})
export class CreativeTemplateComponent {
  @Input() resume!: Resume;

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  getSkillWidth(level: string): string {
    const widths = {
      'Beginner': '25%',
      'Intermediate': '50%',
      'Advanced': '75%',
      'Expert': '100%'
    };
    return widths[level as keyof typeof widths] || '50%';
  }
}