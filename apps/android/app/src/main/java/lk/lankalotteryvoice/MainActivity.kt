package lk.lankalotteryvoice

import android.app.Activity
import android.app.AlertDialog
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.provider.MediaStore
import android.view.View
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.ImageView
import android.widget.RadioGroup
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import java.io.File
import java.io.IOException
import java.util.Locale

class MainActivity : Activity() {
    private lateinit var languageSpinner: Spinner
    private lateinit var resultMessage: TextView
    private lateinit var resultMeta: TextView
    private lateinit var speechStatus: TextView
    private lateinit var photoPreview: ImageView
    private lateinit var removePhotoButton: Button
    private var textToSpeech: TextToSpeech? = null
    private var ttsReady = false
    private var selectedPhotoUri: Uri? = null
    private var pendingCameraUri: Uri? = null
    private var capturedPhotoFile: File? = null
    private var capturedPhotoUri: Uri? = null

    override fun attachBaseContext(newBase: Context) {
        val language = newBase.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_LANGUAGE, "en") ?: "en"
        val configuration = Configuration(newBase.resources.configuration)
        configuration.setLocale(Locale.forLanguageTag(language))
        super.attachBaseContext(newBase.createConfigurationContext(configuration))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val root = findViewById<View>(R.id.root_container)
        val initialPaddingLeft = root.paddingLeft
        val initialPaddingTop = root.paddingTop
        val initialPaddingRight = root.paddingRight
        val initialPaddingBottom = root.paddingBottom
        ViewCompat.setOnApplyWindowInsetsListener(root) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(
                initialPaddingLeft + bars.left,
                initialPaddingTop + bars.top,
                initialPaddingRight + bars.right,
                initialPaddingBottom + bars.bottom
            )
            insets
        }

        languageSpinner = findViewById(R.id.language_spinner)
        resultMessage = findViewById(R.id.result_message)
        resultMeta = findViewById(R.id.result_meta)
        speechStatus = findViewById(R.id.speech_status)
        photoPreview = findViewById(R.id.photo_preview)
        removePhotoButton = findViewById(R.id.remove_photo_button)

        val preferences = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val selectedLanguage = preferences.getString(KEY_LANGUAGE, "en") ?: "en"
        languageSpinner.setSelection(when (selectedLanguage) {
            "si" -> 1
            "ta" -> 2
            else -> 0
        }, false)
        languageSpinner.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
            private var firstSelection = true

            override fun onItemSelected(
                parent: android.widget.AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
                if (firstSelection) {
                    firstSelection = false
                    return
                }
                val newLanguage = when (position) {
                    1 -> "si"
                    2 -> "ta"
                    else -> "en"
                }
                val currentLanguage = preferences.getString(KEY_LANGUAGE, "en") ?: "en"
                if (newLanguage != currentLanguage) {
                    textToSpeech?.stop()
                    preferences.edit().putString(KEY_LANGUAGE, newLanguage).apply()
                    recreate()
                }
            }

            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) = Unit
        }

        findViewById<Button>(R.id.photo_button).setOnClickListener { showPhotoOptions() }
        removePhotoButton.setOnClickListener { removeSelectedPhoto() }
        findViewById<Button>(R.id.review_button).setOnClickListener { reviewTicketDetails() }
        findViewById<Button>(R.id.speak_button).setOnClickListener { speakStatus() }
        findViewById<Button>(R.id.stop_speech_button).setOnClickListener {
            textToSpeech?.stop()
            speechStatus.text = ""
        }
        findViewById<Button>(R.id.open_nlb_button).setOnClickListener {
            openOfficialSite("https://www.nlb.lk/")
        }
        findViewById<Button>(R.id.open_dlb_button).setOnClickListener {
            openOfficialSite("https://www.dlb.lk/")
        }

        textToSpeech = TextToSpeech(this) { status ->
            ttsReady = status == TextToSpeech.SUCCESS
            if (!ttsReady) speechStatus.setText(R.string.speech_unavailable)
        }
        restoreSavedState(savedInstanceState)
    }

    private fun restoreSavedState(state: Bundle?) {
        if (state == null) return
        findViewById<EditText>(R.id.lottery_name).setText(state.getString(STATE_LOTTERY_NAME, ""))
        findViewById<EditText>(R.id.draw_date).setText(state.getString(STATE_DRAW_DATE, ""))
        findViewById<EditText>(R.id.ticket_numbers).setText(state.getString(STATE_NUMBERS, ""))
        findViewById<EditText>(R.id.ticket_letters).setText(state.getString(STATE_LETTERS, ""))
        findViewById<RadioGroup>(R.id.board_group).check(
            if (state.getBoolean(STATE_IS_DLB, false)) R.id.board_dlb else R.id.board_nlb
        )
        findViewById<CheckBox>(R.id.confirm_details).isChecked = state.getBoolean(STATE_CONFIRMED, false)

        val capturedPath = state.getString(STATE_CAPTURED_FILE)
        if (capturedPath != null) {
            val file = File(capturedPath)
            if (file.exists()) capturedPhotoFile = file
        }
        val photoUriString = state.getString(STATE_PHOTO_URI)
        if (photoUriString != null) {
            val uri = Uri.parse(photoUriString)
            if (capturedPhotoFile != null) capturedPhotoUri = uri
            showLocalPhoto(uri)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putString(STATE_LOTTERY_NAME, findViewById<EditText>(R.id.lottery_name).text.toString())
        outState.putString(STATE_DRAW_DATE, findViewById<EditText>(R.id.draw_date).text.toString())
        outState.putString(STATE_NUMBERS, findViewById<EditText>(R.id.ticket_numbers).text.toString())
        outState.putString(STATE_LETTERS, findViewById<EditText>(R.id.ticket_letters).text.toString())
        outState.putBoolean(STATE_IS_DLB, findViewById<RadioGroup>(R.id.board_group).checkedRadioButtonId == R.id.board_dlb)
        outState.putBoolean(STATE_CONFIRMED, findViewById<CheckBox>(R.id.confirm_details).isChecked)
        selectedPhotoUri?.let { outState.putString(STATE_PHOTO_URI, it.toString()) }
        capturedPhotoFile?.let { outState.putString(STATE_CAPTURED_FILE, it.absolutePath) }
        super.onSaveInstanceState(outState)
    }

    private fun showPhotoOptions() {
        AlertDialog.Builder(this)
            .setTitle(R.string.photo_label)
            .setItems(R.array.photo_actions) { _, selected ->
                if (selected == 0) capturePhotoWithSystemCamera() else choosePhotoFromGallery()
            }
            .setNegativeButton(android.R.string.cancel, null)
            .show()
    }

    private fun choosePhotoFromGallery() {
        val intent = Intent(Intent.ACTION_GET_CONTENT).apply { type = "image/*" }
        startActivityForResult(
            Intent.createChooser(intent, getString(R.string.photo_button)),
            REQUEST_GALLERY
        )
    }

    private fun capturePhotoWithSystemCamera() {
        removeSelectedPhoto()
        try {
            val directory = File(cacheDir, "ticket-captures")
            if (!directory.exists() && !directory.mkdirs()) {
                speechStatus.setText(R.string.image_invalid)
                return
            }
            val outputFile = File.createTempFile("ticket_", ".jpg", directory)
            val outputUri = FileProvider.getUriForFile(
                this,
                "${packageName}.fileprovider",
                outputFile
            )
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
                putExtra(MediaStore.EXTRA_OUTPUT, outputUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            }
            if (intent.resolveActivity(packageManager) == null) {
                outputFile.delete()
                Toast.makeText(this, R.string.image_invalid, Toast.LENGTH_LONG).show()
                return
            }
            capturedPhotoFile?.delete()
            capturedPhotoFile = outputFile
            capturedPhotoUri = outputUri
            pendingCameraUri = outputUri
            startActivityForResult(intent, REQUEST_CAMERA)
        } catch (_: Exception) {
            capturedPhotoFile?.delete()
            capturedPhotoFile = null
            pendingCameraUri = null
            Toast.makeText(this, R.string.image_invalid, Toast.LENGTH_LONG).show()
        }
    }

    @Deprecated("Uses the platform activity result callback to keep the starter free of extra camera libraries.")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode != RESULT_OK) {
            if (requestCode == REQUEST_CAMERA) {
                capturedPhotoFile?.delete()
                capturedPhotoFile = null
                capturedPhotoUri = null
                pendingCameraUri = null
            }
            return
        }

        val uri = when (requestCode) {
            REQUEST_CAMERA -> pendingCameraUri
            REQUEST_GALLERY -> data?.data
            else -> null
        }
        if (requestCode == REQUEST_CAMERA) {
            pendingCameraUri = null
        } else if (requestCode == REQUEST_GALLERY) {
            capturedPhotoFile?.delete()
            capturedPhotoFile = null
            capturedPhotoUri = null
        }
        if (uri != null) showLocalPhoto(uri)
    }

    private fun showLocalPhoto(uri: Uri) {
        try {
            val mimeType = contentResolver.getType(uri)
            if (mimeType == null || !mimeType.startsWith("image/")) {
                throw IOException("Selected content is not an image")
            }

            val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            contentResolver.openInputStream(uri)?.use {
                BitmapFactory.decodeStream(it, null, bounds)
            } ?: throw IOException("Image could not be opened")

            if (bounds.outWidth <= 0 || bounds.outHeight <= 0) {
                throw IOException("Image dimensions are invalid")
            }
            if (bounds.outWidth.toLong() * bounds.outHeight.toLong() > MAX_IMAGE_PIXELS) {
                throw ImageTooLargeException()
            }

            val options = BitmapFactory.Options()
            var sampleSize = 1
            while (bounds.outWidth / sampleSize > MAX_PREVIEW_DIMENSION ||
                bounds.outHeight / sampleSize > MAX_PREVIEW_DIMENSION) {
                sampleSize *= 2
            }
            options.inSampleSize = sampleSize

            val bitmap = contentResolver.openInputStream(uri)?.use {
                BitmapFactory.decodeStream(it, null, options)
            } ?: throw IOException("Image preview could not be decoded")

            selectedPhotoUri = uri
            photoPreview.setImageBitmap(bitmap)
            photoPreview.visibility = View.VISIBLE
            removePhotoButton.visibility = View.VISIBLE
            speechStatus.text = ""
        } catch (_: ImageTooLargeException) {
            Toast.makeText(this, R.string.image_too_large, Toast.LENGTH_LONG).show()
            clearFailedCameraImage(uri)
        } catch (_: Exception) {
            Toast.makeText(this, R.string.image_invalid, Toast.LENGTH_LONG).show()
            clearFailedCameraImage(uri)
        }
    }

    private fun clearFailedCameraImage(uri: Uri) {
        if (uri == capturedPhotoUri) {
            capturedPhotoFile?.delete()
            capturedPhotoFile = null
            capturedPhotoUri = null
        }
        selectedPhotoUri = null
        photoPreview.setImageDrawable(null)
        photoPreview.visibility = View.GONE
        removePhotoButton.visibility = View.GONE
    }

    private fun removeSelectedPhoto() {
        capturedPhotoFile?.delete()
        capturedPhotoFile = null
        capturedPhotoUri = null
        pendingCameraUri = null
        selectedPhotoUri = null
        photoPreview.setImageDrawable(null)
        photoPreview.visibility = View.GONE
        removePhotoButton.visibility = View.GONE
    }

    private fun reviewTicketDetails() {
        val lotteryName = findViewById<EditText>(R.id.lottery_name).text.toString().trim()
        val numbers = findViewById<EditText>(R.id.ticket_numbers).text.toString().trim()
        val confirmed = findViewById<CheckBox>(R.id.confirm_details).isChecked

        if (lotteryName.isEmpty() || numbers.isEmpty() || !confirmed) {
            Toast.makeText(this, R.string.form_error, Toast.LENGTH_LONG).show()
            return
        }

        // No source connector or reviewed production rules exist yet: deliberately do not verdict a ticket.
        findViewById<TextView>(R.id.result_title).setText(R.string.result_title)
        resultMessage.setText(R.string.result_unavailable)
        resultMeta.setText(R.string.result_meta)
        speechStatus.text = ""
    }

    private fun speakStatus() {
        val engine = textToSpeech
        if (engine == null || !ttsReady) {
            speechStatus.setText(R.string.speech_not_ready)
            return
        }

        val language = when (languageSpinner.selectedItemPosition) {
            1 -> "si-LK"
            2 -> "ta-LK"
            else -> "en-LK"
        }
        val locale = Locale.forLanguageTag(language)
        val availability = engine.isLanguageAvailable(locale)
        if (availability < TextToSpeech.LANG_AVAILABLE) {
            speechStatus.setText(R.string.speech_unavailable)
            return
        }

        engine.language = locale
        val spokenText = "${resultMessage.text}. ${resultMeta.text}"
        val result = engine.speak(spokenText, TextToSpeech.QUEUE_FLUSH, null, "ticket-status")
        if (result == TextToSpeech.ERROR) {
            speechStatus.setText(R.string.speech_unavailable)
        } else {
            speechStatus.text = ""
        }
    }

    private fun openOfficialSite(url: String) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        } catch (_: ActivityNotFoundException) {
            Toast.makeText(this, R.string.browser_unavailable, Toast.LENGTH_LONG).show()
        }
    }

    override fun onPause() {
        textToSpeech?.stop()
        super.onPause()
    }

    override fun onDestroy() {
        if (isFinishing) {
            capturedPhotoFile?.delete()
            capturedPhotoFile = null
            capturedPhotoUri = null
        }
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        super.onDestroy()
    }

    private class ImageTooLargeException : IOException()

    companion object {
        private const val PREFS_NAME = "lanka_lottery_voice_preferences"
        private const val KEY_LANGUAGE = "language"
        private const val STATE_LOTTERY_NAME = "state_lottery_name"
        private const val STATE_DRAW_DATE = "state_draw_date"
        private const val STATE_NUMBERS = "state_numbers"
        private const val STATE_LETTERS = "state_letters"
        private const val STATE_IS_DLB = "state_is_dlb"
        private const val STATE_CONFIRMED = "state_confirmed"
        private const val STATE_PHOTO_URI = "state_photo_uri"
        private const val STATE_CAPTURED_FILE = "state_captured_file"
        private const val REQUEST_CAMERA = 1001
        private const val REQUEST_GALLERY = 1002
        private const val MAX_IMAGE_PIXELS = 40_000_000L
        private const val MAX_PREVIEW_DIMENSION = 1600
    }
}
