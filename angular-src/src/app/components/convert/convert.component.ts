  import { Component, OnInit} from '@angular/core';
  import { AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})

export class ConvertComponent implements OnInit {
  amountFrom: number = 1; // 바꿀금액
  amountTo: number; // 바뀐금액
  from: string = 'USD'; // 바꿀통화명
  to: string = 'KRW'; // 바뀐통화명
  rates: { [key: string]: number }; // 전체통화별환율정보
  rate: number; // 현재선택된통화끼리의환율

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.loadRates();
  }// 모든통화명배열출력
  getAllCurrencies(): string[] {
    return Object.keys(this.rates);
  }

  // 페이지로드시초기환율정보얻어옴
  loadRates() {
    this.authService.getRate().subscribe((data) => {
      this.rates= data.rates;
      this.rate= this.rates[this.to] / this.rates[this.from];
      this.convert();
    });
  }
  
  // 통화를변경시환율을바꾸고환전
    changeCurrency() {
      this.rate= this.rates[this.to] / this.rates[this.from];
      this.convert();
    }
      
      // 현재선택된통화끼리환전
      convert(): void {
        this.amountTo= this.amountFrom * this.rate;
      }
      
      // 현재선택된통화끼리역환전
      convertR(): void {
        this.amountFrom= this.amountTo/ this.rate;
      }
}