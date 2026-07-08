package com.ehliyet.kankam;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import java.lang.reflect.Method;
public class MainActivity extends Activity {
  private WebView w;
  private static void call(WebSettings s, String m, boolean v) {
    try { Method x = WebSettings.class.getMethod(m, boolean.class); x.invoke(s, v); } catch (Throwable t) {}
  }
  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    w = new WebView(this);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true);
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setAllowFileAccess(true);
    // API 16/17 — modern cihazlarda çalışır, yoksa sessizce atlanır
    call(s, "setAllowContentAccess", true);
    call(s, "setAllowFileAccessFromFileURLs", true);
    call(s, "setAllowUniversalAccessFromFileURLs", true);
    call(s, "setMediaPlaybackRequiresUserGesture", false);
    w.loadUrl("file:///android_asset/index.html");
    setContentView(w);
  }
  @Override public void onBackPressed() {
    if (w != null && w.canGoBack()) w.goBack(); else super.onBackPressed();
  }
}
