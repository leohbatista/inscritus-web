import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';

import { Post } from 'functions/src/feed/feed.model';
import { FeedService } from 'src/app/services/feed.service';
import { User } from 'functions/src/users/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {

  isLoading = true;

  isCreateMode = false;
  editMode = [];

  posts: Post[];
  postSubscription: Subscription;

  user: User;
  userSubscription: Subscription;

  newPost = {
    title: '',
    message: '',
  };

  constructor(
    private authService: AuthService,
    private feedService: FeedService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.postSubscription = this.feedService.getPosts().subscribe((posts: Post[]) => {
      this.posts = _.reverse(_.sortBy(posts, p => p.postedAt));
      this.editMode = this.posts?.map(p => ({
        enabled: false,
        data: {
          title: p.title,
          message: p.message,
        }
      })) || [];
      this.isLoading = false;
    });

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    if (this.postSubscription) { this.postSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  cancelPost(): void {
    this.isCreateMode = false;
    this.clearNewPost();
  }

  publishPost(): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar publicação',
        alertDescription: 'Deseja realmente publicar este aviso?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        const post = {
          ...this.newPost,
          publisher: {
            uid: this.user.uid,
            email: this.user.email
          }
        };

        this.feedService.createPost(post).then(() => {
          this.isCreateMode = false;
          this.clearNewPost();
          this.snackbar.open('Aviso publicado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating post', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao publicar',
              alertDescription: 'Não foi possível publicar o aviso. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  clearNewPost(): void {
    this.newPost.title = '';
    this.newPost.message = '';
  }

  deletePost(postId): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Confirmar exclusão',
        alertDescription: 'Deseja realmente excluir este aviso?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.feedService.deletePost(postId).then(() => {
          this.snackbar.open('Aviso excluído!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating post', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao excluir',
              alertDescription: 'Não foi possível excluir o aviso. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  savePost(postId, i): void {
    const confirmSubscription = this.dialog.open(AlertDialogComponent, {
      maxWidth: '600px',
      data: {
        alertTitle: 'Salvar aviso',
        alertDescription: 'Deseja realmente salvar as alterações neste aviso?',
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.feedService.editPost(postId, this.editMode[i].data).then(() => {
          this.isCreateMode = false;
          this.clearNewPost();
          this.snackbar.open('Aviso editado!', null, {
            duration: 2000,
          });
        }).catch(err => {
          console.error('Error creating post', err);

          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Erro ao salvar',
              alertDescription: 'Não foi possível editar o aviso. Tente novamente mais tarde.',
              isOnlyConfirm: true,
            }
          });
        });
      }

      if (confirmSubscription) { confirmSubscription.unsubscribe(); }
    });
  }

  cancelEditPost(i: number): void {
    this.editMode[i] = {
      enabled: false,
      data: {
        title: this.posts[i]?.title || '',
        message: this.posts[i]?.message || '',
      }
    };
  }
}
