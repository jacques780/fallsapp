# Falls Wholesale App

# Falls Wholesale App

FAILURE: Build failed with an exception.

- What went wrong:
  Execution failed for task ':app:processDebugResources'.
  > A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
  > Android resource linking failed
       /home/moccax1/Documents/Projects/Ionic/FallsWholesaleApp/platforms/android/app/src/main/AndroidManifest.xml:18:9-20:20: AAPT: error: unexpected element <provider> found in <manifest>.

editing platform/android/android.json

move the block services.plugins.videocaptureplus.provider from parents to application

```html
"AndroidManifest.xml": {
        "parents": {
          "/*": [
            {
              "xml": "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\" />",
              "count": 2
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />",
              "count": 1
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.CALL_PHONE\" />",
              "count": 1
            },
            {
              "xml": "<uses-feature android:name=\"android.hardware.telephony\" android:required=\"false\" />",
              "count": 1
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.RECORD_AUDIO\" />",
              "count": 1
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.CAMERA\" />",
              "count": 1
            },
            {
              "xml": "<provider android:authorities=\"nl.x-services.plugins.videocaptureplus.provider\" android:exported=\"false\" android:grantUriPermissions=\"true\" android:name=\"android.support.v4.content.FileProvider\"><meta-data android:name=\"android.support.FILE_PROVIDER_PATHS\" android:resource=\"@xml/provider_paths\" /></provider>",
              "count": 1
            }
          ],
          "application": [
            {
              "xml": "<provider android:authorities=\"${applicationId}.cordova.plugin.camera.provider\" android:exported=\"false\" android:grantUriPermissions=\"true\" android:name=\"org.apache.cordova.camera.FileProvider\"><meta-data android:name=\"android.support.FILE_PROVIDER_PATHS\" android:resource=\"@xml/camera_provider_paths\" /></provider>",
              "count": 1
            }
          ],
          ...
```

change into this

```html
"AndroidManifest.xml": {
        "parents": {
          "/*": [
            {
              "xml": "<uses-permission android:name=\"android.permission.WRITE_EXTERNAL_STORAGE\" />",
              "count": 2
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\" />",
              "count": 1
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.CALL_PHONE\" />",
              "count": 1
            },
            {
              "xml": "<uses-feature android:name=\"android.hardware.telephony\" android:required=\"false\" />",
              "count": 1
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.RECORD_AUDIO\" />",
              "count": 1
            },
            {
              "xml": "<uses-permission android:name=\"android.permission.CAMERA\" />",
              "count": 1
            }
          ],
          "application": [
            {
              "xml": "<provider android:authorities=\"${applicationId}.cordova.plugin.camera.provider\" android:exported=\"false\" android:grantUriPermissions=\"true\" android:name=\"org.apache.cordova.camera.FileProvider\"><meta-data android:name=\"android.support.FILE_PROVIDER_PATHS\" android:resource=\"@xml/camera_provider_paths\" /></provider>",
              "count": 1
            },
            {
              "xml": "<provider android:authorities=\"nl.x-services.plugins.videocaptureplus.provider\" android:exported=\"false\" android:grantUriPermissions=\"true\" android:name=\"android.support.v4.content.FileProvider\"><meta-data android:name=\"android.support.FILE_PROVIDER_PATHS\" android:resource=\"@xml/provider_paths\" /></provider>",
              "count": 1
            }
          ],
          ...
```
