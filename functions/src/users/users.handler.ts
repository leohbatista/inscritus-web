import * as firebase from 'firebase-admin';
import * as _ from "lodash";
import { UsersResult } from './user.model';

export const searchUsers = ({ 
  filterField,
  filterValue,
  orderField = 'name',
  orderDirection = 'asc',
  page = 0,
  pageSize = 10
}: {
  filterField?: string;
  filterValue?: string;
  orderField?: string;
  orderDirection?: ('asc' | 'desc');
  page?: number;
  pageSize?: number;
}): Promise<UsersResult> => {
  return new Promise((resolve, reject) => {
    console.log('Users Search');
    console.log('Field:', filterField);
    console.log('Search:', filterValue);
    console.log('Page:', page);

    Promise.all([
      firebase.firestore().collection(`users`).get(),
    ]).then(snapshots => {
      if(!snapshots[0].empty) {
        let results = _.filter(snapshots[0].docs.map(d => d.data()), doc => {
          if(!filterField || !filterValue) {
            return true;
          } else if(filterField !== 'type') {
            return doc[filterField].replace(/\W/g,'').toUpperCase().indexOf(filterValue.replace(/\W/g,'').toUpperCase()) >= 0;
          } else if(filterValue === 'admin') {
            return doc.isAdmin;
          } else {
            return !doc.isAdmin;
          }
        });
        
        results = _.sortBy(results, [orderField]);
  
        if(orderDirection === 'desc') {
          _.reverse(results);
        }        
  
        const total = results.length;
  
        let retPage = page;
  
        if(page < 0 || page > Math.ceil(total / pageSize)) retPage = 0;
  
        results = _.slice(results, retPage * pageSize, (retPage + 1) * pageSize);
  
        resolve({
          page: retPage,
          pageSize,
          total,
          results,
        })
      } else {
        console.error('Users Search - Cannot get users');
        reject(new Error('Cannot get users'));
      }
    }).catch(err => {
      console.error('Users Search - Error searching users', err);
      reject(err)
    });
  })
}

export const getUserByEmail = (userEmail: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection(`users`).where('email', '==', userEmail).get().then(result => {
      if (!result.empty) {
        const userData = result.docs[0]?.data();
        resolve(userData);
      } else {
        resolve();
      }
    }).catch(err => {
      console.log('Error getting user by e-mail.', err);
      reject(err);
    });
  });
}