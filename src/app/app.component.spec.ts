import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(async () => {
    originalMatchMedia = window.matchMedia; // Store original
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false, // Default mock behavior
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule], // AppComponent is standalone, import RouterTestingModule
    })
    .overrideComponent(AppComponent, {
      set: {
        imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent], // Child components
        schemas: [NO_ERRORS_SCHEMA] // To ignore errors from unmocked/undeclared child components
      }
    })
    .compileComponents();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia; // Restore original
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
