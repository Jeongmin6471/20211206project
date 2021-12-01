import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  username: string;
  name: string;
  org: string;
  title: string;
  tel: string;
  fax: string;
  mobile: string;
  email: string;
  homepage: string;
  address: string;
  zip: string;

  constructor(
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {
    const userNoPW: any = localStorage.getItem('userNoPW');
    this.username = JSON.parse(userNoPW).username;
    let cardInfo: any = localStorage.getItem('card');
  if (cardInfo !== null) {
  const card = JSON.parse(cardInfo);
    this.name = card.name;
    this.org = card.org;
    this.title = card.title;
    this.tel = card.tel;
    this.fax = card.fax;
    this.mobile = card.mobile;
    this.email = card.email;
    this.homepage = card.homepage;
    this.address = card.address;
    this.zip = card.zip;
  }
}

onRegisterCardSubmit() {
  const card: any = {
  username: this.username,
  name: this.name,
  org: this.org,
  title: this.title,
  tel: this.tel,
  fax: this.fax,
  mobile: this.mobile,
  email: this.email,
  homepage: this.homepage,
  address: this.address,
  zip: this.zip,
  };
  
  // 서버에 명함 등록 요청/응답
  this.authService.registerCard(card).subscribe((data) => {
    if (data.success) {
      this.flashMessage.show(data.msg, {
      cssClass: 'alert-success',
      timeout: 3000,
    });
    this.router.navigate(['/dashboard']);
  } else {
    this.flashMessage.show(data.msg, {
      cssClass: 'alert-danger',
      timeout: 3000,
      });
      this.router.navigate(['/card']);
      }
    });
  }
  }

