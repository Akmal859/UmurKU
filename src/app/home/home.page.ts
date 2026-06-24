import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('nativeDateInput') nativeDateInput!: ElementRef<HTMLInputElement>;

  birthDate: string = '';
  ageYears: number | null = null;
  ageMonths: number = 0;
  ageDays: number = 0;
  nextBirthdayDays: number | null = null;
  zodiacSign: string = '';
  breathCount: number = 0;

  // Batas maksimal tanggal (hari ini) agar tidak bisa pilih masa depan
  todayStr: string = new Date().toISOString().split('T')[0];

  constructor(private platform: Platform) {}

  ngOnInit() {
    if (this.platform.is('android')) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        App.exitApp();
      });
    }
  }

  // Membuka date picker native Android dengan .showPicker() atau .click()
  openDatePicker() {
    const input = this.nativeDateInput?.nativeElement;
    if (!input) return;
    try {
      // showPicker() = cara modern (Chrome 99+ / Android WebView terbaru)
      (input as any).showPicker();
    } catch (e) {
      // Fallback untuk WebView lama
      input.click();
    }
  }

  // Dipanggil saat user memilih tanggal dari native picker
  onNativeDateChange(event: any) {
    this.birthDate = event.target.value;
    if (!this.birthDate) {
      this.resetData();
    }
  }

  // Format tanggal dari "yyyy-mm-dd" (format native) → "dd / mm / yyyy" (tampilan)
  getFormattedDate(): string {
    if (!this.birthDate) return '';
    const parts = this.birthDate.split('-');
    if (parts.length !== 3) return this.birthDate;
    return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
  }

  resetData() {
    this.ageYears = null;
    this.ageMonths = 0;
    this.ageDays = 0;
    this.nextBirthdayDays = null;
    this.zodiacSign = '';
    this.breathCount = 0;
  }

  calculateAge() {
    if (!this.birthDate || this.birthDate === '') {
      alert("Waduh bosku, isi dulu tanggal lahirnya! 🙏");
      this.resetData();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let birth: Date;
    if (this.birthDate.includes('-')) {
      const parts = this.birthDate.split('-');
      birth = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      birth = new Date(this.birthDate);
    }
    birth.setHours(0, 0, 0, 0);

    if (!(birth instanceof Date) || isNaN(birth.getTime())) {
      alert("Tanggal lahir tidak valid. Silakan pilih tanggal yang benar.");
      this.resetData();
      return;
    }

    if (birth > today) {
      alert("Masa kamu lahir di masa depan? 😅");
      this.resetData();
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