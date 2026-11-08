package de.heikeamthor.lesespiele;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;

/** Only user-selected documents. No broad storage permission or cloud login. */
@CapacitorPlugin(name = "MemoryDocuments")
public class DocumentsPlugin extends Plugin {
    private static final int MAX_BYTES = 32 * 1024 * 1024;
    private boolean selecting = false;
    private String pendingText;

    @PluginMethod
    public void save(PluginCall call) {
        String text = call.getString("text"), name = call.getString("name", "Memory-Lesen-Sicherung.json");
        if (text == null || text.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES) {
            call.reject("Die Sicherung fehlt oder ist größer als 32 MB."); return;
        }
        if (selecting) { call.reject("Bitte zuerst den geöffneten Dateidialog schließen."); return; }
        pendingText = text;
        call.getData().remove("text"); // Never serialize children's data into Android saved-instance bundles.
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, name.replaceAll("[/\\\\]", "-"));
        selecting = true;
        try { startActivityForResult(call, intent, "saveResult"); }
        catch (ActivityNotFoundException ex) { selecting = false; pendingText = null; call.reject("Auf diesem Gerät ist kein Dateidialog verfügbar."); }
    }

    @ActivityCallback
    private void saveResult(PluginCall call, ActivityResult result) {
        selecting = false;
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            pendingText = null; call.resolve(new JSObject().put("cancelled", true)); return;
        }
        Uri uri = result.getData().getData();
        final String content = pendingText; pendingText = null;
        if (content == null) { call.reject("Die App wurde während der Auswahl neu gestartet. Bitte die Sicherung erneut speichern."); return; }
        // No file contents in logs or saved activity-instance state.
        getBridge().execute(() -> {
            try {
                try (OutputStream out = getContext().getContentResolver().openOutputStream(uri, "w")) {
                if (out == null) throw new java.io.IOException();
                out.write(content.getBytes(StandardCharsets.UTF_8));
                out.flush();
                }
                call.resolve(new JSObject().put("cancelled", false));
            } catch (Exception ex) { call.reject("Die Datei konnte nicht vollständig gespeichert werden. Bitte Speicherort und Verbindung prüfen."); }
        });
    }

    @PluginMethod
    public void open(PluginCall call) {
        if (selecting) { call.reject("Bitte zuerst den geöffneten Dateidialog schließen."); return; }
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        // Some cloud providers report JSON as plain text/octet-stream. Validation happens before import.
        intent.setType("*/*");
        selecting = true;
        try { startActivityForResult(call, intent, "openResult"); }
        catch (ActivityNotFoundException ex) { selecting = false; call.reject("Auf diesem Gerät ist kein Dateidialog verfügbar."); }
    }

    @ActivityCallback
    private void openResult(PluginCall call, ActivityResult result) {
        selecting = false;
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve(new JSObject().put("cancelled", true)); return;
        }
        Uri uri = result.getData().getData();
        getBridge().execute(() -> {
            try (InputStream in = getContext().getContentResolver().openInputStream(uri); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                if (in == null) throw new java.io.IOException();
                byte[] buffer = new byte[16384]; int count;
                while ((count = in.read(buffer)) != -1) {
                    if (out.size() + count > MAX_BYTES) throw new java.io.IOException("size");
                    out.write(buffer, 0, count);
                }
                String text = StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(out.toByteArray())).toString();
                String name = "Sicherungsdatei.json";
                try (Cursor cursor = getContext().getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
                    if (cursor != null && cursor.moveToFirst() && !cursor.isNull(0)) name = cursor.getString(0);
                }
                call.resolve(new JSObject().put("cancelled", false).put("text", text).put("name", name));
            } catch (Exception ex) { call.reject("Die Datei konnte nicht gelesen werden. Bitte eine UTF-8-JSON-Sicherung bis 32 MB auswählen und die Verbindung zum Speicherort prüfen."); }
        });
    }

    @PluginMethod
    public void openExternal(PluginCall call) {
        String value = call.getString("url", "");
        Uri uri = Uri.parse(value);
        boolean web = "https".equals(uri.getScheme()) && "lesespiele.heike-amthor.de".equals(uri.getHost());
        boolean mail = value.equals("mailto:lesespiele.heike.amthor@gmx.de");
        if (!web && !mail) { call.reject("Diese Adresse wird nicht unterstützt."); return; }
        try {
            getActivity().startActivity(new Intent(mail ? Intent.ACTION_SENDTO : Intent.ACTION_VIEW, uri));
            call.resolve();
        } catch (ActivityNotFoundException ex) { call.reject(mail ? "Bitte zuerst eine E-Mail-App einrichten." : "Auf diesem Gerät ist kein Browser verfügbar."); }
    }
}
