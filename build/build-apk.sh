#!/usr/bin/env bash
# Ehliyet Kankam UK — tek-dosya web uygulamasını gömülü WebView APK'sına derler.
# Gerekli: JDK, aapt/zipalign/apksigner (Debian android-sdk-build-tools),
#          android.jar (Maven Central: com.google.android:android),
#          dx (Maven Central: com.google.android.tools:dx).
# Google SDK sunucusu (dl.google.com) gerekmez.
set -e
WORK=$(mktemp -d); cd "$WORK"
curl -sSLo android.jar https://repo1.maven.org/maven2/com/google/android/android/4.1.1.4/android-4.1.1.4.jar
curl -sSLo dx.jar      https://repo1.maven.org/maven2/com/google/android/tools/dx/1.7/dx-1.7.jar
mkdir -p src/com/ehliyet/kankam assets res/drawable classes
python3 BUNDLE.py > assets/index.html   # css+js -> tek dosya (repo kökünden üretilir)
cp icons/icon-512.png res/drawable/icon.png
# ... AndroidManifest.xml + MainActivity.java (bkz. repo geçmişi) ...
javac -classpath android.jar -d classes --release 8 src/com/ehliyet/kankam/MainActivity.java
python3 -c "p='classes/com/ehliyet/kankam/MainActivity.class';b=bytearray(open(p,'rb').read());b[6]=0;b[7]=50;open(p,'wb').write(b)"  # Java6 -> eski dx uyumu
java -cp dx.jar com.android.dx.command.Main --dex --output=classes.dex classes
aapt package -f -M AndroidManifest.xml -S res -A assets -I android.jar -F app.apk
aapt add app.apk classes.dex
zipalign -f 4 app.apk aligned.apk
keytool -genkeypair -keystore d.ks -alias ek -storepass android -keypass android -keyalg RSA -validity 10000 -dname "CN=Ehliyet Kankam"
apksigner sign --ks d.ks --ks-pass pass:android --out Ehliyet-Kankam-UK.apk aligned.apk
apksigner verify --verbose Ehliyet-Kankam-UK.apk
