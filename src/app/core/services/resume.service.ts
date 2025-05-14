import { Injectable, signal, computed } from '@angular/core';
import { Resume, DEFAULT_RESUME, Section, SectionType, SectionItem } from '../models/resume.model';
import { generateId } from '../utils/id.utils';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast.service';

const STORAGE_KEY = 'cv-builder-resumes';
const CURRENT_RESUME_KEY = 'cv-builder-current-resume';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private resumesSignal = signal<Resume[]>([]);
  private currentResumeIdSignal = signal<string>('');
  
  public resumes = this.resumesSignal.asReadonly();
  public currentResumeId = this.currentResumeIdSignal.asReadonly();
  
  public currentResume = computed(() => {
    const id = this.currentResumeIdSignal();
    if (!id) return null;
    return this.resumesSignal().find(resume => resume.id === id) || null;
  });

  constructor(
    private localStorageService: LocalStorageService,
    private toastService: ToastService
  ) {
    this.loadResumes();
  }

  private loadResumes(): void {
    const storedResumes = this.localStorageService.getItem<Resume[]>(STORAGE_KEY) || [];
    this.resumesSignal.set(storedResumes);
    
    const currentResumeId = this.localStorageService.getItem<string>(CURRENT_RESUME_KEY);
    if (currentResumeId && storedResumes.some(resume => resume.id === currentResumeId)) {
      this.currentResumeIdSignal.set(currentResumeId);
    } else if (storedResumes.length > 0) {
      this.currentResumeIdSignal.set(storedResumes[0].id);
    }
  }

  private saveResumes(): void {
    this.localStorageService.setItem(STORAGE_KEY, this.resumesSignal());
    this.localStorageService.setItem(CURRENT_RESUME_KEY, this.currentResumeIdSignal());
  }

  createResume(name: string = 'Untitled Resume'): Resume {
    const resume: Resume = {
      ...DEFAULT_RESUME,
      id: generateId(),
      name,
      lastModified: new Date(),
      sections: this.getDefaultSections()
    };
    
    this.resumesSignal.update(resumes => [...resumes, resume]);
    this.currentResumeIdSignal.set(resume.id);
    this.saveResumes();
    this.toastService.show('Resume created successfully', 'success');
    
    return resume;
  }

  updateResume(resume: Resume): void {
    this.resumesSignal.update(resumes => 
      resumes.map(r => r.id === resume.id ? { ...resume, lastModified: new Date() } : r)
    );
    this.saveResumes();
    this.toastService.show('Resume updated', 'success');
  }

  deleteResume(id: string): void {
    this.resumesSignal.update(resumes => resumes.filter(r => r.id !== id));
    
    if (this.currentResumeIdSignal() === id) {
      const remaining = this.resumesSignal();
      if (remaining.length > 0) {
        this.currentResumeIdSignal.set(remaining[0].id);
      } else {
        this.currentResumeIdSignal.set('');
      }
    }
    
    this.saveResumes();
    this.toastService.show('Resume deleted', 'success');
  }

  setCurrentResume(id: string): void {
    this.currentResumeIdSignal.set(id);
    this.saveResumes();
  }

  addSection(type: SectionType, title?: string): void {
    const current = this.currentResume();
    if (!current) return;
    
    const sectionCount = current.sections.length;
    const newSection: Section = {
      id: generateId(),
      type,
      title: title || this.getDefaultSectionTitle(type),
      items: [],
      visible: true,
      order: sectionCount
    };
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { ...r, sections: [...r.sections, newSection], lastModified: new Date() } 
          : r
      )
    );
    
    this.saveResumes();
    this.toastService.show('Section added', 'success');
  }

  updateSection(sectionId: string, updatedSection: Partial<Section>): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections.map(s => 
                s.id === sectionId ? { ...s, ...updatedSection } : s
              ),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
  }

  deleteSection(sectionId: string): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections.filter(s => s.id !== sectionId),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
    this.toastService.show('Section deleted', 'success');
  }

  reorderSections(orderedIds: string[]): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections
                .map(s => ({
                  ...s,
                  order: orderedIds.indexOf(s.id)
                }))
                .sort((a, b) => a.order - b.order),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
  }

  addSectionItem(sectionId: string, item: SectionItem): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections.map(s => 
                s.id === sectionId 
                  ? { ...s, items: [...s.items, { ...item, id: generateId() }] } 
                  : s
              ),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
    this.toastService.show('Item added', 'success');
  }

  updateSectionItem(sectionId: string, itemId: string, updatedItem: Partial<SectionItem>): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections.map(s => 
                s.id === sectionId 
                  ? { 
                      ...s, 
                      items: s.items.map(item => 
                        item.id === itemId ? { ...item, ...updatedItem } : item
                      ) 
                    } 
                  : s
              ),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
  }

  deleteSectionItem(sectionId: string, itemId: string): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections.map(s => 
                s.id === sectionId 
                  ? { ...s, items: s.items.filter(item => item.id !== itemId) } 
                  : s
              ),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
    this.toastService.show('Item deleted', 'success');
  }

  reorderSectionItems(sectionId: string, orderedIds: string[]): void {
    const current = this.currentResume();
    if (!current) return;
    
    const section = current.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newItems = orderedIds
      .map(id => section.items.find(item => item.id === id))
      .filter(Boolean) as SectionItem[];
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              sections: r.sections.map(s => 
                s.id === sectionId 
                  ? { ...s, items: newItems } 
                  : s
              ),
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
  }

  updatePersonalInfo(personalInfo: Partial<Resume['personalInfo']>): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              personalInfo: { ...r.personalInfo, ...personalInfo },
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
  }

  updateSettings(settings: Partial<Resume['settings']>): void {
    const current = this.currentResume();
    if (!current) return;
    
    this.resumesSignal.update(resumes => 
      resumes.map(r => 
        r.id === current.id 
          ? { 
              ...r, 
              settings: { ...r.settings, ...settings },
              lastModified: new Date()
            } 
          : r
      )
    );
    
    this.saveResumes();
  }

  private getDefaultSections(): Section[] {
    return [
      {
        id: generateId(),
        type: SectionType.EXPERIENCE,
        title: 'Experience',
        items: [],
        visible: true,
        order: 0
      },
      {
        id: generateId(),
        type: SectionType.EDUCATION,
        title: 'Education',
        items: [],
        visible: true,
        order: 1
      },
      {
        id: generateId(),
        type: SectionType.SKILLS,
        title: 'Skills',
        items: [],
        visible: true,
        order: 2
      }
    ];
  }

  private getDefaultSectionTitle(type: SectionType): string {
    switch (type) {
      case SectionType.EXPERIENCE: return 'Experience';
      case SectionType.EDUCATION: return 'Education';
      case SectionType.SKILLS: return 'Skills';
      case SectionType.PROJECTS: return 'Projects';
      case SectionType.CERTIFICATES: return 'Certificates';
      case SectionType.LANGUAGES: return 'Languages';
      case SectionType.CUSTOM: return 'Custom Section';
      default: return 'New Section';
    }
  }
}