import { SearchLabelsComponent } from './search-labels.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SearchService } from '../search-service/search.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchServiceStub } from '../../shared/testing/search-service-stub';
import { of as observableOf } from 'rxjs';
import { ObjectKeysPipe } from '../../shared/utils/object-keys-pipe';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';

describe('SearchLabelsComponent', () => {
  let comp: SearchLabelsComponent;
  let fixture: ComponentFixture<SearchLabelsComponent>;

  const searchLink = '/search';
  let searchService;

  const field1 = 'author';
  const field2 = 'subject';
  const value1 = 'Test, Author';
  const value2 = 'TestSubject';
  const filter1 = [field1, value1];
  const filter2 = [field2, value2];
  const mockFilters = [
    filter1,
    filter2
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchLabelsComponent, ObjectKeysPipe],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: SEARCH_CONFIG_SERVICE, useValue: { getCurrentFrontendFilters: () => observableOf(mockFilters) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchLabelsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelsComponent);
    comp = fixture.componentInstance;
    searchService = (comp as any).searchService;
    (comp as any).appliedFilters = observableOf(mockFilters);
    fixture.detectChanges();
  });

  describe('when the component has been initialized', () => {
    it('should return all params but the provided filter', () => {
      comp.appliedFilters.subscribe((filters) => {
        expect(filters).toBe(mockFilters);
      });
    })
  });
});
