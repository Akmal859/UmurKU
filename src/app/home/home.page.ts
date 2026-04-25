import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class HomePage {
  birthDate: string = '';
  ageYears: number | null = null;
  ageMonths: number = 0;
  ageDays: number = 0;

  constructor() {}

  // Memastikan sinkronisasi data di HP
  onDateChange(event: any) {
    this.birthDate = event.detail.value;
  }

  calculateAge() {
    if (this.birthDate) {
      const today = new Date();
      const birth = new Date(this.birthDate);

      if (birth > today) {
        alert("Tanggal lahir tidak boleh di masa depan!");
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
    } else {
      alert("Pilih tanggal dulu bosku!");
    }
  }
}