import {Component} from '@angular/core';
import {Headers, RequestOptions, Http} from '@angular/http';

import {FacebookService, FacebookLoginResponse, FacebookLoginOptions, FacebookUiParams} from 'ng2-facebook-sdk';


// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  title = 'Helloworld';
  token = '';

  constructor(private fb: FacebookService, private http: Http) {

    console.log('Initializing Facebook');

    fb.init({
      appId: '<TODO>',
      version: 'v2.8'
    });

  }

  /**
   * Login with minimal permissions. This allows you to see their public profile only.
   */
  login() {
    this.fb.login()
      .then((res: FacebookLoginResponse) => {
        console.log('Logged in', res);
        this.token = res.authResponse.accessToken;
      })
      .catch(this.handleError);
  }


  getProtected() {

    let header: Headers = new Headers();
    console.log('token is ', this.token);
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Bearer ' + this.token);
    let options = new RequestOptions({headers: header});

    this.http.get('http://localhost:3000/protected', options)
      .toPromise()
      .then((res) => {
        console.log('response from server', res.status);
        if (res.status == 200) {
          console.log('read ', res.json());
          return res.json();
        } else if (res.status == 401) {
          return null;
        } else {
          throw new Error('This request has failed ' + res.status);
        }
      })
      .catch(err => console.error('got error', err));
  }

  getProtectedWrongToken() {

    let wrongToken = this.token.substr(0, this.token.length - 2) + 'f';
    let header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Bearer ' + wrongToken);
    let options = new RequestOptions({headers: header});

    this.http.get('http://localhost:3000/protected', options)
      .toPromise()
      .then((res) => {
        console.log('response from server', res.status);
        if (res.status == 200) {
          console.log('read ', res.json());
          return res.json();
        } else if (res.status == 401) {
          return null;
        } else {
          throw new Error('This request has failed ' + res.status);
        }
      })
      .catch(err => console.error('got error', err));
  }

  /**
   * This is a convenience method for the sake of this example project.
   * Do not use this in production, it's better to handle errors separately.
   * @param error
   */
  private handleError(error) {
    console.error('Error processing action', error);
  }

}
