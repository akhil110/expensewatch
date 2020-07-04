import { async, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
	let fixture: any;
	let component: any;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AboutComponent
			]
		}).compileComponents();
		fixture = TestBed.createComponent(AboutComponent);
		component = fixture.debugElement.componentInstance;
	}));

	describe('Test: Component', () => {
		it ('should be initialized', () => {
			expect(fixture).toBeTruthy();
			fixture.detectChanges();
			const compiled = fixture.debugElement.nativeElement;
			const h1 = compiled.querySelector('h1');
			expect(h1.textContent).toContain('Expense Watch');
			const p = compiled.querySelector('p');
			expect(p.textContent).toContain('A sample MEAN app which can be used as a starting template for your real world Apps!');
		});
	});
});
