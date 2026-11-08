package de.heikeamthor.lesespiele;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DocumentsPlugin.class);
        super.onCreate(savedInstanceState);
    }
    @Override public void onPause() {
        super.onPause();
        if (getBridge() != null) { getBridge().getWebView().onPause(); getBridge().getWebView().pauseTimers(); }
    }
    @Override public void onResume() {
        if (getBridge() != null) { getBridge().getWebView().resumeTimers(); getBridge().getWebView().onResume(); }
        super.onResume();
    }
}
