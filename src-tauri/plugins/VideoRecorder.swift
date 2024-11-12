import AVFoundation
import Tauri

@objc(VideoRecorderPlugin)
class VideoRecorderPlugin: NSObject, TauriPlugin {
    private var captureSession: AVCaptureSession?
    private var videoOutput: AVCaptureMovieFileOutput?

    @objc func startRecording(_ call: TauriCall) {
        let session = AVCaptureSession()
        session.sessionPreset = .high

        guard let videoDevice = AVCaptureDevice.default(for: .video),
              let videoInput = try? AVCaptureDeviceInput(device: videoDevice),
              session.canAddInput(videoInput) else {
            call.reject("Cannot access camera")
            return
        }

        session.addInput(videoInput)

        let output = AVCaptureMovieFileOutput()
        if session.canAddOutput(output) {
            session.addOutput(output)
        }

        let outputPath = NSTemporaryDirectory() + "output.mov"
        let outputURL = URL(fileURLWithPath: outputPath)
        output.startRecording(to: outputURL, recordingDelegate: self)

        self.captureSession = session
        self.videoOutput = output

        session.startRunning()
        call.resolve(["path": outputPath])
    }

    @objc func stopRecording(_ call: TauriCall) {
        videoOutput?.stopRecording()
        captureSession?.stopRunning()
        call.resolve()
    }
}

extension VideoRecorderPlugin: AVCaptureFileOutputRecordingDelegate {
    func fileOutput(_ output: AVCaptureFileOutput, didFinishRecordingTo outputFileURL: URL, from connections: [AVCaptureConnection], error: Error?) {
        if let error = error {
            print("Error recording: \(error.localizedDescription)")
        } else {
            print("Recording finished: \(outputFileURL.path)")
        }
    }
}
