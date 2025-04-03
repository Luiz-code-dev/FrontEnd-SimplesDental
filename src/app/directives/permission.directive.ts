import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { UserRole } from '../models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input() appPermission: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    if (!this.appPermission) {
      this.viewContainer.clear();
      return;
    }

    const isAdminAction = ['admin', 'create', 'edit', 'delete'].includes(this.appPermission.toLowerCase());
    const permissionCheck = isAdminAction ? 
      this.permissionService.isAdmin() : 
      this.permissionService.hasPermission(UserRole.USER);

    permissionCheck
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (hasPermission) => {
          this.viewContainer.clear();
          if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          }
        },
        error: () => {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
