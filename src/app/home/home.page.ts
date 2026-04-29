import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class HomePage implements OnInit {
  birthDate: string = '';
  ageYears: number | null = null;
  ageMonths: number = 0;
  ageDays: number = 0;
  nextBirthdayDays: number | null = null;
  zodiacSign: string = '';
  breathCount: number = 0;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    });
  }

  onDateChange(event: any) {
    this.birthDate = event.detail.value;
  }

  calculateAge() {
    // VALIDASI: Jika input kosong
    if (!this.birthDate || this.birthDate === '') {
      alert("Waduh bosku, isi dulu tanggal lahirnya! 🙏");
      return;
    }

    const today = new Date();
    const birth = new Date(this.birthDate);

    // VALIDASI: Jika tanggal lahir di masa depan
    if (birth > today) {
      alert("Masa kamu lahir di masa depan? 😅");
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    this.ageYears = years;
    this.ageMonths = months;
    this.ageDays = days;

    let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    this.nextBirthdayDays = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    this.zodiacSign = this.getZodiac(birth.getDate(), birth.getMonth() + 1);
    this.breathCount = years * 525600; 
  }

  getZodiac(day: number, month: number) {
    const signs = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
    const last_days = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
    return (day > last_days[month - 1]) ? signs[month % 12] : signs[month - 1];
  }
}