import AVFoundation
import Tauri
import UIKit
import WebKit

class VideoRecorderPlugin: Plugin {
  private var captureSession: AVCaptureSession?
  private var movieOutput: AVCaptureMovieFileOutput?
  private var videoOutputURL: URL?

  @objc public func startRecording(_ invoke: Invoke) throws {
    // Request camera and microphone permissions
    AVCaptureDevice.requestAccess(for: .video) { videoGranted in
      guard videoGranted else {
        invoke.reject("Camera access denied")
        return
      }
      AVCaptureDevice.requestAccess(for: .audio) { audioGranted in
        guard audioGranted else {
          invoke.reject("Microphone access denied")
          return
        }
        DispatchQueue.main.async {
          self.setupAndStartRecording(invoke: invoke)
        }
      }
    }
  }

  private func setupAndStartRecording(invoke: Invoke) {
    // Setup capture session
    captureSession = AVCaptureSession()
    guard let captureSession = captureSession else {
      invoke.reject("Failed to create capture session")
      return
    }

    // Setup video input
    guard let videoDevice = AVCaptureDevice.default(for: .video),
      let videoInput = try? AVCaptureDeviceInput(device: videoDevice),
      captureSession.canAddInput(videoInput)
    else {
      invoke.reject("Failed to add video input")
      return
    }
    captureSession.addInput(videoInput)

    // Setup audio input
    guard let audioDevice = AVCaptureDevice.default(for: .audio),
      let audioInput = try? AVCaptureDeviceInput(device: audioDevice),
      captureSession.canAddInput(audioInput)
    else {
      invoke.reject("Failed to add audio input")
      return
    }
    captureSession.addInput(audioInput)

    // Setup movie output
    movieOutput = AVCaptureMovieFileOutput()
    guard let movieOutput = movieOutput, captureSession.canAddOutput(movieOutput) else {
      invoke.reject("Failed to add movie output")
      return
    }
    captureSession.addOutput(movieOutput)

    // Start session
    captureSession.startRunning()

    // Define output file URL
    let outputDirectory = FileManager.default.temporaryDirectory
    videoOutputURL = outputDirectory.appendingPathComponent(UUID().uuidString)
      .appendingPathExtension("mov")

    // Start recording
    if let videoOutputURL = videoOutputURL {
      movieOutput.startRecording(to: videoOutputURL, recordingDelegate: self)
      invoke.resolve(["message": "Recording started"])
    } else {
      invoke.reject("Failed to create output file URL")
    }
  }

  @objc public func stopRecording(_ invoke: Invoke) throws {
    guard let movieOutput = movieOutput, movieOutput.isRecording else {
      invoke.reject("Recording is not in progress")
      return
    }
    movieOutput.stopRecording()
    invoke.resolve(["message": "Recording stopped"])
  }
}

extension VideoRecorderPlugin: AVCaptureFileOutputRecordingDelegate {
  func fileOutput(
    _ output: AVCaptureFileOutput, didFinishRecordingTo outputFileURL: URL,
    from connections: [AVCaptureConnection], error: Error?
  ) {
    if let error = error {
      print("Recording error: \(error.localizedDescription)")
    } else {
      // Handle the recorded video file as needed
      print("Video recorded to: \(outputFileURL.path)")
    }
  }
}

@_cdecl("tauri_plugin_video_recorder")
func initPlugin(name: SRString, webview: WKWebView?) {
  Tauri.registerPlugin(webview: webview, name: name.toString(), plugin: VideoRecorderPlugin())
}
