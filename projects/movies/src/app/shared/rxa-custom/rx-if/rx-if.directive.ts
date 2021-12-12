import { RxViewContext } from '@rx-angular/cdk';
import { RxBaseTemplateNames, rxBaseTemplateNames } from '@rx-angular/cdk';

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  NextObserver,
  Observable, ObservableInput,
  ReplaySubject,
  Subject,
  Subscription
} from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  createTemplateManager,
  RxTemplateManager
} from '@rx-angular/cdk';
import {  RxStrategyProvider } from '@rx-angular/cdk';
import { coerceAllFactory } from '@rx-angular/cdk/coercing';
import {
  createTemplateNotifier,
  RxNotificationKind,
} from '@rx-angular/cdk/notifications';
import { coerceObservable } from '@rx-angular/cdk/coercing';



export interface RxIfViewContext extends RxViewContext<boolean> {
  // to enable `as` syntax we have to assign the directives selector (var as v)
  rxIf: boolean | undefined;
  rxElse?: boolean;
}

export type rxIfTemplateNames = 'rxThen' | 'rxElse' | rxBaseTemplateNames;

export const RxIfTemplateNames = {
  ...RxBaseTemplateNames,
  then: 'rxThen',
  else: 'rxElse'
} as const;


@Directive({
  selector: '[rxIf]',
})
export class RxIf implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private _renderObserver: NextObserver<any> | undefined;
  private templateManager!: RxTemplateManager<boolean, RxIfViewContext, rxIfTemplateNames>;

  @Input()
  set rxIf(potentialObservable: Observable<boolean> | boolean | null | undefined) {
    this.observablesHandler.next(coerceObservable(potentialObservable as any));
  }

  @Input('rxIfStrategy')
  set strategy(strategyName: ObservableInput<string> | string | null | undefined) {
      this.strategyHandler.next(strategyName+'');
  }

  @Input('rxIfElse')
  set else(templateRef: TemplateRef<any>) {
    if (templateRef) {
      this.templateManager.addTemplateRef(RxIfTemplateNames.else, templateRef);
    }
  }

  @Input('rxIfParent') renderParent: boolean | undefined;

  @Input('rxIfPatchZone') patchZone: boolean | undefined;

  @Input('rxIfRenderCallback')
  set renderCallback(callback: NextObserver<boolean>) {
    this._renderObserver = callback;
  }

  /** @internal */
  private observablesHandler = createTemplateNotifier<boolean>();
  private readonly strategyHandler = coerceAllFactory<string>(
    () => new ReplaySubject<string | ObservableInput<string>>(1),
    mergeAll()
  );
  private readonly rendered$ = new Subject<void>();

  constructor(
    private strategyProvider: RxStrategyProvider,
    private cdRef: ChangeDetectorRef,
    private eRef: ElementRef<Comment>,
    private ngZone: NgZone,
    private readonly thenTemplateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.templateManager = createTemplateManager<
      boolean,
      RxIfViewContext,
      rxIfTemplateNames
      >({
      templateSettings: {
        viewContainerRef: this.viewContainerRef,
        createViewContext,
        updateViewContext,
        customContext: (rxIf: boolean) => ({ rxIf }),
        patchZone: this.patchZone ? this.ngZone : false,
      },
      renderSettings: {
        cdRef: this.cdRef,
        eRef: this.eRef,
        parent: coerceBooleanProperty(this.renderParent),
        patchZone: this.patchZone ? this.ngZone : false,
        defaultStrategyName: this.strategyProvider.primaryStrategy,
        strategies: this.strategyProvider.strategies,
      },
      notificationToTemplateName: {
        [RxNotificationKind.Suspense]: () => RxIfTemplateNames.suspense,
        [RxNotificationKind.Next]: (value: any, templates: any) => {
          return value
            ? (RxIfTemplateNames.then as rxIfTemplateNames)
            : templates.get(RxIfTemplateNames.else)
              ? RxIfTemplateNames.then
              : undefined as any;
        },
        [RxNotificationKind.Error]: () => RxIfTemplateNames.error,
        [RxNotificationKind.Complete]: () => RxIfTemplateNames.complete,
      },
    });
    this.templateManager.addTemplateRef(
      RxIfTemplateNames.then,
      this.thenTemplateRef
    );
    this.templateManager.nextStrategy(this.strategyHandler.values$);

  }

  ngOnInit() {

    this.subscription.add(
      this.templateManager
        .render(this.observablesHandler.values$)
        .subscribe((n) => {
          this.rendered$.next(n);
          this._renderObserver?.next(n);
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

function createViewContext(value: boolean): RxIfViewContext {
  return {
    rxIf: value,
    rxElse: false,
    $implicit: value,
    $error: false,
    $complete: false,
    $suspense: false,
  };
}

function updateViewContext(
  _: any,
  view: any,
  context: any
): void {
  type K = keyof RxIfViewContext;
  Object.keys(context).forEach((k: any) => {
    view.context[k as K] = context[k as K];
  });
}
