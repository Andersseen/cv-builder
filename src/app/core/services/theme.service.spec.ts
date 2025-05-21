import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { LocalStorageService } from './local-storage.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorageService: Partial<LocalStorageService>;

  beforeEach(() => {
    mockLocalStorageService = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };

    // Mock document.documentElement.classList
    // @ts-ignore
    jest.spyOn(document.documentElement.classList, 'add').mockImplementation(() => {});
    // @ts-ignore
    jest.spyOn(document.documentElement.classList, 'remove').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    });
    service = TestBed.inject(ThemeService);
  });

  describe('initialize', () => {
    it('should initialize with dark mode if saved in localStorage as true', () => {
      (mockLocalStorageService.getItem as jest.Mock).mockReturnValue('true');
      service.initialize();
      expect(service.darkMode()).toBe(true);
    });

    it('should initialize with light mode if saved in localStorage as false', () => {
      (mockLocalStorageService.getItem as jest.Mock).mockReturnValue('false');
      service.initialize();
      expect(service.darkMode()).toBe(false);
    });

    describe('when localStorage is null', () => {
      let originalMatchMedia: typeof window.matchMedia;

      beforeEach(() => {
        (mockLocalStorageService.getItem as jest.Mock).mockReturnValue(null);
        originalMatchMedia = window.matchMedia;
      });

      afterEach(() => {
        window.matchMedia = originalMatchMedia;
      });

      it('should initialize with dark mode if prefers-color-scheme is dark', () => {
        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(), // deprecated
          removeListener: jest.fn(), // deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));
        service.initialize();
        expect(service.darkMode()).toBe(true);
      });

      it('should initialize with light mode if prefers-color-scheme is not dark', () => {
        window.matchMedia = jest.fn().mockImplementation(query => ({
          matches: false, // Simulating (prefers-color-scheme: light) or no preference
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));
        service.initialize();
        expect(service.darkMode()).toBe(false);
      });
    });
  });

  describe('toggleDarkMode', () => {
    // Note: service.darkMode() is false by default when service is constructed.
    // The effect in constructor will call setItem with 'false'.

    it('should toggle dark mode from false (default) to true and save to localStorage', fakeAsync(() => {
      // Service is fresh, darkMode is false. Effect has run once in constructor.
      // Let's clear the setItem call from the constructor's effect.
      tick(); // Ensure constructor effect has completed
      (mockLocalStorageService.setItem as jest.Mock).mockClear(); 
      
      expect(service.darkMode()).toBe(false); // Initial state check

      service.toggleDarkMode(); // Signal changes from false to true
      tick(); // Allow effect (due to toggleDarkMode) to run

      expect(service.darkMode()).toBe(true);
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('cv-builder-theme', 'true');
    }));

    it('should toggle dark mode from true to false and save to localStorage', fakeAsync(() => {
      // Set initial state to true
      service.setDarkMode(true); // Signal changes to true
      tick(); // Allow effect (due to setDarkMode) to run. setItem will be called with 'true'.
      
      // Clear the setItem call from the above setDarkMode
      (mockLocalStorageService.setItem as jest.Mock).mockClear();
      expect(service.darkMode()).toBe(true); // Initial state check

      service.toggleDarkMode(); // Signal changes from true to false
      tick(); // Allow effect (due to toggleDarkMode) to run

      expect(service.darkMode()).toBe(false);
      expect(mockLocalStorageService.setItem).toHaveBeenCalledWith('cv-builder-theme', 'false');
    }));
  });
});
