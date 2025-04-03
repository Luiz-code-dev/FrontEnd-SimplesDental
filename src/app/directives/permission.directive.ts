import { Directive, ElementRef, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { UserRole } from '../models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input() appPermission: string = '';
  private destroy$ = new Subject<void>();
  private elementReady = false;
  private pendingPermission: boolean | null = null;

  constructor(
    private el: ElementRef,
    private permissionService: PermissionService
  ) {}

  private setElementVisibility(visible: boolean) {
    if (this.elementReady && this.el?.nativeElement) {
      try {
        this.el.nativeElement.style.display = visible ? '' : 'none';
      } catch (error) {
        // Ignora erros silenciosamente
      }
    } else {
      this.pendingPermission = visible;
    }
  }

  ngOnInit() {
    if (!this.appPermission) {
      return;
    }

    let permissionCheck;

    switch (this.appPermission.toLowerCase()) {
      case 'admin':
      case 'create':
      case 'edit':
      case 'delete':
        permissionCheck = this.permissionService.isAdmin();
        break;
      case 'user':
      default:
        permissionCheck = this.permissionService.hasPermission(UserRole.USER);
    }

    permissionCheck
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (hasPermission) => {
          this.setElementVisibility(hasPermission);
        },
        error: () => {
          this.setElementVisibility(false);
        }
      });
  }

  ngAfterViewInit() {
    this.elementReady = true;
    if (this.pendingPermission !== null) {
      this.setElementVisibility(this.pendingPermission);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
