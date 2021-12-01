import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    name: string;
    username: string;
    email: string;
constructor(private authService: AuthService) {}
ngOnInit(): void {
this.authService.getProfile().subscribe(
(profile) => {
    this.name = profile.userNoPW.name;
    this.username = profile.userNoPW.username;
    this.email = profile.userNoPW.email;
},
(err) => {
console.log(err);
return false;
}
);
}
}
