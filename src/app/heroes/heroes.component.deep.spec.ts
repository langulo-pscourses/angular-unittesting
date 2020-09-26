import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from './heroes.component';

describe('HeroesComponent (deep)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let HEROES: Hero[];
  let mockHeroSvc;

  beforeEach(() => {
    // ensure there's a new copy of the data before every test
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'Wonderful woman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 },
    ];
    // mock the service and use the longform provider syntax to use it instead of the real one
    mockHeroSvc = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroSvc }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('Should render each hero as a Hero component', () => {
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // to run change detection on all children
    // Gets the debug DOM elements, not the component instance
    const childrenDE = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    expect(childrenDE.length).toEqual(HEROES.length);
    for (let i = 0; i < childrenDE.length; i++) {
      const hero = childrenDE[i].componentInstance.hero;
      expect(hero.name).toEqual(HEROES[i].name);
    }
  });

  it('Should call heroService.deleteHero when the HeroComponent delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete'); // watch the delete method
    mockHeroSvc.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    // emit the event by activating the button on the template
    /*
    heroComponents[0]
      .query(By.css('button'))
      .triggerEventHandler('click', { stopPropagation: () => {} });
    */
    // emit the event by calling the delete method on the component directly
    heroComponents[0].componentInstance.delete.emit(undefined); // the template binding is keeping the reference to the right hero
    // Check that delete was called with the first hero
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });
});