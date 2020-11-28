import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRestaurantDialogComponent } from './tag-restaurant-dialog.component';

describe('TagRestaurantDialogComponent', () => {
  let component: TagRestaurantDialogComponent;
  let fixture: ComponentFixture<TagRestaurantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagRestaurantDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRestaurantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
