package com.Akmal.kalkulator;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // WAJIB dipanggil SEBELUM super.onCreate()
        // Ini adalah kunci agar splash screen tampil konsisten di semua versi Android.
        // Pada Android 12+: mengontrol SplashScreen API native.
        // Pada Android < 12: mensimulasikan splash screen via tema windowBackground.
        SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);
    }
}

