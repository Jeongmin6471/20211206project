import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, Login, UserNoPW } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  prepEndpoint(ep) {
    // 1. 로컬 서버에서 개발시
    // return 'http://localhost:3000/' + ep;
    // 2. 클라우드 서버에서 운영시
    return ep;
    }

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  registerUser(user: User): Observable<any> {
    // const registerUrl = 'http://localhost:3000/users/register';
    const registerUrl = this.prepEndpoint('users/register');
    return this.http.post<any>(registerUrl, user, httpOptions);
  }

  registerCard(card: any): Observable<any> {
    const registerCardUrl = this.prepEndpoint('users/card');
    return this.http.post<any>(registerCardUrl, card, httpOptions);
  }
    

  authenticateUser(login: Login): Observable<any> {
    // const loginUrl = 'http://localhost:3000/users/authenticate';
    const loginUrl = this.prepEndpoint('users/authenticate');
    return this.http.post<any>(loginUrl, login, httpOptions);
  }

  storeUserData(token: any, userNoPW: UserNoPW) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userNoPW', JSON.stringify(userNoPW));
  }

  logout() {
    // localStorage.clear();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userNoPW');
  }

  getProfile(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    // 토큰을 포함한 헤더 옵션 생성
    const httpOptions1 = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json', 
    Authorization: 'Bearer ' + authToken,
    }),
    };

    
    // const profileUrl = 'http://localhost:3000/users/profile';
    const profileUrl = this.prepEndpoint('users/profile');
    return this.http.get<any>(profileUrl, httpOptions1);
    }

    // Show user list (just testing DB query)
  getList(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    const httpOptions1 = {
    headers: new HttpHeaders({
      contentType: 'application/json',
      authorization: 'Bearer ' + authToken,
    }),
    };
    const listUrl = this.prepEndpoint('users/list');
    return this.http.get<any>(listUrl, httpOptions1);
    }

    // 사용자의 명함을 읽어오는 함수
    getCard(username: any): Observable<any> {
      let authToken: any = localStorage.getItem('authToken');
      const httpOptions1 = {
      headers: new HttpHeaders({
      contentType: 'application/json',
      authorization: 'Bearer ' + authToken,
      }),
      };
      const myCardUrl = this.prepEndpoint('users/myCard');
      return this.http.post<any>(myCardUrl, username, httpOptions1);
      }

    // 환율정보얻어오기
    getRate(): Observable<any> {
      const APIKey= 'f0a89912fb1bb0230252085a04b4b024';
      return this.http.get<any>(
        `http://api.exchangeratesapi.io/v1/latest?access_key=${APIKey}`
        );
      }

    loggedIn(): boolean {
      let authToken: any = localStorage.getItem('authToken');
      return !this.jwtHelper.isTokenExpired(authToken);
      }
      
    
}
