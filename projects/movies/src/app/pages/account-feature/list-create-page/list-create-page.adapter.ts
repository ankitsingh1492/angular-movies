import { Injectable } from '@angular/core';
import { patch } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { map, startWith, withLatestFrom } from 'rxjs';

import { TMDBListCreateUpdateParams } from '../../../data-access/api/model/list.model';
import { ListDetailAdapter } from '../../../pages/account-feature/list-detail-page/list-detail-page.adapter';
import { getActions } from '../../../shared/rxa-custom/actions';
import { ListState } from '../../../shared/state/list.state';

interface Actions {
  submit: void;
  update: { [key: string]: string };
}

enum FormMode {
  Create = 'create',
  Edit = 'edit',
}

@Injectable({
  providedIn: 'root',
})
export class ListCreatePageAdapter extends RxState<{
  mode: FormMode;
  request: TMDBListCreateUpdateParams;
}> {
  readonly ui = getActions<Actions>();

  readonly showHeader$ = this.select(
    map((state) => state.mode === FormMode.Create)
  );
  readonly name$ = this.select('request', 'name');
  readonly description$ = this.select('request', 'description');
  readonly valid$ = this.select(map((state) => !!state?.request?.name?.length));
  readonly private$ = this.select('request', 'private');

  private readonly submitEvent$ = this.ui.submit$.pipe(
    withLatestFrom(this.select())
  );

  constructor(
    private state: ListState,
    private detailsAdapter: ListDetailAdapter
  ) {
    super();

    this.connect('request', this.ui.update$, (state, update) => {
      if (update['private']) {
        update['private'] = JSON.parse(update['private']);
      }

      return patch(state.request, update);
    });

    this.connect(
      this.detailsAdapter.listDetails$.pipe(
        map((list) => ({
          request: {
            name: list.name || '',
            description: list.description || '',
            iso_639_1: 'en',
            private: Boolean(list.private),
          },
          mode: FormMode.Edit,
        })),
        startWith({
          request: {
            name: '',
            description: '',
            iso_639_1: 'en',
            private: true,
          },
          mode: FormMode.Create,
        })
      )
    );

    this.hold(this.submitEvent$, ([_, state]) => {
      if (state.mode === 'edit') {
        this.detailsAdapter.ui.listInfoUpdate(state.request);
      }

      if (state.mode === 'create') {
        this.state.createList(this.get('request'));
      }
    });
  }

  resetForm() {
    this.set({
      mode: FormMode.Create,
      request: {
        name: '',
        description: '',
        iso_639_1: 'en',
        private: true,
      },
    });
  }
}
